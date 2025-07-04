import path from "node:path";
import { execSync } from "node:child_process";
import fs from "node:fs/promises";

const rootPath = path.resolve(import.meta.dirname, "..");

const [target] = process.argv.slice(2);

const workspacesJson = execSync("yarn workspaces list --json", {
  encoding: "utf8",
});
const workspaces = new Map(
  JSON.parse(`[${workspacesJson.trim().replace(/\n/g, ",")}]`).map((w) => [
    w.name,
    w.location,
  ])
);

if (!target || !workspaces.has(target)) {
  console.error("Workspace not found: %s", target);
  console.error(
    `Available workspaces: ${Array.from(workspaces.keys()).join(", ")}`
  );
  process.exit(1);
}

const candidateWorkspaces = [target];
const visitedWorkspaces = new Set();

while (candidateWorkspaces.length) {
  const workspace = candidateWorkspaces.pop();
  if (visitedWorkspaces.has(workspace)) continue;
  visitedWorkspaces.add(workspace);

  const packagePath = path.resolve(
    rootPath,
    workspaces.get(workspace),
    "package.json"
  );

  const { default: packageJson } = await import(packagePath, {
    with: { type: "json" },
  });

  const deps = [
    ...Object.entries(packageJson.dependencies || {}),
    ...Object.entries(packageJson.devDependencies || {}),
  ];

  for (const [dep, version] of deps) {
    if (version !== "workspace:*") continue;
    if (!workspaces.has(dep)) {
      console.warn(`Dependency ${dep} not found in workspaces.`);
      continue;
    }
    if (visitedWorkspaces.has(dep)) continue;

    candidateWorkspaces.push(dep);
  }
}

const dockerPath = path.resolve(rootPath, "docker");

await fs.rm(dockerPath, { recursive: true, force: true });
await fs.mkdir(dockerPath, { recursive: true });

for (const workspace of visitedWorkspaces) {
  const workspaceRelativePath = workspaces.get(workspace);
  const workspacePath = path.resolve(rootPath, workspaceRelativePath);
  const workspaceDockerPath = path.resolve(dockerPath, workspaceRelativePath);

  await fs.mkdir(workspaceDockerPath, { recursive: true });

  await fs.cp(
    path.resolve(workspacePath, "dist"),
    path.resolve(workspaceDockerPath, "dist"),
    { recursive: true }
  );

  if (workspace !== target) {
    await fs.copyFile(
      path.resolve(workspacePath, "package.json"),
      path.resolve(workspaceDockerPath, "package.json")
    );
  }
}
