import { LoomerDocument, LoomerNode } from '../types.js';

export function parseText(content: string, source: string): LoomerDocument {
  const normalized = content.replace(/\r\n?/g, '\n').trim();
  const segments = normalized.split(/\n{2,}/);
  const nodes: LoomerNode[] = segments
    .map((segment) => segment.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .map((value) => ({ kind: 'paragraph', value }));

  return { source, type: 'text', nodes };
}
