# skyportal-py-models

Pydantic models for the bodies and responses of the SkyPortal API, one module
per resource (`skyportal_py_models.sources`, `.groups`, ...). Pure data: no
HTTP, no client. Consumed by [`skyportal-py`](../client-py), and meant to be
importable by the SkyPortal server so both sides validate against the same
definitions.

```python
from skyportal_py_models.sources import Source, SourcePost

source = Source.model_validate(payload)  # strict: unknown keys are an error
body = SourcePost(id="ZTF20abcdef", ra=10.5, dec=-20.25).model_dump(exclude_none=True)
```

The TypeScript mirror is [`skyportal-js-models`](../api-models-ts): same module
names, same model names, same field names. `tools/schema-parity` checks the two
agree.
