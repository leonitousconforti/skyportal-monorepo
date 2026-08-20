# Contributing

```sh
nix develop        # or `direnv allow`
pnpm install
nix flake check    # exactly what CI runs
```

The venv on `PATH` is built by Nix from `uv.lock` with both Python packages
editable; there is no `uv sync`.

## Inner loop

```sh
ruff check packages && ruff format packages   # packages/*/ruff.toml
ty check                                      # root pyproject.toml
pytest packages
pnpm check && pnpm lint-fix && pnpm test      # packages/*/.oxlintrc.json, .oxfmtrc.json
pnpm codegen                                  # regenerates src/index.ts
```

Lint configs are per package so they can diverge; ty is configured once at the
root.

## Rules of the repo

- Model packages contain no HTTP code. Clients import and re-export them.
- A model or endpoint change lands in both languages in the same PR.
- User-facing changes add a change file (`knope document-change`); otherwise
  label the PR `skip-changelog`. See [RELEASING.md](RELEASING.md).
- `git add` new files before `nix flake check`: the sandbox only sees tracked
  files, and has no network.

## Dependencies

```sh
uv add --package skyportal-py <dep>    # then re-enter the shell
pnpm add --filter skyportal-js <dep>   # then update pnpmDeps.hash in flake.nix:
```

Set `pnpmDeps.hash` to `sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=`, run
`nix build .#js`, copy the `got:` hash back. Renovate handles routine bumps.

## Adding a package

Create it under `packages/` at the shared version; register it in the root
`pyproject.toml` (workspace + dependencies) or `pnpm-workspace.yaml`; give it
its lint config; add it to `knope.toml` `versioned_files`, the publish workflow,
and `flake.nix`.
