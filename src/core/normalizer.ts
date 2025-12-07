import { LoomerDocument, LoomerNode } from './types.js';

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

export function normalizeNodes(nodes: LoomerNode[]): LoomerNode[] {
  return nodes.map((node) => {
    if (node.kind === 'heading' || node.kind === 'paragraph' || node.kind === 'raw') {
      return { ...node, value: normalizeWhitespace(node.value) };
    }

    if (node.kind === 'code') {
      return { ...node, value: node.value.replace(/\s+$/g, '').trimEnd() };
    }

    if (node.kind === 'metadata') {
      return { ...node, value: normalizeWhitespace(node.value) };
    }

    return node;
  });
}

export function normalizeDocument(doc: LoomerDocument): LoomerDocument {
  return { ...doc, nodes: normalizeNodes(doc.nodes) };
}
