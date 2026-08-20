# Changelog fragments

This directory holds [towncrier](https://towncrier.readthedocs.io/) news
fragments for the **Python** packages: one small Markdown file per change,
compiled into `CHANGES.md` at release time. (The TypeScript packages use
[changesets](../.changeset) instead.)

The fragments here cover every Python package published to PyPI from
`packages/` (`skyportal-py` and `skyportal-py-models`), since those release in
lockstep under a shared version.

## Adding a fragment

Create a file named `<pr-number>.<type>.md` (for example `123.bugfix.md`), or
`+<slug>.<type>.md` (for example `+fix-overflow.bugfix.md`) if there is no pull
request number yet. The file contains a short, user-facing description of the
change. Mention the package when it is not obvious which one you changed.

You can also run:

    uv run towncrier create <pr-number>.<type>.md

Valid types:

- `breaking`: breaking changes
- `feature`: new features
- `bugfix`: bug fixes
- `misc`: everything else (dependency bumps, docs, internal changes)

Changes that do not affect users (for example CI tweaks) can skip the fragment
requirement by adding the `skip-changelog` label to the pull request.

## Releasing

See [RELEASING.md](../RELEASING.md).
