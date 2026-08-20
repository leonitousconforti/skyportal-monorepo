# Releasing

> **Not active yet.** `knope.toml` is configured and `knope prepare-release
--dry-run` works, but the GitHub workflows described below (release, PyPI and
> npm publishing, the change-file check on pull requests) are not in the
> repository yet. This document describes the intended flow.

Every package in this repository releases **together**: one version, one
`vX.Y.Z` tag, one changelog, one GitHub release, two registries.

| directory                | distribution          | registry |
| ------------------------ | --------------------- | -------- |
| `packages/api-models-py` | `skyportal-py-models` | PyPI     |
| `packages/client-py`     | `skyportal-py`        | PyPI     |
| `packages/api-models-ts` | `skyportal-js-models` | npm      |
| `packages/client-ts`     | `skyportal-js`        | npm      |

[knope](https://knope.tech) drives it, configured in `knope.toml`. Nobody
edits a version number or `CHANGELOG.md` by hand.

## Change files

Every user-facing change to any package gets a Markdown file in `.changeset/`,
written by `nix develop -c knope document-change` or by hand, named anything
ending in `.md`:

```markdown
---
default: minor
---

`fetch_sources` / `fetchSources` gained the `include_hosts` filter.
```

`default` is the one package knope knows about (all four published packages
release together), and the change type is `major`, `minor` or `patch`. While
the version is below 1.0, knope follows the usual 0.x convention: `major`
bumps the minor number and `minor`/`patch` bump the patch number. The body
becomes the changelog entry, so write it for users and name the package when it
is not obvious which one you changed. knope reads _every_ `.md` file in that
directory, so nothing else may live there.

Pull requests that change nothing user-facing (CI, docs, internal refactors)
can skip the file by carrying the `skip-changelog` label; CI fails otherwise.

## Day to day

1. A pull request adds its change file (above).
2. On every push to `main`, `release.yml` runs `knope prepare-release`, which
   reads the pending change files, bumps all four `pyproject.toml` /
   `package.json` versions (and the exact `skyportal-py-models` pin inside
   `skyportal-py`), prepends a section to `CHANGELOG.md`, deletes the consumed
   change files, and opens or force-updates the `release` pull request. Nothing
   happens if there are no change files.
3. Merging the release pull request runs `knope release`, which tags the merge
   commit `vX.Y.Z` and publishes a GitHub release with the changelog section as
   its notes.
4. The published GitHub release triggers `publish-python.yml` (builds both
   wheels with uv, uploads via PyPI trusted publishing) and `publish-npm.yml`
   (builds both packages with pnpm, uploads via npm trusted publishing with
   provenance). Both run inside the Nix dev shell, so they use the same
   toolchain as `nix flake check`.

## Checking locally

    nix develop -c knope prepare-release --dry-run    # what the next release would be
    nix flake check                                    # includes a lockstep-versions check

## Secrets and setup

- `KNOPE_TOKEN`: a fine-grained personal access token with contents and
  pull-request write access to this repository. `prepare-release` pushes the
  `release` branch and opens the PR with it; a PR opened with the default
  `GITHUB_TOKEN` would not trigger CI.
- PyPI: register both distributions as trusted publishers pointing at
  `publish-python.yml`.
- npm: register both packages as trusted publishers pointing at
  `publish-npm.yml`.

## Adding a package

Add its `pyproject.toml` or `package.json` to `versioned_files` in
`knope.toml` at the current shared version, add it to the relevant publish
workflow, and register it with the registry. It joins the existing train.
