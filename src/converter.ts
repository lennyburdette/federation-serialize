import {
  DirectiveNode,
  DocumentNode,
  EnumTypeExtensionNode,
  getNamedType,
  GraphQLArgument,
  GraphQLDeprecatedDirective,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLEnumValue,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLType,
  GraphQLUnionType,
  InputObjectTypeExtensionNode,
  InterfaceTypeExtensionNode,
  isDirective,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isIntrospectionType,
  isNamedType,
  isObjectType,
  isScalarType,
  isUnionType,
  ObjectTypeExtensionNode,
  print,
  ScalarTypeExtensionNode,
  SchemaDefinitionNode,
  SchemaExtensionNode,
  UnionTypeExtensionNode,
  ValueNode,
} from "graphql";
import type {
  Argument,
  Directive,
  AppliedDirective,
  Enum,
  EnumValue,
  Field,
  SerializedFederatedGraph,
  InputType,
  InterfaceType,
  ObjectType,
  Scalar,
  Subgraph,
  TypeRef,
  UnionType,
  DirectiveRef,
} from "./types";

interface SchemaStore {
  supergraph: GraphQLSchema;
  api: GraphQLSchema;
  subgraphs: { [name: string]: GraphQLSchema };
  subgraphDocuments: { [name: string]: DocumentNode };
}

export function subgraphNames(supergraph: GraphQLSchema) {
  const joinEnum = supergraph.getType("join__Graph");
  const result = new Set<string>();
  if (isEnumType(joinEnum)) {
    Object.values(joinEnum.getValues()).forEach((enumValue) => {
      const graphName = getDirectiveArgumentString(
        enumValue,
        "join__graph",
        "name"
      );
      if (graphName) {
        result.add(graphName);
      }
    });
  }
  return Array.from(result);
}

export async function convert(
  schemas: SchemaStore
): Promise<SerializedFederatedGraph> {
  const { api, subgraphs } = schemas;

  const queryType =
    api.getQueryType() ??
    new GraphQLObjectType({ name: "Query", fields: () => ({}) });
  const mutationType = api.getMutationType();
  const subscriptionType = api.getSubscriptionType();

  const types = Object.values(api.getTypeMap()).filter(
    (o) => !isIntrospectionType(o)
  );
  const objects = types.filter(isObjectType).filter((o) => {
    return o !== queryType && o !== mutationType && o !== subscriptionType;
  });
  const interfaces = types.filter(isInterfaceType);
  const unions = types.filter(isUnionType);
  const inputs = types.filter(isInputObjectType);
  const enums = types.filter(isEnumType);
  const scalars = types.filter(isScalarType);
  const directives = uniqueDirectives(api.getDirectives(), subgraphs);

  return {
    kind: "Graph",
    subgraphs: Object.entries(subgraphs).map(([name, schema]) =>
      convertSubgraph(name, schema, schemas.subgraphDocuments[name], schemas)
    ),
    query: convertObject(queryType, schemas),
    mutation: mutationType ? convertObject(mutationType, schemas) : undefined,
    subscription: subscriptionType
      ? convertObject(subscriptionType, schemas)
      : undefined,
    objects: objects.map((obj) => convertObject(obj, schemas)),
    interfaces: interfaces.map((iface) => convertInterface(iface, schemas)),
    unions: unions.map((union) => convertUnion(union, schemas)),
    inputs: inputs.map((input) => convertInput(input, schemas)),
    enums: enums.map((e) => convertEnum(e, schemas)),
    scalars: scalars.map((scalar) => convertScalar(scalar, schemas)),
    directives: directives.map(({ directive, subgraphNames }) =>
      convertDirective(directive, schemas, subgraphNames)
    ),
  };
}

function convertSubgraph(
  name: string,
  subgraph: GraphQLSchema,
  subgraphDocument: DocumentNode,
  schemas: SchemaStore
): Subgraph {
  const types = Object.values(subgraph.getTypeMap()).filter(
    (type) => !isIntrospectionType(type) && isAPIType(type, schemas.api)
  );

  const directiveDefs = subgraph.getDirectives();
  return {
    kind: "Subgraph",
    name,
    ...contactInfo(subgraphDocument),
    directives: appliedSchemaDirectives(
      name,
      subgraphDocument,
      directiveDefs,
      schemas
    ),
    types: [...types.map(ref), ...directiveDefs.map(directiveRef)],
    sdl: print(subgraphDocument),
  };
}

