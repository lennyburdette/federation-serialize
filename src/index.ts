import meow from "meow";
import { convert } from "./converter";
import { fetchSchemas } from "./client";

export * from "./types";

export async function serialize({
  graphRef,
  profile,
  key,
}: {
  graphRef: string;
  profile?: string;
  key?: string;
}) {
  const schemas = await fetchSchemas({ graphRef, profile, key });
  return convert(schemas);
}

export async function runCLI() {
  const cli = meow(
    `
    Assumes you have rover installed and in your path: https://go.apollo.dev/rover

    Usage:
      $ federation-serialize --graphRef myschema@current

    Options:
      --graphRef      Reference to your graph in Apollo Studio.
      --profile       Indicates which authentication profile to use with rover.
    `,
    {
      importMeta: import.meta,
      flags: {
        graphRef: {
          type: "string",
          isRequired: true,
        },
        profile: {
          type: "string",
        },
        key: {
          type: "string",
        },
      },
    }
  );

  console.log(JSON.stringify(await serialize(cli.flags), null, 2));
}
