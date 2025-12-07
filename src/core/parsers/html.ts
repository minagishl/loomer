import { parse, NodeType, HTMLElement, TextNode } from 'node-html-parser';
import { LoomerDocument, LoomerNode } from '../types.js';

export function parseHtml(content: string, source: string): LoomerDocument {
  const root = parse(content, { blockTextElements: { script: true, style: true } });
  const nodes: LoomerNode[] = [];

  const pushParagraph = (value: string) => {
    const cleaned = value.replace(/\s+/g, ' ').trim();
    if (cleaned) nodes.push({ kind: 'paragraph', value: cleaned });
  };

  const walk = (node: HTMLElement | TextNode) => {
    if (node.nodeType === NodeType.TEXT_NODE) {
      const textNode = node as TextNode;
      pushParagraph(textNode.rawText);
      return;
    }

    const element = node as HTMLElement;
    const tag = element.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tag)) {
      const depth = Number(tag[1]);
      const value = element.text.trim();
      if (value) nodes.push({ kind: 'heading', value, depth });
      return;
    }

    if (tag === 'p') {
      pushParagraph(element.text);
      return;
    }

    if (tag === 'code' || tag === 'pre') {
      const language = element.getAttribute('class')?.replace(/^language-/, '');
      nodes.push({ kind: 'code', language: language || undefined, value: element.text.trim() });
      return;
    }

    for (const child of element.childNodes) {
      if (child.nodeType === NodeType.TEXT_NODE || child.nodeType === NodeType.ELEMENT_NODE) {
        walk(child as HTMLElement | TextNode);
      }
    }
  };

  for (const child of root.childNodes) {
    if (child.nodeType === NodeType.TEXT_NODE || child.nodeType === NodeType.ELEMENT_NODE) {
      walk(child as HTMLElement | TextNode);
    }
  }

  return { source, type: 'html', nodes };
}
