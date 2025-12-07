import YAML from 'yaml';
import { LoomerDocument, LoomerNode } from '../types.js';

export function parseYaml(content: string, source: string): LoomerDocument {
  let parsed: unknown;
  try {
    parsed = YAML.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse YAML from ${source}: ${(error as Error).message}`);
  }

  const normalized = YAML.stringify(parsed ?? {});
  const nodes: LoomerNode[] = [{ kind: 'code', language: 'yaml', value: normalized.trimEnd() }];

  let metadata: Record<string, string | number | boolean> | undefined;
  if (parsed && typeof parsed === 'object') {
    const keys = Array.isArray(parsed) ? [] : Object.keys(parsed as Record<string, unknown>);
    metadata = {
      rootType: Array.isArray(parsed) ? 'array' : 'object',
      size: Array.isArray(parsed) ? (parsed as unknown[]).length : keys.length,
      sampleKeys: keys.slice(0, 5).join(', '),
    };
  }

  return { source, type: 'yaml', nodes, metadata };
}
