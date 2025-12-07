export type LoomerFormat = 'txt' | 'md' | 'json';

export type FileType = 'markdown' | 'html' | 'json' | 'yaml' | 'text';

export interface LoomerNode {
  kind: 'heading' | 'paragraph' | 'code' | 'metadata' | 'raw';
  value: string;
  depth?: number;
  language?: string;
}

export interface LoomerDocument {
  source: string;
  type: FileType;
  nodes: LoomerNode[];
  metadata?: Record<string, string | number | boolean>;
}

export interface MergeOptions {
  format: LoomerFormat;
  includeMetadata?: boolean;
}
