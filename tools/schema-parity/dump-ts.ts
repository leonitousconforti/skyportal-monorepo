/**
 * Emit the JSON Schema of every schema in `skyportal-js-models`.
 *
 * Writes `tools/schema-parity/out/ts.json`: `{"<Module>.<Name>": <schema>}`.
 * TypeScript `interface`s (request bodies, the recursive `Group` pair) have no
 * runtime value and so do not appear here; `compare.py` knows to expect that.
 */

import type * as v from "valibot";

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { toJsonSchema } from "@valibot/to-json-schema";
import * as Models from "skyportal-js-models";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out", "ts.json");

const isSchema = (value: unknown): value is v.GenericSchema =>
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "schema";

// Every named schema, keyed `Module.Name` (bare names repeat across modules),
// so that a model nested inside another is emitted as a `$ref` (matching
// pydantic) rather than inlined.
const named: Record<string, v.GenericSchema> = {};
for (const [moduleName, module] of Object.entries(Models)) {
    if (moduleName === "Schemas") {
        continue;
    }
    for (const [name, value] of Object.entries(module)) {
        if (isSchema(value) && !name.endsWith("Entries")) {
            named[`${moduleName}.${name}`] = value;
        }
    }
}

const schemas: Record<string, unknown> = {};
for (const [moduleName, module] of Object.entries(Models)) {
    if (moduleName === "Schemas") {
        continue;
    }
    for (const [name, value] of Object.entries(module)) {
        if (!isSchema(value) || name.endsWith("Entries")) {
            continue;
        }
        // The model itself must not be a definition, or its schema is just a
        // self-reference.
        const { [`${moduleName}.${name}`]: _self, ...definitions } = named;
        schemas[`${moduleName}.${name}`] = toJsonSchema(value, {
            // `v.lazy`, transforms and custom checks have no JSON Schema
            // equivalent; emit what can be expressed rather than failing.
            errorMode: "ignore",
            definitions,
        });
    }
}

mkdirSync(dirname(out), { recursive: true });
const sorted = Object.fromEntries(
    Object.entries(schemas).sort(([a], [b]) => a.localeCompare(b))
);
writeFileSync(out, `${JSON.stringify(sorted, null, 2)}\n`);
// oxlint-disable-next-line eslint/no-console
console.log(`wrote ${Object.keys(schemas).length} schemas to ${out}`);
