import { buildFederatedSchema } from "@apollo/federation";
import execa from "execa";
import { buildSchema, DocumentNode, parse } from "graphql";
import { subgraphNames } from "./converter";

export async function fetchSchemas({
  graphRef,
  profile,
  key,
}: {
  graphRef: string;
  profile?: string;
  key?: string;
}) {
  const [supergraphSDL, apiSDL] = await Promise.all([
    fetchSupergraph({ graphRef, profile, key }),
    fetchAPIGraph({ graphRef, profile, key }),
  ]);

  const supergraph = buildSchema(supergraphSDL);
  const subgraphs = await Promise.all(
    subgraphNames(supergraph).map(async (name) => {
      const sdl = await fetchSubgraph({ graphRef, name, profile, key });
      return [name, parse(sdl)] as [string, DocumentNode];
    })
  );
  return {
    supergraph,
    api: buildSchema(apiSDL),
    subgraphs: Object.fromEntries(
      subgraphs.map(([name, doc]) => [name, buildFederatedSchema(doc)])
    ),
    subgraphDocuments: Object.fromEntries(subgraphs),
  };
}

async function fetchSupergraph({
  graphRef,
  profile,
  key,
}: {
  graphRef: string;
  profile?: string;
  key?: string;
}) {
  const result = execa(
    "yarn",
    [
      "-s",
      "rover",
      "supergraph",
      "fetch",
      graphRef,
      ...(profile ? ["--profile", profile] : []),
    ],
    {
      env: { APOLLO_KEY: key },
    }
  );
  return (await result).stdout;
}

async function fetchAPIGraph({
  graphRef,
  profile,
  key,
}: {
  graphRef: string;
  profile?: string;
  key?: string;
}) {
  const result = execa(
    "yarn",
    [
      "-s",
      "rover",
      "graph",
      "fetch",
      graphRef,
      ...(profile ? ["--profile", profile] : []),
    ],
    {
      env: { APOLLO_KEY: key },
    }
  );
  return (await result).stdout;
}

async function fetchSubgraph({
  graphRef,
  name,
  profile,
  key,
}: {
  graphRef: string;
  name: string;
  profile?: string;
  key?: string;
}) {
  const result = execa(
    "yarn",
    [
      "-s",
      "rover",
      "subgraph",
      "fetch",
      graphRef,
      "--name",
      name,
      ...(profile ? ["--profile", profile] : []),
    ],
    {
      env: { APOLLO_KEY: key },
    }
  );
  return (await result).stdout;
}
