import { DocumentNode, GraphQLSchema } from "graphql";
import type { SerializedFederatedGraph } from "./types";
interface SchemaStore {
    supergraph: GraphQLSchema;
    api: GraphQLSchema;
    subgraphs: {
        [name: string]: GraphQLSchema;
    };
    subgraphDocuments: {
        [name: string]: DocumentNode;
    };
}
export declare function subgraphNames(supergraph: GraphQLSchema): string[];
export declare function convert(schemas: SchemaStore): Promise<SerializedFederatedGraph>;
export {};
