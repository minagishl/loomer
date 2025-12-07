import { readdir, stat } from 'fs/promises';
import path from 'path';

const IGNORE_DIRS = new Set(['.git', 'node_modules', '.next', '.turbo']);

const SUPPORTED_EXTENSIONS = new Set([
  '.md',
  '.markdown',
  '.html',
  '.htm',
  '.json',
  '.yaml',
  '.yml',
  '.txt',
]);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  // Sort for deterministic order
  const sorted = entries.slice().sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of sorted) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.size === 0 || SUPPORTED_EXTENSIONS.has(ext) || ext === '') {
        files.push(fullPath);
      }
    }
  }

  return files;
}

export async function expandPaths(inputs: string[]): Promise<string[]> {
  const results: string[] = [];

  for (const input of inputs) {
    const stats = await stat(input);
    if (stats.isDirectory()) {
      const nestedFiles = await walk(input);
      results.push(...nestedFiles);
    } else if (stats.isFile()) {
      results.push(input);
    }
  }

  return results;
}