function convertObject(
  obj: GraphQLObjectType,
  schemas: SchemaStore
): ObjectType {
  const fields = Object.values(obj.getFields());

  return {
    kind: "Object",
    name: obj.name,
    description: obj.description,
    ...deprecationInfo(obj),
    federation: {
      isEntity: isEntityType(obj, schemas.subgraphs),
      isAPI: isAPIType(obj, schemas.api),
      subgraphs: subgraphsForType(obj, schemas.subgraphs),
    },
    directives: appliedDirectivesForType(obj, schemas),
    fields: fields.map((f) => convertField(f, obj, schemas)),
    interfaces: obj.getInterfaces().map(ref),
    unions: unionsForType(obj, schemas).map(ref),
  };
}

function convertField(
  field: GraphQLField<any, any>,
  parentType: GraphQLObjectType | GraphQLInterfaceType,
  schemas: SchemaStore
): Field {
  return {
    kind: "Field",
    name: field.name,
    description: field.description,
    ...deprecationInfo(field),
    federation: {
      isAPI: isAPIType(parentType, schemas.api),
      subgraphs: subgraphsForField(field, parentType, schemas.subgraphs),
    },
    directives: appliedDirectivesForFieldType(field, parentType, schemas),
    type: ref(field.type),
    arguments: field.args.map((arg) =>
      convertArgument(arg, parentType, schemas)
    ),
  };
}

function convertInputField(
  field: GraphQLInputField,
  input: GraphQLInputObjectType,
  schemas: SchemaStore
): Field {
  return {
    kind: "Field",
    name: field.name,
    description: field.description,
    ...deprecationInfo(field),
    federation: {
      isAPI: isAPIType(input, schemas.api),
      subgraphs: subgraphsForField(field, input, schemas.subgraphs),
    },
    directives: appliedDirectivesForFieldType(field, input, schemas),
    type: ref(field.type),
    arguments: [],
  };
}

function convertInterface(
  iface: GraphQLInterfaceType,
  schemas: SchemaStore
): InterfaceType {
  const fields = Object.values(iface.getFields());

  return {
    kind: "Interface",
    name: iface.name,
    description: iface.description,
    ...deprecationInfo(iface),
    federation: {
      isAPI: isAPIType(iface, schemas.api),
      subgraphs: subgraphsForType(iface, schemas.subgraphs),
    },
    directives: appliedDirectivesForType(iface, schemas),
    fields: fields.map((f) => convertField(f, iface, schemas)),
    possibleTypes: objectsForInterface(iface, schemas).map(ref),
    interfaces: iface.getInterfaces().map(ref),
  };
}

function convertUnion(
  union: GraphQLUnionType,
  schemas: SchemaStore
): UnionType {
  return {
    kind: "Union",
    name: union.name,
    description: union.description,
    ...deprecationInfo(union),
    federation: {
      isAPI: isAPIType(union, schemas.api),
      subgraphs: subgraphsForType(union, schemas.subgraphs),
    },
    directives: appliedDirectivesForType(union, schemas),
    possibleTypes: Object.values(union.getTypes()).map(ref),
  };
}

function convertInput(
  input: GraphQLInputObjectType,
  schemas: SchemaStore
): InputType {
  const fields = Object.values(input.getFields());

  return {
    kind: "Input",
    name: input.name,
    description: input.description,
    ...deprecationInfo(input),
    federation: {
      isAPI: isAPIType(input, schemas.api),
      subgraphs: subgraphsForType(input, schemas.subgraphs),
    },
    directives: appliedDirectivesForType(input, schemas),
    fields: fields.map((f) => convertInputField(f, input, schemas)),
  };
}

function convertEnum(enumType: GraphQLEnumType, schemas: SchemaStore): Enum {
  const values = enumType.getValues();
  return {
    kind: "Enum",
    name: enumType.name,
    description: enumType.description,
    ...deprecationInfo(enumType),
    federation: {
      isAPI: isAPIType(enumType, schemas.api),
      subgraphs: subgraphsForType(enumType, schemas.subgraphs),
    },
    directives: appliedDirectivesForType(enumType, schemas),
    values: values.map((v) => convertEnumValue(v, enumType, schemas)),
  };
}

