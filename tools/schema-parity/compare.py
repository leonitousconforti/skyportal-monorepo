"""Diff the Python and TypeScript model dumps.

Both dumps are reduced to the same coarse shape per model::

    {"extra": bool, "fields": {wire_name: {"kind": str, "required": bool, "nullable": bool}}}

and every difference is printed. Exits non-zero on any difference that is not
listed in ``allowlist.json``.
"""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

HERE = pathlib.Path(__file__).parent
OUT = HERE / "out"
ALLOWLIST = HERE / "allowlist.json"


def kind_of(  # noqa: PLR0911, PLR0912 -- one branch per JSON Schema construct
    schema: dict[str, Any], defs: dict[str, Any]
) -> tuple[str, bool]:
    """Reduce a JSON Schema fragment to ``(kind, nullable)``."""
    if "$ref" in schema:
        name = schema["$ref"].rsplit("/", 1)[-1]
        # pydantic inlines nothing and refs everything; valibot refs only lazy
        # schemas. Resolve refs to anonymous definitions, keep named models.
        target = defs.get(name)
        if target is not None and "title" not in target and "properties" not in target:
            return kind_of(target, defs)
        # valibot refs are keyed ``Module.Name``; pydantic refs are bare names.
        return f"ref:{name.rsplit('.', 1)[-1].lower()}", False
    variants = schema.get("anyOf") or schema.get("oneOf")
    if variants:
        kinds = []
        nullable = False
        for variant in variants:
            kind, null = kind_of(variant, defs)
            if kind == "null" or null:
                nullable = True
            if kind != "null":
                kinds.append(kind)
        kinds = sorted(set(kinds))
        if not kinds:
            return "null", True
        return (
            kinds[0] if len(kinds) == 1 else "union<" + "|".join(kinds) + ">"
        ), nullable
    if "allOf" in schema and len(schema["allOf"]) == 1:
        return kind_of(schema["allOf"][0], defs)
    if "const" in schema or "enum" in schema:
        return "literal", False
    typ = schema.get("type")
    if isinstance(typ, list):
        nullable = "null" in typ
        rest = [t for t in typ if t != "null"]
        typ = rest[0] if len(rest) == 1 else None
        if typ is None:
            return "any", nullable
        return kind_of({**schema, "type": typ}, defs)[0], nullable
    if typ == "null":
        return "null", True
    if typ == "array":
        items = schema.get("items")
        inner = kind_of(items, defs)[0] if isinstance(items, dict) else "any"
        return f"array<{inner}>", False
    if typ == "object":
        return "object", False
    if typ in ("string", "number", "integer", "boolean"):
        return typ, False
    return "any", False


def reduce_model(schema: dict[str, Any]) -> dict[str, Any]:
    """Reduce one model schema to the comparable shape."""
    defs = schema.get("$defs") or schema.get("definitions") or {}
    if "properties" not in schema and schema.get("type") != "object":
        # A bare alias (``Literal[...]`` / ``picklist``), not an object model.
        return {"extra": False, "scalar": kind_of(schema, defs)[0], "fields": {}}
    required = set(schema.get("required", []))
    fields = {}
    for name, prop in (schema.get("properties") or {}).items():
        kind, nullable = kind_of(prop, defs)
        if kind == "any":
            # ``Any`` / ``unknown`` already admit null; whether one side spells
            # that out is not a difference.
            nullable = True
        # A ``default: null`` on the Python side means "may be omitted"; valibot
        # expresses the same by leaving the key out of ``required``.
        is_required = name in required and prop.get("default", "<unset>") == "<unset>"
        fields[name] = {"kind": kind, "required": is_required, "nullable": nullable}
    return {
        "extra": schema.get("additionalProperties", True) is not False,
        "fields": fields,
    }


def main() -> int:
    """Compare the two dumps and report."""
    py = {
        k.lower(): reduce_model(v)
        for k, v in json.loads((OUT / "py.json").read_text()).items()
    }
    ts = {
        k.lower(): reduce_model(v)
        for k, v in json.loads((OUT / "ts.json").read_text()).items()
    }
    allow = (
        set(json.loads(ALLOWLIST.read_text()).get("differences", []))
        if ALLOWLIST.exists()
        else set()
    )

    differences: list[str] = []
    for name in sorted(set(py) & set(ts)):
        a, b = py[name], ts[name]
        if a["extra"] != b["extra"]:
            differences.append(
                f"{name}: additional properties py={a['extra']} ts={b['extra']}"
            )
        for field in sorted(set(a["fields"]) | set(b["fields"])):
            fa, fb = a["fields"].get(field), b["fields"].get(field)
            if fa is None:
                differences.append(f"{name}.{field}: missing in python")
            elif fb is None:
                differences.append(f"{name}.{field}: missing in typescript")
            elif fa != fb:
                differences.append(f"{name}.{field}: py={fa} ts={fb}")

    py_only = sorted(set(py) - set(ts))
    ts_only = sorted(set(ts) - set(py))
    differences.extend(f"typescript-only model: {n}" for n in ts_only)
    unexpected = [d for d in differences if d not in allow]
    stale = sorted(a for a in allow if a not in differences)

    print(
        f"compared {len(set(py) & set(ts))} models; {len(py_only)} python-only, {len(ts_only)} typescript-only"
    )
    if py_only:
        print("\npython-only models (TypeScript interfaces, or missing schemas):")
        print("\n".join(f"  {n}" for n in py_only))
    if unexpected:
        print(f"\n{len(unexpected)} differences:")
        print("\n".join(f"  {d}" for d in unexpected))
    if stale:
        print("\nallowlist entries that no longer apply (remove them):")
        print("\n".join(f"  {d}" for d in stale))
    return 1 if unexpected or stale else 0


if __name__ == "__main__":
    sys.exit(main())
