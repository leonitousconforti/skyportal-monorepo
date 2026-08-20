"""Emit the JSON Schema of every model in ``skyportal_py_models``.

Writes ``tools/schema-parity/out/py.json``: ``{"<Module>.<Name>": <schema>}``,
with module names in the TypeScript spelling so the two dumps line up.
"""

from __future__ import annotations

import importlib
import inspect
import json
import pathlib

from pydantic import BaseModel

import skyportal_py_models

OUT = pathlib.Path(__file__).parent / "out" / "py.json"


def ts_module_name(name: str) -> str:
    """``observation_plans`` -> ``ObservationPlans``."""
    special = {"mmadetectors": "MmaDetectors"}
    return special.get(name, "".join(part.capitalize() for part in name.split("_")))


def main() -> None:
    """Dump every model's validation schema."""
    schemas: dict[str, object] = {}
    for name in skyportal_py_models.__all__:
        module = importlib.import_module(f"skyportal_py_models.{name}")
        for cls_name, cls in inspect.getmembers(module, inspect.isclass):
            if cls.__module__ != module.__name__ or not issubclass(cls, BaseModel):
                continue
            if cls_name.startswith("_"):
                continue
            schemas[f"{ts_module_name(name)}.{cls_name}"] = cls.model_json_schema(
                mode="validation", ref_template="#/$defs/{model}"
            )
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(schemas, indent=2, sort_keys=True) + "\n")
    print(f"wrote {len(schemas)} schemas to {OUT}")


if __name__ == "__main__":
    main()
