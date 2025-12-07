import YAML from 'yaml';
import { LoomerDocument, LoomerNode } from '../types.js';

const headingPattern = /^(#{1,6})\s+(.*)$/;

export function parseMarkdown(content: string, source: string): LoomerDocument {
  const normalized = content.replace(/\r\n?/g, '\n');
  const lines = normalized.split('\n');
  const nodes: LoomerNode[] = [];
  let metadata: Record<string, string | number | boolean> | undefined;

  // frontmatter
  if (lines[0]?.trim() === '---') {
    const closingIndex = lines.slice(1).findIndex((line) => line.trim() === '---');
    if (closingIndex !== -1) {
      const end = closingIndex + 1;
      const yamlBlock = lines.slice(1, end).join('\n');
      const parsed = YAML.parse(yamlBlock);
      if (parsed && typeof parsed === 'object') {
        const safeMeta: Record<string, string | number | boolean> = {};
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
          ) {
            safeMeta[key] = value;
          }
        }
        metadata = Object.keys(safeMeta).length ? safeMeta : undefined;
      }
      lines.splice(0, end + 1);
    }
  }

  let inCode = false;
  let codeLang = '';
  const codeLines: string[] = [];
  const paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const value = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (value) nodes.push({ kind: 'paragraph', value });
    paragraph.length = 0;
  };

  const flushCode = () => {
    if (!inCode) return;
    nodes.push({ kind: 'code', language: codeLang || undefined, value: codeLines.join('\n') });
    codeLines.length = 0;
    inCode = false;
    codeLang = '';
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/g, '');

    if (line.startsWith('```')) {
      if (!inCode) {
        flushParagraph();
        inCode = true;
        codeLang = line.replace(/```/, '').trim();
      } else {
        flushCode();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    const headingMatch = headingPattern.exec(line.trim());
    if (headingMatch) {
      flushParagraph();
      const depth = headingMatch[1].length;
      const value = headingMatch[2].trim();
      nodes.push({ kind: 'heading', value, depth });
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushCode();

  return { source, type: 'markdown', nodes, metadata };
}
