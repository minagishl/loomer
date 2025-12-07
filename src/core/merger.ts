import { normalizeDocument } from './normalizer.js';
import { LoomerDocument, LoomerFormat, LoomerNode, MergeOptions } from './types.js';

const renderHeadingMd = (node: LoomerNode) =>
  `${'#'.repeat(Math.min(6, node.depth || 2))} ${node.value}`;
const renderHeadingTxt = (node: LoomerNode) => node.value.toUpperCase();

function renderMetadata(metadata: Record<string, string | number | boolean>): string {
  const rows = Object.entries(metadata).map(([key, value]) => `${key}: ${value}`);
  return rows.join('\n');
}

function renderNode(node: LoomerNode, format: LoomerFormat): string {
  switch (format) {
    case 'md':
      if (node.kind === 'heading') return renderHeadingMd(node);
      if (node.kind === 'code')
        return ['```' + (node.language || ''), node.value, '```'].join('\n');
      return node.value;
    case 'txt':
      if (node.kind === 'heading') return renderHeadingTxt(node);
      if (node.kind === 'code') return node.value;
      return node.value;
    case 'json':
      return node.value;
    default:
      return node.value;
  }
}

function renderDocument(
  doc: LoomerDocument,
  format: LoomerFormat,
  includeMetadata = false
): string {
  const parts: string[] = [];

  if (includeMetadata && doc.metadata && Object.keys(doc.metadata).length) {
    const metaBlock = renderMetadata(doc.metadata);
    if (format === 'md') {
      parts.push('> metadata', ...metaBlock.split('\n').map((line) => `> ${line}`));
    } else {
      parts.push(metaBlock);
    }
  }

  for (const node of doc.nodes) {
    parts.push(renderNode(node, format));
  }

  return parts.filter(Boolean).join('\n\n').trim();
}

function renderBanner(doc: LoomerDocument, format: LoomerFormat): string {
  if (format === 'json') return doc.source;
  return ['---', doc.source, '---'].join('\n');
}

export function mergeDocuments(
  documents: LoomerDocument[],
  options: MergeOptions
): { content: string; format: LoomerFormat } {
  const format = options.format;
  const normalized = documents.map(normalizeDocument);

  if (format === 'json') {
    const payload = normalized.map((doc) => ({
      source: doc.source,
      type: doc.type,
      metadata: doc.metadata ?? {},
      nodes: doc.nodes,
    }));
    return {
      format,
      content: JSON.stringify({ mergedAt: new Date().toISOString(), documents: payload }, null, 2),
    };
  }

  const rendered = normalized.map((doc) => {
    const banner = renderBanner(doc, format);
    const body = renderDocument(doc, format, options.includeMetadata);
    return [banner, body].filter(Boolean).join('\n\n').trim();
  });

  const content = rendered.join('\n\n').trim();
  return { content, format };
}
