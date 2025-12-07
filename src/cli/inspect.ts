import { Command } from 'commander';
import { parseFile, detectFileType } from '../core/parsers/index.js';
import { log } from '../utils/logger.js';

export function registerInspectCommand(program: Command) {
  program
    .command('inspect')
    .argument('<path>', 'file to inspect')
    .description('Show how Loomer will interpret a file')
    .addHelpText('afterAll', '\nExample:\n  loomer inspect README.md\n')
    .action(async (file: string) => {
      try {
        const type = detectFileType(file);
        const doc = await parseFile(file);
        const headingSamples = doc.nodes.filter((n) => n.kind === 'heading').slice(0, 3);
        const summary = {
          source: doc.source,
          detectedType: type,
          nodeCount: doc.nodes.length,
          headings: headingSamples.map((h) => h.value),
          hasMetadata: Boolean(doc.metadata && Object.keys(doc.metadata).length),
        };
        log.info(JSON.stringify(summary, null, 2));
      } catch (error) {
        log.error(`Inspect failed: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
