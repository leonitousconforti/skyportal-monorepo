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
├── tools/
│   ├── schema-parity/     proves the Python and TypeScript models agree
│   └── check_published_versions.py
├── pyproject.toml         uv workspace root + ruff/ty/towncrier config
├── package.json           pnpm workspace root + tsc/oxlint/vitest config
├── changes.d/             towncrier fragments (Python releases)
├── .changeset/            changesets (TypeScript releases)
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
2. **`tools/schema-parity`.** Pydantic and valibot can both emit JSON Schema.
   CI dumps every model from both sides, reduces the schemas to the same
   coarse shape (field, kind, required, nullable, extra keys allowed) and
   fails on any difference that is not in an explicit allowlist. See
   [`tools/schema-parity/README.md`](tools/schema-parity/README.md).
3. **Dogfooding.** SkyPortal's own API tests use `skyportal-py`, so the Python
   models are checked against real responses on every SkyPortal CI run; the
   parity check carries that assurance over to TypeScript.

If the parity check ever becomes the main source of churn, the models packages
are already the boundary where a generator would slot in (pydantic -> JSON
Schema -> valibot), without touching the clients.

## Developing

Nix is the build system. `flake.nix` reads `uv.lock` (through
[uv2nix](https://github.com/pyproject-nix/uv2nix)) and `pnpm-lock.yaml`
(through nixpkgs' pnpm support) and turns both workspaces into derivations, so
there is one command for everything CI does:

```sh
nix flake check          # lint, types, tests on Python 3.11-3.14, TS check/lint/build/test, codegen freshness, schema parity
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

Releases: see [RELEASING.md](RELEASING.md). The two Python packages release
in lockstep (towncrier, `pypi-v*` tags); the two TypeScript packages release
in lockstep (changesets).

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
  is the next thing the server could share; it would also let the parity check
  cover them.
- **TypeScript request bodies are interfaces, not schemas.** `SourcePost` is an
  `interface` in TypeScript and a pydantic class in Python. Interfaces have no
  runtime value, so the parity check can only see them from the Python side.
  Turning them into valibot schemas would close that gap.
- **Versions.** The Python packages start at 0.4.0 (the last `skyportal-py`
  release was 0.3.0), the TypeScript packages at 0.3.0 (last `skyportal-js`
  was 0.2.0). Both are a minor bump because the models moved to a new package.
- **History.** The files were copied from
  [skyportal-py](https://github.com/leonitousconforti/skyportal-py) and
  [skyportal-js](https://github.com/leonitousconforti/skyportal-js) without
  their git history. `git subtree add` or `git filter-repo --to-subdirectory`
  can bring it in if wanted, but only before anything else is committed on top.
