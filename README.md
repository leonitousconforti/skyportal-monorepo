# skyportal-monorepo

Clients for the [SkyPortal](https://skyportal.io) API and the request/response
models they share, in Python and TypeScript.

| directory                | package                                       |
| ------------------------ | --------------------------------------------- |
| `packages/api-models-py` | `skyportal-py-models`: pydantic models        |
| `packages/client-py`     | `skyportal-py`: httpx client                  |
| `packages/api-models-ts` | `skyportal-js-models`: valibot schemas        |
| `packages/client-ts`     | `skyportal-js`: fetch client                  |

The model packages are pure data, so the SkyPortal server and frontend can use
them directly; the clients are thin wrappers over them. Both languages mirror
each other: same modules, same model and function names, same wire fields.

```sh
nix develop        # dev shell: Python venv, uv, node, pnpm, knope
nix flake check    # everything CI runs
```

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md): workflow, checks, dependencies
- [docs/RELEASING.md](docs/RELEASING.md): change files and releases

## Notes

- Import names are flat (`skyportal_py_models`, not `skyportal.models`): a
  `skyportal` namespace package cannot coexist with the server's regular
  `skyportal` package, which may join this repo later.
- Query parameters are keyword arguments / `*Options` interfaces in the
  clients, not models, and TypeScript request bodies are interfaces rather than
  schemas. Both are candidates for moving into the model packages.
- Files were copied from [skyportal-py](https://github.com/leonitousconforti/skyportal-py)
  and [skyportal-js](https://github.com/leonitousconforti/skyportal-js) without
  git history.
