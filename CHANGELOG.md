# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- CI and public project documentation.

### Changed

- Accept the optional pnpm argument separator before date ranges.
- Use Credit Karma's persisted GetTransactions query and required client headers.
- Reject invalid authorization-header characters before making a request.
- Escape embedded quotes in CSV fields.
- Return a failure status when the export fails.
- Avoid including authorization fragments or API response bodies in normal error output.

[Unreleased]: https://github.com/chiragmehta/ckexport/compare/v1.0.0...HEAD