function convertEnumValue(
  enumValue: GraphQLEnumValue,
  enumType: GraphQLEnumType,
  schemas: SchemaStore
): EnumValue {
  return {
    kind: "EnumValue",
    name: enumValue.name,
    description: enumValue.description,
    ...deprecationInfo(enumValue),
    federation: {
      isAPI: isAPIType(enumType, schemas.api),
      subgraphs: [], // TODO
    },
    directives: appliedDirectivesForEnumValue(enumValue, enumType, schemas),
  };
}

function convertScalar(
  scalar: GraphQLScalarType,
  schemas: SchemaStore
): Scalar {
  return {
    kind: "Scalar",
    name: scalar.name,
    description: scalar.description,
    ...deprecationInfo(scalar),
    federation: {
      isAPI: isAPIType(scalar, schemas.api),
      subgraphs: subgraphsForType(scalar, schemas.subgraphs),
    },
    directives: appliedDirectivesForType(scalar, schemas),
    specifiedBy: getDirectiveArgumentString(scalar, "specifiedBy", "url"),
  };
}

function convertDirective(
  directive: GraphQLDirective,
  schemas: SchemaStore,
  subgraphNames: Set<string>
): Directive {
  return {
    kind: "Directive",
    name: directive.name,
    description: directive.description,
    deprecationReason: "",
    isDeprecated: false,
    federation: {
      isAPI: isAPIDirective(directive, schemas.api),
      subgraphs: Array.from(subgraphNames),
    },
    directives: [],
    arguments: directive.args.map((arg) =>
      convertArgument(arg, directive, schemas)
    ),
  };
}

function convertArgument(
  arg: GraphQLArgument,
  parent: GraphQLObjectType | GraphQLInterfaceType | GraphQLDirective,
  schemas: SchemaStore
): Argument {
  return {
    kind: "Argument",
    name: arg.name,
    description: arg.description,
    ...deprecationInfo(arg),
    federation: {
      isAPI: isDirective(parent)
        ? isAPIDirective(parent, schemas.api)
        : isAPIType(parent, schemas.api),
      subgraphs: [], // todo
    },
    directives: appliedDirectives(arg, schemas.api.getDirectives(), schemas),
    type: ref(arg.type),
  };
}

// -------------- Directives ---------------

function deprecationInfo(
  type:
    | GraphQLNamedType
    | GraphQLField<any, any>
    | GraphQLInputField
    | GraphQLArgument
    | GraphQLEnumValue
): { isDeprecated: boolean; deprecationReason?: string } {
  const deprecationReason = getDirectiveArgumentString(
    type,
    GraphQLDeprecatedDirective.name,
    "reason"
  );

  return deprecationReason
    ? { isDeprecated: !!deprecationReason, deprecationReason }
    : { isDeprecated: false };
}

function contactInfo(
  doc: DocumentNode
): { name: string; url?: string; description?: string } | {} {
  const name = getSchemaDirectiveArgumentString(doc, "contact", "name");
  const url = getSchemaDirectiveArgumentString(doc, "contact", "url");
  const description = getSchemaDirectiveArgumentString(
    doc,
    "contact",
    "description"
  );

  return name ? { contact: { name, url, description } } : {};
}

type TypesWithDirectives =
  | GraphQLNamedType
  | GraphQLField<any, any>
  | GraphQLInputField
  | GraphQLArgument
  | GraphQLEnumValue;

type ExtensionNode =
  | ScalarTypeExtensionNode
  | ObjectTypeExtensionNode
  | InterfaceTypeExtensionNode
  | UnionTypeExtensionNode
  | EnumTypeExtensionNode
  | InputObjectTypeExtensionNode;

function getDirectives(type: TypesWithDirectives) {
  let extensionDirectives: DirectiveNode[] = [];
  if (isNamedType(type)) {
    const extensionASTNodes = type.extensionASTNodes ?? [];
    extensionDirectives =
      extensionASTNodes
        ?.flatMap((node: ExtensionNode) => node.directives)
        ?.filter((d): d is DirectiveNode => !!d) ?? [];
  }
  return [...(type.astNode?.directives ?? []), ...extensionDirectives];
}

function getDirectiveByName(type: TypesWithDirectives, name: string) {
  return getDirectives(type).find((d) => d.name.value === name);
}

function getArgumentByName(node: DirectiveNode, name: string) {
  return node.arguments?.find((a) => a.name.value === name);
}

