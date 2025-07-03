# GitHub Workflows Documentation

This repository includes a comprehensive GitHub Actions workflow setup for the TypeScript monorepo.

## Workflows Overview

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Features:**

- **Smart change detection**: Only runs jobs for packages that have changed
- **Dependency management**: If `shared` package changes, it builds first before other packages
- **Parallel execution**: Non-dependent packages run in parallel for faster builds
- **Artifact management**: Uploads test coverage and build artifacts

**Job Flow:**

1. `detect-changes` - Determines which packages have changed
2. `test-shared` + `build-shared` - Runs if shared package changed
3. `test-package-*` + `build-package-*` - Runs for each changed package after shared is built

### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**

- Git tags starting with `v*` (e.g., `v1.0.0`)
- Manual workflow dispatch

**Features:**

- Builds all packages using matrix strategy
- Creates GitHub releases for tagged versions
- Runs full test suite before release

### 3. PR Validation Workflow (`.github/workflows/pr-validation.yml`)

**Triggers:**

- Pull request events (opened, synchronize, reopened)

**Features:**

- **Semantic PR title validation**: Enforces conventional commit format
- **Code quality checks**: TypeScript compilation and package.json validation
- **Bundle size analysis**: Shows size impact of changes

### 4. Maintenance Workflow (`.github/workflows/maintenance.yml`)

**Triggers:**

- Scheduled weekly runs (Mondays at 9 AM UTC)
- Manual workflow dispatch

**Features:**

- Dependency auditing and outdated package detection
- Security scanning with CodeQL
- Automatic cleanup of old workflow runs

## Composite Actions

To avoid duplication, the setup includes reusable composite actions:

### `.github/actions/setup-node-cache`

- Sets up Node.js using version from `.nvmrc`
- Configures Yarn caching
- Installs dependencies with Corepack

### `.github/actions/setup-turborepo-cache`

- Configures Turborepo caching using GitHub Actions cache
- Optimizes build performance across workflow runs

### `.github/actions/run-package-tests`

- Runs tests for a specific package using Turborepo
- Uploads coverage reports as artifacts

### `.github/actions/build-package`

- Builds a specific package using Turborepo
- Uploads build artifacts

## Caching Strategy

### Node.js Dependencies

- Uses GitHub Actions built-in Yarn caching
- Cache key based on `yarn.lock` file

### Turborepo Cache

- Uses GitHub Actions cache for Turborepo artifacts
- Cache key includes runner OS and commit SHA
- Restore keys provide fallback to previous builds

### Build Artifacts

- Test coverage and build outputs stored as workflow artifacts
- 30-day retention period for debugging and analysis

## Change Detection Logic

The workflow uses `dorny/paths-filter` to detect changes:

```yaml
shared:
  - "packages/shared/**"
package-a:
  - "packages/a/**"
  - "packages/shared/**" # Also triggers if shared changes
```

This ensures that:

- Changes to `shared` trigger its own jobs and all dependent packages
- Changes to individual packages only trigger their specific jobs
- Builds are optimized to run only when necessary

## Dependency Management

### Shared Package Priority

- If `shared` package changes, it builds first
- Other packages wait for `shared` to complete successfully
- Uses `needs` and conditional logic to orchestrate execution

### Conditional Execution

```yaml
if: |
  always() &&
  needs.detect-changes.outputs.package-a-changed == 'true' &&
  (needs.build-shared.result == 'success' || needs.build-shared.result == 'skipped')
```

This pattern ensures packages only run when:

1. They have changes detected
2. Shared package build completed successfully (or was skipped)

## Best Practices Implemented

✅ **Latest GitHub Actions**: All actions use latest versions (`@v4`, `@v3`)
✅ **Efficient Caching**: Multiple caching layers for dependencies and builds
✅ **Smart Execution**: Only runs jobs for changed packages
✅ **Proper Dependencies**: Shared package builds before dependents
✅ **Artifact Management**: Coverage and build outputs preserved
✅ **Security**: Regular dependency audits and CodeQL scanning
✅ **Code Quality**: TypeScript compilation and package validation
✅ **Documentation**: Comprehensive workflow documentation

## Usage Examples

### Running Workflows Locally

To test the setup locally, you can simulate the workflow logic:

```bash
# Install dependencies
yarn install

# Run tests for specific package
yarn turbo test --filter=shared

# Build specific package
yarn turbo build --filter=a

# Build all packages
yarn turbo build

# Run tests with coverage
yarn turbo test
```

### Creating a Release

1. Create and push a tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

2. The release workflow will automatically:
   - Run full test suite
   - Build all packages
   - Create GitHub release

### Manual Workflow Triggers

All workflows except CI can be triggered manually:

1. Go to Actions tab in GitHub
2. Select the workflow
3. Click "Run workflow"
4. Choose branch and click "Run workflow"

## Troubleshooting

### Common Issues

**1. Shared package not building first**

- Check if `detect-changes` job outputs are correct
- Verify conditional logic in dependent jobs

**2. Cache not working**

- Ensure cache keys are consistent
- Check if cache size exceeds GitHub limits (10GB per repo)

**3. Tests failing unexpectedly**

- Check if dependencies are properly installed
- Verify Turborepo configuration in `turbo.json`

**4. Package validation failing**

- Ensure all `package.json` files follow monorepo conventions
- Check that workspace dependencies use `workspace:*` protocol
