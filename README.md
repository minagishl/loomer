# Loomer

Merge multiple files into one AI-friendly document. Loomer normalizes structure across Markdown, HTML, JSON, YAML, and plain text so models can see context in a single pass.

## Requirements

- [Bun](https://bun.sh/) >= 1.0

## Install

```bash
bun install
```

## Usage

Merge files in order and write the output:

```bash
bun src/index.ts merge notes.md data.json --out merged.md
```

No `--out`? Loomer writes `merged.md` in the current directory by default.

Merge everything in a folder (recursive, supported file types only):

```bash
bun src/index.ts merge docs/ --out combined.txt
```

Merge as plain text:

```bash
bun src/index.ts merge a.txt b.yaml --format txt
```

Every merged file is prefixed with its path for clarity:

```
---
/public/article.md
---
<file contents...>
```

Inspect how Loomer sees a file:

```bash
bun src/index.ts inspect README.md
```

Show version:

```bash
bun src/index.ts version
```

Options:

- `--out` to write to a file (otherwise prints to stdout)
- `--format` choose `md`, `txt`, or `json` (defaults to `md` or derived from `--out`)
- `--metadata` include parsed metadata in the merged output

## Tests

```bash
bun test
```

## Project Structure

- `src/core` parsers, normalization, merger
- `src/cli` CLI wiring for merge/inspect/version commands
- `src/utils` shared helpers
- `src/index.ts` CLI entrypoint
