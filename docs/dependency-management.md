# Dependency Management Implementation

This workspace now follows a comprehensive dependency management plan with the following key features:

## 1. Root Package Management

The root `package.json` centralizes common dependencies and enforces version consistency:

- **Common frameworks**: React, React-DOM, Zod, and other shared dependencies
- **Global overrides**: TypeScript, tslib, and zod versions are pinned across the workspace
- **Management scripts**:
  - `dep:check` - Check for dependency mismatches
  - `dep:fix` - Auto-fix dependency mismatches
  - `dep:update` - Update all dependencies to latest
  - `dep:validate` - Validate dependency rules
  - `migrate` - Handle Nx framework updates

## 2. Package Patterns

### Publishable Libraries (@akera/ui, @akera/s3)

- External runtime dependencies that consumers shouldn't provide go in `dependencies`
- Framework dependencies (React, etc.) go in `peerDependencies`
- Build/test dependencies go in `devDependencies`

### Non-publishable Libraries (@akera/auth, @akera/supabase)

- Marked as `private: true`
- Use `peerDependencies` for shared dependencies
- No external `dependencies` unless absolutely required

### Apps (auth, tenant, user, student)

- Use `workspace:*` protocol for internal dependencies
- Minimal external dependencies
- Inherit most dependencies from root

## 3. Automated Tools

### Syncpack

Configuration in `.syncpackrc.json`:

- Enforces workspace protocol for internal packages
- Ensures React/React-DOM version compatibility
- Maintains sorted dependencies

### Renovate

Configuration in `renovate.json`:

- Groups related packages (nx, react, server stacks)
- Auto-merges minor/patch updates
- Weekly schedule for updates
- Major updates require manual review

### Dependency Validation Script

Custom script at `scripts/validate-deps.ts`:

- Validates non-publishable libs don't have external dependencies
- Ensures publishable libs have React in peerDependencies
- Checks workspace protocol usage in apps
- Verifies version consistency based on root package.json
- Reads versions from root `overrides` and common dependencies
- No hardcoded versions - all configuration comes from root package.json

## 4. CI/CD Integration

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Validates dependencies on every PR
- Runs affected commands for better performance
- Ensures lockfile is committed and valid

## 5. Daily Maintenance

Run these commands regularly:

- `bun run dep:check` - See dependency drift
- `bun run dep:fix` - Auto-fix version mismatches
- `bun run dep:update` - Update to latest versions
- `bun run dep:validate` - Ensure rules compliance
- `bun run migrate` - Handle framework updates

## 6. Decision Tree

When adding dependencies:

- **Shared by consumers?** → `peerDependencies`
- **Hard runtime requirement?** → `dependencies` (use sparingly)
- **Build/test only?** → `devDependencies`
- **Internal packages?** → `workspace:*`

This setup ensures consistent versions, prevents duplicate dependencies, and maintains a clean dependency graph across the monorepo.
