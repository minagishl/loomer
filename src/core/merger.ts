import { normalizeDocument } from './normalizer.js';
import { LoomerDocument, LoomerNode, MergeOptions, MergeResult } from './types.js';

const renderHeadingMd = (node: LoomerNode) =>
  `${'#'.repeat(Math.min(6, node.depth || 2))} ${node.value}`;

function renderMetadata(metadata: Record<string, string | number | boolean>): string {
  const rows = Object.entries(metadata).map(([key, value]) => `${key}: ${value}`);
  return rows.join('\n');
}

function renderNode(node: LoomerNode): string {
  if (node.kind === 'heading') return renderHeadingMd(node);
  if (node.kind === 'code') return ['```' + (node.language || ''), node.value, '```'].join('\n');
  return node.value;
}

function renderDocument(doc: LoomerDocument, includeMetadata = false): string {
  const parts: string[] = [];

  if (includeMetadata && doc.metadata && Object.keys(doc.metadata).length) {
    const metaBlock = renderMetadata(doc.metadata);
    parts.push('> metadata', ...metaBlock.split('\n').map((line) => `> ${line}`));
  }

  for (const node of doc.nodes) {
    parts.push(renderNode(node));
  }

  return parts.filter(Boolean).join('\n\n').trim();
}

function renderBanner(doc: LoomerDocument): string {
  return ['---', doc.source, '---'].join('\n');
}

export function mergeDocuments(documents: LoomerDocument[], options: MergeOptions): MergeResult {
  const normalized = documents.map(normalizeDocument);

  const rendered = normalized.map((doc) => {
    const banner = renderBanner(doc);
    const body = renderDocument(doc, options.includeMetadata);
    return [banner, body].filter(Boolean).join('\n\n').trim();
  });

  const content = rendered.join('\n\n').trim();
  return { content, documents: normalized };
}
