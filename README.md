# monorepo-workflows

Testing GitHub Action workflow setups in a monorepo.

Packages:

- [`a`](packages/a): A package that depends on `shared`.
- [`b`](packages/b): A package that depends on `shared`.
- [`c`](packages/c): A package that depends on `shared`.
- [`shared`](packages/shared): A shared package used by `a`, `b`, and `c`.
