# schema-parity

`skyportal-py-models` (pydantic) and `skyportal-js-models` (valibot) are written
by hand, twice, on purpose: no code generation, each side idiomatic. This tool
is what keeps them from drifting apart.

1. `dump_py.py` walks every `skyportal_py_models.<module>` and writes the JSON
   Schema pydantic emits for each model to `out/py.json`.
2. `dump-ts.ts` walks every `skyportal-js-models/<Module>` and writes the JSON
   Schema [`@valibot/to-json-schema`](https://valibot.dev/guides/json-schema/)
   emits for each schema to `out/ts.json`.
3. `compare.py` reduces both to the same coarse shape (field name, kind,
   required, nullable, additional properties) and prints every difference.
   Known, accepted differences live in `allowlist.json`.

Run it from the repo root:

    uv run python tools/schema-parity/dump_py.py
    pnpm schema-parity
    uv run python tools/schema-parity/compare.py

CI runs the same three steps. A failure means one side was changed without the
other: fix the lagging side, or, if the difference is intentional, add it to
`allowlist.json` with a reason.

## What is compared

Models are matched by `<Module>.<Name>`, case-insensitively: Python
`skyportal_py_models.sources` pairs with TypeScript `Sources`, and model names
are identical by convention except for acronym casing (`MMADetector` /
`MmaDetector`). Python `Literal[...]` aliases pair with valibot `picklist`s.
Fields are matched by wire name (pydantic aliases are honoured). Field types are
reduced to one of `string`, `number`, `integer`, `boolean`, `array<kind>`,
`object`, `ref:<Name>`, `literal`, or `any`; `T | None = None` on the Python
side and `nullish(T)` on the TypeScript side both reduce to optional and
nullable.

## What is not compared

- TypeScript `interface`s have no runtime schema (request bodies, and the
  mutually recursive `Group`/`GroupUser`), so they only exist on the Python
  side. They are listed as "python only" in the report but do not fail it.
- `Literal`/`picklist` aliases are compared by kind only, not by their member
  values.
- `Any`/`unknown` fields are always treated as nullable, whichever side spells
  it out.

`allowlist.json` maps one `compare.py` output line to the reason it is
accepted; entries that stop matching are reported as stale so the list cannot
rot.
