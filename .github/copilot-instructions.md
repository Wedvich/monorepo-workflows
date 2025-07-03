This is a TypeScript monorepo hosted on GitHub.

### Tools

Yarn is used with Corepack for managing dependencies. Turborepo is used for task orchestration and caching.

### Structure

The monorepo contains multiple packages, each with its own `package.json` file with the follwing characteristics:

- Its name should be scoped under the `@monorepo` namespace.
- It should be private.
- It should have a `type` field set to `module`.
- It should have a `build` command that compiles the TypeScript code to JavaScript.
- It should have a `test` command that runs the tests with coverage.
- It should use `vitest` for testing and `v8` for coverage.

Workspaces that depend on other workspaces should use the `workspace:*` protocol to reference them.
