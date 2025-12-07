import { OptimizeOptions } from './types.js';

const fencePattern = /^```/;

export function optimizeText(input: string, options: OptimizeOptions = {}): string {
  const collapseSpaces = options.collapseSpaces !== false;
  const lines = input.split('\n');
  const output: string[] = [];

  let inCode = false;
  let blankSeen = false;

  for (const line of lines) {
    const isFence = fencePattern.test(line.trimStart());
    if (isFence) {
      inCode = !inCode;
      output.push(line.replace(/\s+$/g, ''));
      blankSeen = false;
      continue;
    }

    if (inCode) {
      output.push(line); // keep code untouched
      blankSeen = false;
      continue;
    }

    let current = line.replace(/\t/g, '  ');
    current = current.trim();
    if (collapseSpaces) {
      current = current.replace(/ {2,}/g, ' ');
    }
    current = current.replace(/\s+$/g, '');

    const isBlank = current === '';
    if (isBlank) {
      if (blankSeen) continue; // collapse multiple blanks
      blankSeen = true;
      output.push('');
    } else {
      blankSeen = false;
      output.push(current);
    }
  }

  // Collapse any lingering 2+ blank lines (safety) and trim trailing newlines
  const collapsed = output.join('\n').replace(/\n{3,}/g, '\n\n');
  return collapsed.trimEnd();
}
