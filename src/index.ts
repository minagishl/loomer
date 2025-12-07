#!/usr/bin/env bun
import { buildCli } from './cli/index.js';

async function main() {
  const program = buildCli();
  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(`Unexpected error: ${(error as Error).message}`);
  process.exit(1);
});
