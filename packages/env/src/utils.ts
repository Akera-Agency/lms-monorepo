import * as path from 'node:path';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';
import * as dotenvFlow from 'dotenv-flow';
import * as dotenvExpand from 'dotenv-expand';
import { z } from 'zod';
import { schema } from './index';

// Find workspace root (Nx sets NX_WORKSPACE_ROOT; fallback to git root probe)
function findWorkspaceRoot() {
  if (process.env.NX_WORKSPACE_ROOT) return process.env.NX_WORKSPACE_ROOT;
  let dir = process.cwd();
  while (dir !== path.parse(dir).root) {
    if (
      fs.existsSync(path.join(dir, 'nx.json')) ||
      fs.existsSync(path.join(dir, '.git'))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

const WORKSPACE_ROOT = findWorkspaceRoot();
const ENV_DIR = WORKSPACE_ROOT;

function loadDotenvStack(opts?: { app?: string; nodeEnv?: string }) {
  const nodeEnv = opts?.nodeEnv ?? process.env.NODE_ENV ?? 'development';

  // Load shared stack from /env
  const res = dotenvFlow.config({
    path: ENV_DIR,
    node_env: nodeEnv,
    purge_dotenv: true,
    silent: true,
  });
  dotenvExpand.expand(res);

  // Optional per-app overlay: env/.env.<app>.local (if present)
  if (opts?.app) {
    const overlay = path.join(ENV_DIR, `.env.${opts.app}.local`);
    if (fs.existsSync(overlay)) {
      dotenvExpand.expand(dotenv.config({ path: overlay, override: true }));
    }
  }
}

function envSource() {
  // Use Bun.env during Bun tests, else process.env
  const isBun = typeof globalThis.Bun !== 'undefined';
  if (isBun && (process.env.NODE_ENV ?? 'development') === 'test') {
    return globalThis.Bun.env;
  }
  return process.env;
}

/** Load once per process and export typed env for everyone */
let cached: z.infer<typeof schema> | null = null;

export function loadSharedEnv(opts?: { app?: string; nodeEnv?: string }) {
  if (cached) return cached;
  loadDotenvStack(opts);
  const parsed = schema.parse(envSource());
  cached = Object.freeze(parsed);
  return cached;
}
