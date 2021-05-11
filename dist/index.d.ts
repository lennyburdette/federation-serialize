export * from "./types";
export declare function serialize({ graphRef, profile, key, }: {
    graphRef: string;
    profile?: string;
    key?: string;
}): Promise<import("./types").SerializedFederatedGraph>;
export declare function runCLI(): Promise<void>;
