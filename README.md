# federation-serialize

Utility for serializing federated schemas into a non-recursive data structure
you can store as JSON. It includes directive data from all subgraphs (which is
normally lost during supergraph composition.)

## CLI Usage

```sh
npx github:lennyburdette/federation-serialize --graphRef mygraph@current
```

## JavaScript usage

```sh
yarn add github:lennyburdette/federation-serialize
```

```js
import { serialize } from "@lennyburdette/federation-serialize";

const data = await serialize({ graphRef: "mygraph@current" });
// data.query
// data.objects
// data.enums
// etc
```