function getDirectiveArgument(
  type: TypesWithDirectives,
  directiveName: string,
  argumentName: string
) {
  const directive = getDirectiveByName(type, directiveName);
  if (directive) {
    return getArgumentByName(directive, argumentName);
  }
}

function getDirectiveArgumentString(
  type: TypesWithDirectives,
  directiveName: string,
  argumentName: string
): string | undefined {
  const arg = getDirectiveArgument(type, directiveName, argumentName);
  return arg ? valueNodeString(arg.value) : undefined;
}

function valueNodeString(valueNode: ValueNode): string {
  switch (valueNode?.kind) {
    case "BooleanValue":
      return valueNode.value ? "true" : "false";
    case "EnumValue":
      return valueNode.value;
    case "FloatValue":
      return valueNode.value;
    case "IntValue":
      return valueNode.value;
    case "ListValue":
      return JSON.stringify(valueNode.values.map(valueNodeString));
    case "NullValue":
      return "null";
    case "ObjectValue":
      return JSON.stringify(
        Object.fromEntries(
          valueNode.fields.map((f) => [f.name, valueNodeString(f.value)])
        )
      );
    case "StringValue":
      return valueNode.value;
    case "Variable":
      return `\$${valueNode.name}`;
  }
}

// ---------------- Schema directives ---------------
// buildFederatedSchema throws away astNodes and therefore directives, so we need
// different utilities for this

function getSchemaDirectives(doc: DocumentNode) {
  return doc.definitions
    .filter(
      (def): def is SchemaDefinitionNode | SchemaExtensionNode =>
        def.kind === "SchemaDefinition" || def.kind === "SchemaExtension"
    )
    .flatMap((node) => node.directives ?? []);
}

function getSchemaDirectiveByName(doc: DocumentNode, name: string) {
  return getSchemaDirectives(doc).find(
    (directive) => directive.name.value === name
  );
}

function getSchemaDirectiveArgument(
  doc: DocumentNode,
  directiveName: string,
  argumentName: string
) {
  const directive = getSchemaDirectiveByName(doc, directiveName);
  if (directive) {
    return getArgumentByName(directive, argumentName);
  }
}

function getSchemaDirectiveArgumentString(
  doc: DocumentNode,
  directiveName: string,
  argumentName: string
) {
  const arg = getSchemaDirectiveArgument(doc, directiveName, argumentName);
  return arg ? valueNodeString(arg.value) : undefined;
}

// ---------------- Composite Type ------------------

function unionsForType(type: GraphQLObjectType, schemas: SchemaStore) {
  const unions = Object.values(schemas.api.getTypeMap()).filter(isUnionType);
  return unions.filter((u) => u.getTypes().includes(type));
}

function objectsForInterface(
  iface: GraphQLInterfaceType,
  schemas: SchemaStore
) {
  const objectsAndInterfaces = Object.values(schemas.api.getTypeMap()).filter(
    (t) => isObjectType(t) || isInterfaceType(t)
  );
  return objectsAndInterfaces.filter((o) => {
    if (isObjectType(o))
      return o.getInterfaces().some((i) => i.name === iface.name);
    if (isInterfaceType(o))
      return o.getInterfaces().some((i) => i.name === iface.name);
    return false;
  });
}

// ---------------- References to other types ---------------

function elementToKind(
  type: GraphQLType | null | undefined
): "Object" | "Interface" | "Union" | "Enum" | "Scalar" | "Input" | "Unknown" {
  if (isObjectType(type)) return "Object";
  if (isInterfaceType(type)) return "Interface";
  if (isUnionType(type)) return "Union";
  if (isInputObjectType(type)) return "Input";
  if (isEnumType(type)) return "Enum";
  if (isScalarType(type)) return "Scalar";
  return "Unknown";
}

function ref(type: GraphQLType): TypeRef {
  const namedType = getNamedType(type);
  const kind = elementToKind(namedType);
  return {
    kind,
    name: namedType.name,
    fullName: type.toString(),
  };
}

function directiveRef(directive: GraphQLDirective): DirectiveRef {
  return {
    kind: "Directive",
    name: directive.name,
  };
}

function appliedDirective(
  directive: DirectiveNode,
  directiveDef: GraphQLDirective,
  subgraphs: string[],
  schemas: SchemaStore
): AppliedDirective {
  return {
    kind: "Directive",
    name: directiveDef.name,
    args:
      directive.arguments?.map((arg) => ({
        name: arg.name.value,
        value: valueNodeString(arg.value),
      })) ?? [],
    isRepeatable: directiveDef.isRepeatable,
    federation: {
      isAPI: isAPIDirective(directiveDef, schemas.api),
      subgraphs: subgraphs ?? [],
    },
  };
}

