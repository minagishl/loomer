# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.1.0] - 2025-12-08

### Added

- Loomer CLI initial release (Bun + TypeScript) with `merge`, `inspect`, and `version` commands
- Parsing and normalization for Markdown, HTML, JSON, YAML, and plain text
- Recursive directory merging with deterministic ordering and vendor-folder ignores
- Per-file path banners in merged output for source clarity
- Metadata inclusion option and multi-format output (md/txt/json)
- Sample Bun tests covering merging, normalization, and path expansion
- Project docs and README with install/usage examples

### Changed

- Default merge target is `merged.md` when `--out` is not provided (use `--out -` for stdout)

[v0.1.0]: https://github.com/minagishl/loomer/releases/tag/v0.1.0
