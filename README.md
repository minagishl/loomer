# Loomer

Merge multiple files into one AI-friendly document. Loomer normalizes structure across Markdown, HTML, JSON, YAML, and plain text so models can see context in a single pass.

## Installation

### Using npx (no installation required)

```bash
npx loomer merge notes.md data.json --out merged.md
```

### Global installation

```bash
npm install -g loomer
loomer merge notes.md data.json --out merged.md
```

### Local installation

```bash
npm install loomer
npx loomer merge notes.md data.json --out merged.md
```

## Usage

Merge files in order and write the output:

```bash
loomer merge notes.md data.json --out merged.md
```

No `--out`? Loomer writes `merged.md` in the current directory by default.

Merge everything in a folder (recursive, supported file types only):

```bash
loomer merge docs/ --out combined.txt
```

Merge as plain text:

```bash
loomer merge a.txt b.yaml --format txt
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
loomer inspect README.md
```

Show version:

```bash
loomer version
```

### Options

- `--out` to write to a file (otherwise prints to stdout)
- `--format` choose `md`, `txt`, or `json` (defaults to `md` or derived from `--out`)
- `--metadata` include parsed metadata in the merged output

## Development

### Requirements

- [Bun](https://bun.sh/) >= 1.0

### Setup

```bash
git clone https://github.com/minagishl/loomer.git
cd loomer
bun install
```

### Build

```bash
bun run build
```

### Run locally

```bash
bun run dev
```

### Tests

```bash
bun test
```

### Linting and Formatting

```bash
bun run lint          # Check for linting errors
bun run lint:fix      # Fix linting errors
bun run format        # Check code formatting
bun run format:write  # Fix code formatting
```

## Project Structure

- `src/core` parsers, normalization, merger
- `src/cli` CLI wiring for merge/inspect/version commands
- `src/utils` shared helpers
- `src/index.ts` CLI entrypoint

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