function appliedDirectives(
  type: TypesWithDirectives,
  directives: readonly GraphQLDirective[],
  schemas: SchemaStore
) {
  const directivesByName = new Map(directives.map((d) => [d.name, d]));
  return (
    type.astNode?.directives
      ?.map((d) => {
        const def = directivesByName.get(d.name.value);
        if (def) return appliedDirective(d, def, [], schemas);
      })
      ?.filter((ref): ref is AppliedDirective => !!ref) ?? []
  );
}

function appliedSchemaDirectives(
  subgraphName: string,
  doc: DocumentNode,
  defs: readonly GraphQLDirective[],
  schemas: SchemaStore
) {
  const defsByName = new Map(defs.map((d) => [d.name, d]));
  const directives = getSchemaDirectives(doc);
  return directives
    .map((d) => {
      const def = defsByName.get(d.name.value);
      if (def) return appliedDirective(d, def, [subgraphName], schemas);
    })
    .filter((ref): ref is AppliedDirective => !!ref);
}

// ---------------- Subgraph helpers ---------------

function isAPIType(type: GraphQLType, api: GraphQLSchema): boolean {
  const namedType = getNamedType(type);
  return api.getType(namedType.name) != null;
}

function isAPIDirective(
  directive: GraphQLDirective,
  api: GraphQLSchema
): boolean {
  return api.getDirective(directive.name) != null;
}

function subgraphsForType(
  type: GraphQLType,
  subgraphs: { [name: string]: GraphQLSchema }
): string[] {
  const namedType = getNamedType(type);
  return Object.entries(subgraphs)
    .map(([name, schema]) => {
      return schema.getType(namedType.name) ? name : undefined;
    })
    .filter((s): s is string => !!s);
}

function subgraphsForField(
  field: GraphQLField<any, any> | GraphQLInputField,
  parentType: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType,
  subgraphs: { [name: string]: GraphQLSchema }
) {
  return Object.entries(subgraphs)
    .map(([name, schema]) => {
      const schemaType = schema.getType(parentType.name);
      if (
        isObjectType(schemaType) ||
        isInterfaceType(schemaType) ||
        isInputObjectType(schemaType)
      ) {
        if (schemaType.getFields()[field.name]) {
          return name;
        }
      }
    })
    .filter((s): s is string => !!s);
}

function isEntityType(
  type: GraphQLObjectType,
  subgraphs: { [name: string]: GraphQLSchema }
): boolean {
  for (const [_name, schema] of Object.entries(subgraphs)) {
    const schemaType = schema.getType(type.name);
    if (schemaType) {
      const keyDirective = getDirectiveByName(schemaType, "key");
      if (keyDirective) {
        return true;
      }
    }
  }
  return false;
}

function subgraphDirectives(subgraphs: { [name: string]: GraphQLSchema }) {
  const directivesBySubgraph = new Map<string, readonly GraphQLDirective[]>();
  for (const [name, schema] of Object.entries(subgraphs)) {
    directivesBySubgraph.set(name, schema.getDirectives());
  }
  return directivesBySubgraph;
}

function uniqueDirectives(
  apiDirectives: readonly GraphQLDirective[],
  subgraphs: { [name: string]: GraphQLSchema }
) {
  const directiveBySubgraph = subgraphDirectives(subgraphs);

  const directivesByName = new Map(apiDirectives.map((d) => [d.name, d]));
  const allDirectives: {
    directive: GraphQLDirective;
    subgraphNames: Set<string>;
  }[] = apiDirectives.map((d) => ({
    directive: d,
    subgraphNames: new Set(),
  }));

  for (const [name, directives] of directiveBySubgraph) {
    for (const directive of directives) {
      if (!directivesByName.has(directive.name)) {
        directivesByName.set(directive.name, directive);
        allDirectives.push({ directive, subgraphNames: new Set([name]) });
      } else if (
        directivesAreEqual(directivesByName.get(directive.name)!, directive)
      ) {
        allDirectives
          .find((v) => v.directive.name === directive.name)
          ?.subgraphNames.add(name);
      } else {
        allDirectives.push({ directive, subgraphNames: new Set([name]) });
      }
    }
  }

  return allDirectives;
}

