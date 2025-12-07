import { readFile } from 'fs/promises';
import path from 'path';
import { FileType, LoomerDocument } from '../types.js';
import { parseMarkdown } from './markdown.js';
import { parseHtml } from './html.js';
import { parseJson } from './json.js';
import { parseYaml } from './yaml.js';
import { parseText } from './text.js';

export function detectFileType(filePath: string): FileType {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.md':
    case '.markdown':
      return 'markdown';
    case '.html':
    case '.htm':
      return 'html';
    case '.json':
      return 'json';
    case '.yaml':
    case '.yml':
      return 'yaml';
    default:
      return 'text';
  }
}

export async function parseFile(filePath: string): Promise<LoomerDocument> {
  const type = detectFileType(filePath);
  const content = await readFile(filePath, 'utf8');
  switch (type) {
    case 'markdown':
      return parseMarkdown(content, filePath);
    case 'html':
      return parseHtml(content, filePath);
    case 'json':
      return parseJson(content, filePath);
    case 'yaml':
      return parseYaml(content, filePath);
    case 'text':
    default:
      return parseText(content, filePath);
  }
}
