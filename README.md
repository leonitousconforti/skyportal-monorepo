# skyportal-monorepo

Home for the SkyPortal API client libraries and the request/response models
they share. Four packages, two languages, one repository:

| directory                | package               | what it is                                      |
| ------------------------ | --------------------- | ----------------------------------------------- |
| `packages/api-models-py` | `skyportal-py-models` | pydantic models for every API body and response |
| `packages/client-py`     | `skyportal-py`        | httpx client: one typed function per endpoint   |
| `packages/api-models-ts` | `skyportal-js-models` | valibot schemas and types for the same models   |
| `packages/client-ts`     | `skyportal-js`        | fetch client: one typed function per endpoint   |

Both clients have the same module layout (`sources`, `groups`, ...), the same
function names (`fetch_source` / `fetchSource`), and the same model names
(`SourcePost`, `SourcesPage`). The models packages are pure data with no HTTP
in them, so the SkyPortal server can validate request bodies with
`skyportal-py-models` and the SkyPortal frontend can type its payloads with
`skyportal-js-models`. The clients then become thin: URL, query string, body
in, model out.

## Layout

```
.
├── packages/
│   ├── api-models-py/     skyportal_py_models/<resource>.py
│   ├── client-py/         skyportal_py/<resource>.py, _http.py, client.py
│   ├── api-models-ts/     src/<Resource>.ts, Schemas.ts
│   └── client-ts/         src/<Resource>.ts, Http.ts, Client.ts
├── pyproject.toml         uv workspace root + ruff/ty config
├── package.json           pnpm workspace root + tsc/oxlint/vitest config
├── knope.toml             one release train for all four packages
├── .changeset/            change files, one per user-facing change (see docs/RELEASING.md)
└── flake.nix              dev shell: uv, node, pnpm
```

Each client module re-exports the models it uses, so the public API of the
clients is unchanged: `skyportal_py.sources.SourcePost` is
`skyportal_py_models.sources.SourcePost`, and `Sources.Source` from
`skyportal-js` is the schema from `skyportal-js-models`.

## Keeping two hand-written model sets in sync

The models are written twice, by hand, in each language's idiom. No code
generation. What stops them drifting:

1. **Conventions.** Same module names, same model names, same field names
   (wire names, so `totalMatches` not `total_matches` where SkyPortal sends
   camelCase). A reviewer can open the two files side by side.
2. **Dogfooding.** SkyPortal's own API tests use `skyportal-py`, so the Python
   models are checked against real responses on every SkyPortal CI run; the
   parity check carries that assurance over to TypeScript.

If the parity check ever becomes the main source of churn, the models packages
are already the boundary where a generator would slot in (pydantic -> JSON
Schema -> valibot), without touching the clients.

## Developing

[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) has the full workflow; the short version:

Nix is the build system. `flake.nix` reads `uv.lock` (through
[uv2nix](https://github.com/pyproject-nix/uv2nix)) and `pnpm-lock.yaml`
(through nixpkgs' pnpm support) and turns both workspaces into derivations, so
there is one command for everything CI does:

```sh
nix flake check          # lint, types, tests on Python 3.11-3.14, TS check/lint/build/test, codegen freshness
nix build .#js           # both npm packages, built to dist/
nix build .#skyportal-py # the Python client (and its models) as an installed package
```

uv and pnpm are still there, but only as lockfile editors and for the inner
loop inside the dev shell:

```sh
nix develop              # or `direnv allow`; venv (editable) + uv, node, pnpm
uv lock                  # after changing a pyproject.toml; then re-enter the shell
pnpm install             # after changing a package.json; update the hash in flake.nix
pytest packages          # the venv is on PATH
pnpm test
```

When `pnpm-lock.yaml` changes, `nix build .#js` fails with a hash mismatch;
copy the `got:` hash into `pnpmDeps.hash` in `flake.nix`.

Releases: see [RELEASING.md](docs/RELEASING.md). All four packages release together
under one version, driven by [knope](https://knope.tech) from the change files
in `.changeset/`. The release and publish workflows are present but disabled for now.

## Decisions and open questions

- **Flat import names, not namespace packages.** `skyportal_py_models` and
  `skyportal_py` rather than `skyportal.models` and `skyportal.client`. A PEP
  420 namespace called `skyportal` cannot coexist with the regular `skyportal`
  package the server is, and the server is expected to move into this
  repository eventually. Switching to a namespace would mean renaming the
  server's import root too (`skyportal.server`?), which is a decision to take
  before the server joins, not one to pre-empt here.
- **Query parameters are not models yet.** The Python client takes them as
  keyword arguments and the TypeScript client as `*Options` interfaces, so
  they live in the client packages. Giving them models (`FetchSourcesQuery`)
  is the next thing the server could share.
- **TypeScript request bodies are interfaces, not schemas.** `SourcePost` is an
  `interface` in TypeScript and a pydantic class in Python. Interfaces have no
  runtime value, so nothing can validate them against the Python side.
- **Versions.** All four packages start at 0.4.0: a minor bump over the last
  `skyportal-py` (0.3.0) because the models moved to a new package, and the
  npm packages (last `skyportal-js` was 0.2.0) join that number so there is one
  release train.
- **History.** The files were copied from
  [skyportal-py](https://github.com/leonitousconforti/skyportal-py) and
  [skyportal-js](https://github.com/leonitousconforti/skyportal-js) without
  their git history. `git subtree add` or `git filter-repo --to-subdirectory`
  can bring it in if wanted, but only before anything else is committed on top.
