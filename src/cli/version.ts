import { Command } from 'commander';
import pkg from '../../package.json' with { type: 'json' };
import { log } from '../utils/logger.js';

export function registerVersionCommand(program: Command) {
  program
    .command('version')
    .description('Print Loomer version')
    .action(() => {
      log.info(`loomer v${pkg.version}`);
    });
}
