# Releasing

> **Not active yet.** `knope.toml` works (`knope prepare-release --dry-run`),
> but every job in `release.yml`, `publish-python.yml` and `publish-npm.yml` is
> guarded by `if: false`. Remove the guards and add the secrets below to enable.

All four packages release together: one version, one `vX.Y.Z` tag, one
`CHANGELOG.md`, one GitHub release, uploads to PyPI and npm.
[knope](https://knope.tech) drives it from `knope.toml`; nobody edits versions
or the changelog by hand.

## Change files

One Markdown file per user-facing change in `.changeset/`, via
`knope document-change` or by hand:

```markdown
---
default: minor
---

`fetch_sources` / `fetchSources` gained the `include_hosts` filter.
```

`default` is the single package knope manages; the type is `major`, `minor` or
`patch` (below 1.0, `major` bumps the minor number and the others bump the
patch). The body is the changelog entry. knope reads every `.md` in that
directory, so nothing else goes there.

## Flow

1. Push to `main` runs `knope prepare-release`: bumps both `pyproject.toml`
   files (and the `skyportal-py-models==` pin), both `package.json` files,
   prepends to `CHANGELOG.md`, deletes the change files, opens or updates the
   `release` PR. No change files, no PR.
2. Merging that PR runs `knope release`: tags `vX.Y.Z`, publishes the GitHub
   release.
3. The GitHub release triggers `publish-python.yml` (`uv build`, PyPI trusted
   publishing) and `publish-npm.yml` (`pnpm build`, `pnpm -r publish` with
   provenance).

## Setup

- `KNOPE_TOKEN` secret: fine-grained PAT with contents and pull-requests write
  (a PR opened with `GITHUB_TOKEN` would not trigger CI).
- PyPI: trusted publishers for both distributions on `publish-python.yml`.
- npm: trusted publishers for both packages on `publish-npm.yml`.
