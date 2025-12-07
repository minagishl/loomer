import { LoomerDocument, LoomerNode } from '../types.js';

export function parseJson(content: string, source: string): LoomerDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${source}: ${(error as Error).message}`);
  }

  const normalized = JSON.stringify(parsed, null, 2);
  const nodes: LoomerNode[] = [{ kind: 'code', language: 'json', value: normalized }];

  let metadata: Record<string, string | number | boolean> | undefined;
  if (parsed && typeof parsed === 'object') {
    const keys = Array.isArray(parsed) ? [] : Object.keys(parsed as Record<string, unknown>);
    metadata = {
      rootType: Array.isArray(parsed) ? 'array' : 'object',
      size: Array.isArray(parsed) ? (parsed as unknown[]).length : keys.length,
      sampleKeys: keys.slice(0, 5).join(', '),
    };
  }

  return { source, type: 'json', nodes, metadata };
}
