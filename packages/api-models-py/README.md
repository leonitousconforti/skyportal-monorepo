# skyportal-py-models

Pydantic models for SkyPortal API bodies and responses, one module per
resource. No HTTP; used by [`skyportal-py`](../client-py) and meant to be
importable by the server.

```python
from skyportal_py_models.sources import Source, SourcePost

source = Source.model_validate(payload)   # strict: unknown keys are an error
body = SourcePost(id="ZTF20abcdef", ra=10.5, dec=-20.25).model_dump(exclude_none=True)
```

TypeScript mirror: [`skyportal-js-models`](../api-models-ts).
