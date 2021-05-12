export interface SerializedFederatedGraph {
    kind: "Graph";
    subgraphs: Subgraph[];
    query: ObjectType;
    mutation?: ObjectType;
    subscription?: ObjectType;
    objects: ObjectType[];
    interfaces: InterfaceType[];
    unions: UnionType[];
    inputs: InputType[];
    enums: Enum[];
    scalars: Scalar[];
    directives: Directive[];
}
export interface Subgraph {
    kind: "Subgraph";
    name: string;
    contact?: {
        name: string;
        url?: string;
        description?: string;
    };
    directives: AppliedDirective[];
    types: (TypeRef | DirectiveRef)[];
    sdl: string;
}
export interface GraphQLElement {
    name: string;
    description: string | null | undefined;
    isDeprecated: boolean;
    deprecationReason?: string;
    directives: AppliedDirective[];
}
interface Federation {
    isAPI: boolean;
    subgraphs: string[];
}
export declare type GraphQLElementKind = ObjectType | Field | Argument | InterfaceType | UnionType | Enum | EnumValue | Scalar | InputType | Directive;
export interface ObjectType extends GraphQLElement {
    kind: "Object";
    fields: Field[];
    interfaces: TypeRef[];
    unions: TypeRef[];
    federation: Federation & {
        isEntity: boolean;
    };
}
export interface InterfaceType extends GraphQLElement {
    kind: "Interface";
    fields: Field[];
    possibleTypes: TypeRef[];
    interfaces: TypeRef[];
    federation: Federation;
}
export interface UnionType extends GraphQLElement {
    kind: "Union";
    possibleTypes: TypeRef[];
    federation: Federation;
}
export interface Enum extends GraphQLElement {
    kind: "Enum";
    values: EnumValue[];
    federation: Federation;
}
export interface Scalar extends GraphQLElement {
    kind: "Scalar";
    specifiedBy: string | undefined;
    federation: Federation;
}
export interface InputType extends GraphQLElement {
    kind: "Input";
    fields: Field[];
    federation: Federation;
}
export interface Directive extends GraphQLElement {
    kind: "Directive";
    arguments: Argument[];
    federation: Federation;
}
export interface Field extends GraphQLElement {
    kind: "Field";
    type: TypeRef;
    arguments: Argument[];
    federation: Federation;
}
export interface Argument extends GraphQLElement {
    kind: "Argument";
    type: TypeRef;
    federation: Federation;
}
export interface EnumValue extends GraphQLElement {
    kind: "EnumValue";
    federation: Federation;
}
export interface AppliedDirective {
    kind: "Directive";
    name: string;
    isRepeatable: boolean;
    args: {
        name: string;
        value: string;
    }[];
    federation: {
        isAPI: boolean;
        subgraphs: string[];
    };
}
export interface TypeRef {
    kind: "Object" | "Interface" | "Union" | "Scalar" | "Enum" | "Input" | "Unknown";
    name: string;
    fullName: string;
}
export interface DirectiveRef {
    kind: "Directive";
    name: string;
}
export {};