function getAppliedDirectives(
  type: TypesWithDirectives,
  schemas: SchemaStore,
  subgraphName?: string
) {
  const schema = subgraphName ? schemas.subgraphs[subgraphName] : schemas.api;
  return getDirectives(type)
    .map((directive) => {
      const directiveDef = schema.getDirective(directive.name.value);
      return directiveDef
        ? appliedDirective(
            directive,
            directiveDef,
            subgraphName ? [subgraphName] : [],
            schemas
          )
        : undefined;
    })
    .filter((obj): obj is AppliedDirective => !!obj);
}

function appliedDirectivesForType(
  type: TypesWithDirectives,
  schemas: SchemaStore
) {
  const collect = getAppliedDirectives(type, schemas);

  for (const [name, schema] of Object.entries(schemas.subgraphs)) {
    const subgraphType = schema.getType(type.name);
    if (subgraphType) {
      collect.push(...getAppliedDirectives(subgraphType, schemas, name));
    }
  }

  return mergeDirectiveRefsWithSubgraphs(collect);
}

function appliedDirectivesForFieldType(
  field: GraphQLField<any, any> | GraphQLInputField,
  parentType: TypesWithDirectives,
  schemas: SchemaStore
) {
  const collect = getAppliedDirectives(field, schemas);

  for (const [name, schema] of Object.entries(schemas.subgraphs)) {
    const subgraphType = schema.getType(parentType.name);
    if (
      isObjectType(subgraphType) ||
      isInterfaceType(subgraphType) ||
      isInputObjectType(subgraphType)
    ) {
      const subgraphField = subgraphType.getFields()[field.name];

      if (subgraphField) {
        collect.push(...getAppliedDirectives(subgraphField, schemas, name));
      }
    }
  }

  return mergeDirectiveRefsWithSubgraphs(collect);
}

function appliedDirectivesForEnumValue(
  enumValue: GraphQLEnumValue,
  parentType: TypesWithDirectives,
  schemas: SchemaStore
) {
  const collect = getAppliedDirectives(enumValue, schemas);

  for (const [name, schema] of Object.entries(schemas.subgraphs)) {
    const subgraphType = schema.getType(parentType.name);
    if (isEnumType(subgraphType)) {
      const subgraphEnumValue = subgraphType
        .getValues()
        .find((v) => v.name === enumValue.name);

      if (subgraphEnumValue) {
        collect.push(...getAppliedDirectives(subgraphEnumValue, schemas, name));
      }
    }
  }

  return mergeDirectiveRefsWithSubgraphs(collect);
}

function mergeDirectiveRefsWithSubgraphs(refs: AppliedDirective[]) {
  const result: AppliedDirective[] = [];

  for (const directiveRef of refs) {
    const found = result.filter((ref) => ref.name === directiveRef.name);
    if (found.length) {
      for (const foundRef of found) {
        if (directiveRefsAreEqual(foundRef, directiveRef)) {
          const subgraphs = Array.from(
            new Set([
              ...foundRef.federation.subgraphs,
              ...directiveRef.federation.subgraphs,
            ])
          );
          foundRef.federation.subgraphs = subgraphs;
        } else {
          result.push(directiveRef);
        }
      }
    } else {
      result.push(directiveRef);
    }
  }

  return result;
}

function directivesAreEqual(d1: GraphQLDirective, d2: GraphQLDirective) {
  return (
    d1.name === d2.name &&
    d1.isRepeatable === d2.isRepeatable &&
    arraysAreEqual(
      d1.args.map((d) => d.name),
      d2.args.map((d) => d.name)
    ) &&
    arraysAreEqual(
      d1.args.map((d) => d.type.inspect()),
      d2.args.map((d) => d.type.inspect())
    )
  );
}

function directiveRefsAreEqual(d1: AppliedDirective, d2: AppliedDirective) {
  return (
    d1.name === d2.name &&
    d1.isRepeatable === d2.isRepeatable &&
    arraysAreEqual(
      d1.args.map((a) => a.name),
      d2.args.map((a) => a.name)
    ) &&
    arraysAreEqual(
      d1.args.map((a) => a.value),
      d2.args.map((a) => a.value)
    )
  );
}

function arraysAreEqual(a1: any[], a2: any[]) {
  if (a1.length !== a2.length) return false;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}
