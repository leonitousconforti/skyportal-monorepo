# skyportal-js-models

[valibot](https://valibot.dev) schemas and types for SkyPortal API bodies and
responses, one module per resource. No `fetch`; used by
[`skyportal-js`](../client-ts) and usable in the SkyPortal frontend.

```ts
import * as v from "valibot";
import { Sources } from "skyportal-js-models";

const source = v.parse(Sources.Source, payload); // strict: unknown keys are an error
const body: Sources.SourcePost = { id: "ZTF20abcdef", ra: 10.5, dec: -20.25 };
```

Python mirror: [`skyportal-py-models`](../api-models-py).
