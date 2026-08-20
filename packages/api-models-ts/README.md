# skyportal-js-models

[valibot](https://valibot.dev) schemas and TypeScript types for the bodies and
responses of the SkyPortal API, one module per resource (`Sources`, `Groups`,
...). Pure data: no `fetch`, no client. Consumed by
[`skyportal-js`](../client-ts), and usable on its own wherever SkyPortal
payloads need validating or typing, including the SkyPortal frontend.

```ts
import * as v from "valibot";
import { Sources } from "skyportal-js-models";

const source = v.parse(Sources.Source, payload); // strict: unknown keys are an error
const body: Sources.SourcePost = { id: "ZTF20abcdef", ra: 10.5, dec: -20.25 };
```

The Python mirror is [`skyportal-py-models`](../api-models-py): same module
names, same model names, same field names.
