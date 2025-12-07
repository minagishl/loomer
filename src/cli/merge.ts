import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mergeDocuments } from '../core/merger.js';
import { parseFile } from '../core/parsers/index.js';
import { LoomerFormat } from '../core/types.js';
import { log } from '../utils/logger.js';
import { expandPaths } from '../utils/paths.js';

const formatFromPath = (outPath?: string): LoomerFormat | null => {
  if (!outPath) return null;
  const ext = path.extname(outPath).replace('.', '').toLowerCase();
  if (ext === 'md' || ext === 'markdown') return 'md';
  if (ext === 'txt') return 'txt';
  if (ext === 'json') return 'json';
  return null;
};

export function registerMergeCommand(program: Command) {
  program
    .command('merge')
    .argument('<files...>', 'list of files to merge in order')
    .option('-o, --out <path>', 'write result to file (defaults to merged.md; use - for stdout)')
    .option('-f, --format <format>', 'output format: txt | md | json')
    .option('--metadata', 'include parsed metadata in the output', false)
    .description('Merge multiple files into one AI-optimized document')
    .addHelpText(
      'afterAll',
      `\nExamples:\n  loomer merge notes.md design.html data.json --out summary.md\n  loomer merge docs/ --format txt\n  loomer merge a.txt b.yaml --format txt\n`
    )
    .action(
      async (
        files: string[],
        options: { out?: string; format?: LoomerFormat; metadata?: boolean }
      ) => {
        if (!files || files.length === 0) {
          log.error('No files provided to merge.');
          process.exit(1);
        }

        const outPath = options.out ?? 'merged.md';
        const format =
          (options.format as LoomerFormat | undefined) || formatFromPath(outPath) || 'md';
        if (!['txt', 'md', 'json'].includes(format)) {
          log.error(`Unsupported format: ${format}. Use txt, md, or json.`);
          process.exit(1);
        }

        try {
          const expanded = await expandPaths(files);
          if (expanded.length === 0) {
            log.error('No files found to merge (after expanding directories).');
            process.exit(1);
          }

          const docs = await Promise.all(expanded.map((file) => parseFile(file)));
          const merged = mergeDocuments(docs, {
            format,
            includeMetadata: Boolean(options.metadata),
          });

          if (outPath === '-') {
            log.info(merged.content);
          } else {
            await writeFile(outPath, merged.content, 'utf8');
            log.info(`Merged ${expanded.length} file(s) -> ${outPath}`);
          }
        } catch (error) {
          log.error(`Merge failed: ${(error as Error).message}`);
          process.exit(1);
        }
      }
    );
}
