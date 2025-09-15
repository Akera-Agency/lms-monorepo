#!/usr/bin/env bun

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

type PackageJson = {
  name: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  overrides?: Record<string, string>;
};

const errors: string[] = [];
const warnings: string[] = [];

// Load root package.json to get workspace-wide versions
function loadRootPackageJson(): PackageJson {
  try {
    const content = readFileSync(join(process.cwd(), 'package.json'), 'utf-8');
    return JSON.parse(content) as PackageJson;
  } catch (error) {
    throw new Error(`Failed to load root package.json: ${error}`);
  }
}

const rootPkg = loadRootPackageJson();

// Get pinned versions from root package.json
function getWorkspaceVersions(): Record<string, string> {
  const versions: Record<string, string> = {};

  // Get versions from overrides (these are enforced)
  if (rootPkg.overrides) {
    Object.entries(rootPkg.overrides).forEach(([dep, version]) => {
      versions[dep] = version;
    });
  }

  // Also check root dependencies for common packages
  const commonDeps = ['react', 'react-dom', 'typescript', 'zod'];
  commonDeps.forEach((dep) => {
    if (rootPkg.dependencies?.[dep]) {
      versions[dep] = rootPkg.dependencies[dep];
    }
    if (rootPkg.devDependencies?.[dep]) {
      versions[dep] = rootPkg.devDependencies[dep];
    }
  });

  return versions;
}

const workspaceVersions = getWorkspaceVersions();

function checkPackage(path: string, pkg: PackageJson) {
  const isPublishable = !pkg.private;
  const isApp = path.includes('/apps/');
  const isLib = path.includes('/packages/');
  const isRoot = pkg.name === rootPkg.name;

  // Skip validation for root package
  if (isRoot) return;

  // Rule 1: Non-publishable libs should not have dependencies
  if (
    isLib &&
    !isPublishable &&
    pkg.dependencies &&
    Object.keys(pkg.dependencies).length > 0
  ) {
    const nonInternalDeps = Object.keys(pkg.dependencies).filter(
      (dep) => !dep.startsWith('@akera/'),
    );
    if (nonInternalDeps.length > 0) {
      errors.push(
        `${pkg.name}: Non-publishable library has external dependencies: ${nonInternalDeps.join(', ')}`,
      );
    }
  }

  // Rule 2: Publishable libs using React should have it in peerDependencies
  if (isPublishable && isLib) {
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const hasReact = Object.keys(deps).some(
      (dep) => dep === 'react' || dep === 'react-dom',
    );
    const hasReactInPeer =
      pkg.peerDependencies &&
      (pkg.peerDependencies['react'] || pkg.peerDependencies['react-dom']);

    if (hasReact && !hasReactInPeer) {
      errors.push(
        `${pkg.name}: Publishable library uses React but doesn't have it in peerDependencies`,
      );
    }
  }

  // Rule 3: Apps should use workspace protocol for internal dependencies
  if (isApp && pkg.dependencies) {
    Object.entries(pkg.dependencies).forEach(([dep, version]) => {
      if (dep.startsWith('@akera/') && version !== 'workspace:*') {
        errors.push(
          `${pkg.name}: App should use workspace:* for internal dependency ${dep}, found ${version}`,
        );
      }
    });
  }

  // Rule 4: Check for duplicate React/React-DOM in dependencies
  if (isLib && pkg.dependencies) {
    if (pkg.dependencies['react'] || pkg.dependencies['react-dom']) {
      warnings.push(
        `${pkg.name}: Library has React/React-DOM in dependencies instead of peerDependencies`,
      );
    }
  }

  // Rule 5: Check workspace-wide version consistency
  Object.entries(workspaceVersions).forEach(([depName, expectedVersion]) => {
    const actualVersion =
      pkg.dependencies?.[depName] ||
      pkg.devDependencies?.[depName] ||
      pkg.peerDependencies?.[depName];

    if (
      actualVersion &&
      actualVersion !== expectedVersion &&
      !actualVersion.startsWith('workspace:') &&
      !actualVersion.includes('||')
    ) {
      // Skip range versions like "^18.2.0 || ^19.0.0"
      warnings.push(
        `${pkg.name}: ${depName} version ${actualVersion} doesn't match workspace version ${expectedVersion}`,
      );
    }
  });
}

function findPackageJsonFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (
        stat.isDirectory() &&
        entry !== 'node_modules' &&
        entry !== 'dist' &&
        entry !== '.git'
      ) {
        walk(fullPath);
      } else if (entry === 'package.json') {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// Main validation
const rootDir = process.cwd();
const packageFiles = findPackageJsonFiles(rootDir);

for (const file of packageFiles) {
  try {
    const content = readFileSync(file, 'utf-8');
    const pkg = JSON.parse(content) as PackageJson;

    if (pkg.name) {
      checkPackage(file, pkg);
    }
  } catch (error) {
    errors.push(`Failed to parse ${file}: ${error}`);
  }
}

// Output results
if (errors.length > 0) {
  console.error('❌ Dependency validation errors:');
  errors.forEach((error) => console.error(`  - ${error}`));
}

if (warnings.length > 0) {
  console.warn('\n⚠️  Dependency validation warnings:');
  warnings.forEach((warning) => console.warn(`  - ${warning}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All dependency validations passed!');
}

// Exit with error code if there are errors
if (errors.length > 0) {
  process.exit(1);
}
