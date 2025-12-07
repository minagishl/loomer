import { marked } from 'marked';
import { MergeMetadata, OutputFormat } from './types.js';

function stripEmphasis(text: string): string {
  return text.replace(/(\*\*|__)([^*_]+?)(\*\*|__)/g, '$2').replace(/(\*|_)([^*_]+?)(\*|_)/g, '$2');
}

function stripLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

function markdownToText(input: string): string {
  const lines = input.split('\n');
  const output: string[] = [];
  let inCode = false;

  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      // omit fences for plain text, but keep separation
      continue;
    }

    if (inCode) {
      output.push(line);
      continue;
    }

    let current = line;
    current = current.replace(/^#{1,6}\s*/, '');
    current = current.replace(/^\s*([-*+]\s+|\d+\.\s+)/, '');
    current = stripLinks(current);
    current = stripEmphasis(current);
    current = current.replace(/`([^`]+)`/g, '$1');
    output.push(current);
  }

  return output.join('\n');
}

function markdownToHtml(input: string): string {
  // Prefer marked for robustness; fallback to minimal conversion if needed.
  return marked.parse(input) as string;
}

function wrapHtml(body: string): string {
  return [`<html>`, `<body>`, `<article>${body}</article>`, `</body>`, `</html>`].join('\n');
}

export function formatOutput(input: string, format: OutputFormat, meta: MergeMetadata): string {
  switch (format) {
    case 'markdown':
      return input;
    case 'text':
      return markdownToText(input);
    case 'html': {
      const body = markdownToHtml(input);
      return wrapHtml(body);
    }
    case 'json':
      return JSON.stringify(
        {
          content: input,
          metadata: {
            fileCount: meta.fileCount,
            timestamp: meta.timestamp,
          },
        },
        null,
        2
      );
    default:
      return input;
  }
}
