import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mergeDocuments } from '../core/merger.js';
import { formatOutput } from '../core/formatter.js';
import { parseFile } from '../core/parsers/index.js';
import { optimizeText } from '../core/optimizer.js';
import { MergeMetadata, OutputFormat } from '../core/types.js';
import { log } from '../utils/logger.js';
import { expandPaths } from '../utils/paths.js';

const normalizeFormat = (value?: string): OutputFormat | null => {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower === 'md' || lower === 'markdown') return 'markdown';
  if (lower === 'txt' || lower === 'text') return 'text';
  if (lower === 'html') return 'html';
  if (lower === 'json') return 'json';
  return null;
};

const formatFromPath = (outPath?: string): OutputFormat | null => {
  if (!outPath) return null;
  const ext = path.extname(outPath).replace('.', '').toLowerCase();
  if (ext === 'md' || ext === 'markdown') return 'markdown';
  if (ext === 'txt') return 'text';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'json') return 'json';
  return null;
};

export function registerMergeCommand(program: Command) {
  program
    .command('merge')
    .argument('<files...>', 'list of files to merge in order')
    .option('-o, --out <path>', 'write result to file (defaults to merged.md; use - for stdout)')
    .option('-f, --format <format>', 'output format: markdown | text | html | json')
    .option('--metadata', 'include parsed metadata in the output', false)
    .option('--optimize', 'run text optimizer before formatting', false)
    .description('Merge multiple files into one AI-optimized document')
    .addHelpText(
      'afterAll',
      `\nExamples:\n  loomer merge notes.md design.html data.json --out summary.md --format markdown\n  loomer merge docs/ --format text\n  loomer merge a.txt b.yaml --format html\n`
    )
    .action(
      async (
        files: string[],
        options: { out?: string; format?: OutputFormat; metadata?: boolean; optimize?: boolean }
      ) => {
        if (!files || files.length === 0) {
          log.error('No files provided to merge.');
          process.exit(1);
        }

        const outPath = options.out ?? 'merged.md';
        const format = normalizeFormat(options.format) || formatFromPath(outPath) || 'markdown';
        if (!['markdown', 'text', 'html', 'json'].includes(format)) {
          log.error(`Unsupported format: ${String(format)}. Use markdown, text, html, or json.`);
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
            includeMetadata: Boolean(options.metadata),
          });
          const optimized = options.optimize ? optimizeText(merged.content) : merged.content;
          const meta: MergeMetadata = {
            fileCount: expanded.length,
            timestamp: new Date().toISOString(),
          };
          const formatted = formatOutput(optimized, format, meta);

          if (outPath === '-') {
            log.info(formatted);
          } else {
            await writeFile(outPath, formatted, 'utf8');
            log.info(`Merged ${expanded.length} file(s) -> ${outPath}`);
          }
        } catch (error) {
          log.error(`Merge failed: ${(error as Error).message}`);
          process.exit(1);
        }
      }
    );
}
