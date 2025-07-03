This is a TypeScript monorepo hosted on GitHub.

### Structure

The monorepo contains multiple packages, each with its own `package.json` file with the follwing characteristics:

- Its name should be scoped under the `@monorepo` namespace.
- It should be private.
- It should have a `type` field set to `module`.
