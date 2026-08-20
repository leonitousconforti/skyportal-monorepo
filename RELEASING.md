# Releasing

Two release trains, one per language. Within each, the packages release **in
lockstep**: one version, one tag, one changelog.

| directory                | distribution          | registry | notes                       |
| ------------------------ | --------------------- | -------- | --------------------------- |
| `packages/api-models-py` | `skyportal-py-models` | PyPI     | towncrier, `pypi-v*` tags   |
| `packages/client-py`     | `skyportal-py`        | PyPI     | pins the models exactly     |
| `packages/api-models-ts` | `skyportal-js-models` | npm      | changesets                  |
| `packages/client-ts`     | `skyportal-js`        | npm      | `workspace:^` on the models |

All commands run inside the nix dev shell (`nix develop`), which provides uv,
node and pnpm. CI itself is `nix flake check`; see the README.

## Python

Versions are static and bumped with `uv version`; the `pypi-v*` tag marks the
release commit. Because uv drops the version specifier for workspace sources,
nothing in the normal `uv lock` / `uv sync` path notices a half-finished bump,
so `tools/check_published_versions.py` enforces it in CI and again before
upload.

1.  Bump every published package to the same new version, and update the exact
    pin `skyportal-py` has on `skyportal-py-models`:

        uv version --package skyportal-py --bump minor
        uv version --package skyportal-py-models --bump minor
        python3 tools/check_published_versions.py

2.  Preview, then compile the changelog. This inserts a section into
    `CHANGES.md` and deletes the consumed fragments from `changes.d/`:

        uv run towncrier build --draft --version X.Y.Z
        uv run towncrier build --version X.Y.Z

3.  Commit and land on `main` (use the `skip-changelog` label if it goes through
    a pull request), then tag and push:

        git tag pypi-vX.Y.Z
        git push origin main --tags

4.  Publish a GitHub release for the tag, pasting the new `CHANGES.md` section
    as the notes:

        gh release create pypi-vX.Y.Z --title "skyportal-py X.Y.Z"

    Publishing the GitHub release is what triggers the upload; a tag alone does
    nothing. `publish-python.yml` refuses to continue unless every package's
    committed version matches the tag, then builds them all and uploads them
    together via trusted publishing.

### Adding another published Python package

1. Create it under `packages/` with a static `version` matching the other
   published packages, and no `Private :: Do Not Upload` classifier (that
   classifier is what marks a package as internal).
2. Add it to `workspace.members` and `dependencies` in the root `pyproject.toml`.
3. Add its distribution name to `PACKAGES` in `publish-python.yml`.
4. Register it as a PyPI trusted publisher pointing at `publish-python.yml`.

## TypeScript

[Changesets](https://github.com/changesets/changesets) drives the npm
releases. `skyportal-js` and `skyportal-js-models` are a `fixed` group, so they
always bump together.

1. Every user-facing PR adds a changeset (`pnpm changeset`).
2. On merge to `main`, `release-js.yml` opens or updates a "Version Packages"
   PR that bumps both `package.json` files and `CHANGELOG.md`s.
3. Merging that PR publishes both packages to npm with provenance.
