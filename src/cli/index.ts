import { Command } from 'commander';
import pkg from '../../package.json' with { type: 'json' };
import { registerInspectCommand } from './inspect.js';
import { registerMergeCommand } from './merge.js';
import { registerVersionCommand } from './version.js';

export function buildCli(): Command {
  const program = new Command();

  program
    .name('loomer')
    .description('Merge multiple files into a single AI-friendly document')
    .version(pkg.version)
    .addHelpText(
      'after',
      `\nQuick start:\n  loomer merge file1.md file2.json --out combined.md\n  loomer inspect notes.md`
    );

  registerMergeCommand(program);
  registerInspectCommand(program);
  registerVersionCommand(program);

  return program;
}
