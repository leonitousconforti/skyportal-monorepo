# Contributing

Everything here is driven by Nix: the dev shell, the builds and every check CI
runs. Releases are described separately in [RELEASING.md](RELEASING.md).

## Setup

```sh
nix develop        # or `direnv allow` once; provides the Python venv, uv, node, pnpm, knope
pnpm install       # node_modules for the TypeScript packages
```

The Python virtualenv on `PATH` is built by Nix from `uv.lock` with both
packages installed editable, so edits under `packages/*-py/` are live. There
is no `uv sync`; `UV_NO_SYNC` is set in the shell to stop uv from trying.

## Layout

| directory                | package               | language   |
| ------------------------ | --------------------- | ---------- |
| `packages/api-models-py` | `skyportal-py-models` | Python     |
| `packages/client-py`     | `skyportal-py`        | Python     |
| `packages/api-models-ts` | `skyportal-js-models` | TypeScript |
| `packages/client-ts`     | `skyportal-js`        | TypeScript |

The models packages are pure data (pydantic / valibot) and must stay free of
HTTP code; the clients import them and re-export what they use. Both languages
mirror each other: same module names, same model names, same wire field
names. A change to a model in one language needs the matching change in the
other.

## Checks

```sh
nix flake check                  # everything CI runs, same sandbox, same toolchain
nix build .#checks.<system>.js   # one check; `nix flake show` lists them
```

Inside the dev shell the tools are available directly for a faster loop:

```sh
ruff check packages && ruff format packages    # config: packages/*/ruff.toml
ty check                                       # config: root pyproject.toml
pytest packages
pnpm check && pnpm lint-fix && pnpm test       # config: packages/*/.oxlintrc.json, .oxfmtrc.json
pnpm codegen                                   # regenerates src/index.ts from index.ts.tpl
```

Lint and format configuration is per package on purpose, so a package can
diverge if it has a reason to. ty is configured once at the root because it
needs the workspace layout.

Things that only show up under Nix:

- **Untracked files are invisible.** A git flake's source is the set of
  tracked files, so `git add` new files before `nix flake check` or the
  sandbox will not see them.
- **The sandbox has no network or home directory.** Tests must not reach out;
  anything that needs a CA bundle gets `SSL_CERT_FILE` from the flake.

## Dependencies

```sh
uv add --package skyportal-py <dep>     # or edit the pyproject.toml, then:
uv lock
pnpm add --filter skyportal-js <dep>    # or edit the package.json, then:
pnpm install
```

After `pnpm-lock.yaml` changes, `flake.nix` needs the new dependency hash:
replace `pnpmDeps.hash` with a fake one (`sha256-AAAA...=`), run
`nix build .#js`, and copy the `got:` hash from the error into place. (A
fixed-output derivation whose hash still matches is never refetched, hence the
fake-hash step.) `uv.lock` changes need nothing extra; re-enter the dev shell
to pick them up.

Renovate keeps dependencies, GitHub Actions and the flake inputs current.

## Change files

Every pull request that changes something users of any package can notice
adds a change file in `.changeset/`:

```sh
knope document-change
```

or by hand, see [RELEASING.md](RELEASING.md#change-files). Pull requests with
no user-facing change carry the `skip-changelog` label instead. knope reads
every `.md` file in `.changeset/`, so nothing else may live there.

## Pull requests

- Keep the two languages in step within one PR when a model or endpoint
  changes.
- `nix flake check` must pass; it is exactly what CI runs.
- Commit messages are plain; there is no conventional-commit requirement,
  since versions come from change files.

## Adding a package

1. Create it under `packages/` at the current shared version (every package
   releases together; see [RELEASING.md](RELEASING.md)).
2. Python: add it to `workspace.members` and `dependencies` in the root
   `pyproject.toml`, give it a `ruff.toml`, run `uv lock`. TypeScript: add it
   to `pnpm-workspace.yaml`, give it `.oxlintrc.json` / `.oxfmtrc.json` and the
   standard scripts, run `pnpm install` and update the hash.
3. Add it to `versioned_files` in `knope.toml` and to the relevant publish
   workflow.
4. Add a `packages.<name>` output and any checks it needs to `flake.nix`.
