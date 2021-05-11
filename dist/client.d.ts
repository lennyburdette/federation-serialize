import { DocumentNode } from "graphql";
export declare function fetchSchemas({ graphRef, profile, key, }: {
    graphRef: string;
    profile?: string;
    key?: string;
}): Promise<{
    supergraph: import("graphql").GraphQLSchema;
    api: import("graphql").GraphQLSchema;
    subgraphs: {
        [k: string]: import("graphql").GraphQLSchema;
    };
    subgraphDocuments: {
        [k: string]: DocumentNode;
    };
}>;
