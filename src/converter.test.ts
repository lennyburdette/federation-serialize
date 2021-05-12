import { buildSchema, parse } from "graphql";
import { convert } from "./converter";
import { readFile } from "fs/promises";
import { buildFederatedSchema } from "@apollo/federation";

async function createSchemas() {
  const [supergraph, api, astronauts, missions] = await Promise.all([
    readFile("src/__test__/supergraph.graphql", "utf-8"),
    readFile("src/__test__/api.graphql", "utf-8"),
    readFile("src/__test__/astronauts.graphql", "utf-8"),
    readFile("src/__test__/missions.graphql", "utf-8"),
  ]);
  return {
    supergraph: buildSchema(supergraph),
    api: buildSchema(api),
    subgraphs: {
      astronauts: buildFederatedSchema(parse(astronauts)),
      missions: buildFederatedSchema(parse(missions)),
    },
    subgraphDocuments: {
      astronauts: parse(astronauts),
      missions: parse(missions),
    },
  };
}

test("converting", async () => {
  expect(await convert(await createSchemas())).toMatchInlineSnapshot(`
    Object {
      "directives": Array [
        Object {
          "arguments": Array [
            Object {
              "description": "Included when true.",
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "if",
              "type": Object {
                "fullName": "Boolean!",
                "kind": "Scalar",
                "name": "Boolean",
              },
            },
          ],
          "deprecationReason": "",
          "description": "Directs the executor to include this field or fragment only when the \`if\` argument is true.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "include",
        },
        Object {
          "arguments": Array [
            Object {
              "description": "Skipped when true.",
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "if",
              "type": Object {
                "fullName": "Boolean!",
                "kind": "Scalar",
                "name": "Boolean",
              },
            },
          ],
          "deprecationReason": "",
          "description": "Directs the executor to skip this field or fragment when the \`if\` argument is true.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "skip",
        },
        Object {
          "arguments": Array [
            Object {
              "description": "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "reason",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": "Marks an element of a GraphQL schema as no longer supported.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "deprecated",
        },
        Object {
          "arguments": Array [
            Object {
              "description": "The URL that specifies the behaviour of this scalar.",
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "url",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": "Exposes a URL that specifies the behaviour of this scalar.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "specifiedBy",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "fields",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "key",
        },
        Object {
          "arguments": Array [],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "extends",
        },
        Object {
          "arguments": Array [],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "external",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "fields",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "requires",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "fields",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "provides",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "feature",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "as",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "core",
        },
        Object {
          "arguments": Array [],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "myfeature",
        },
        Object {
          "arguments": Array [
            Object {
              "description": "Contact title of the subgraph owner",
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "name",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
            Object {
              "description": "URL where the subgraph's owner can be reached",
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "url",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
            Object {
              "description": "Other relevant notes can be included here; supports markdown links",
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "description",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "contact",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "foo",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "testDirective",
        },
        Object {
          "arguments": Array [],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "anotherTestDirective",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "one",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "mismatched",
        },
        Object {
          "arguments": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "Argument",
              "name": "two",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "deprecationReason": "",
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": false,
            "subgraphs": Array [
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Directive",
          "name": "mismatched",
        },
      ],
      "enums": Array [
        Object {
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Enum",
          "name": "TestEnum",
          "values": Array [
            Object {
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "EnumValue",
              "name": "ONE",
            },
            Object {
              "description": undefined,
              "directives": Array [
                Object {
                  "args": Array [
                    Object {
                      "name": "foo",
                      "value": "two",
                    },
                  ],
                  "federation": Object {
                    "isAPI": false,
                    "subgraphs": Array [
                      "astronauts",
                    ],
                  },
                  "isRepeatable": false,
                  "kind": "Directive",
                  "name": "testDirective",
                },
              ],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [],
              },
              "isDeprecated": false,
              "kind": "EnumValue",
              "name": "TWO",
            },
          ],
        },
      ],
      "inputs": Array [],
      "interfaces": Array [
        Object {
          "description": undefined,
          "directives": Array [
            Object {
              "args": Array [],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isRepeatable": false,
              "kind": "Directive",
              "name": "anotherTestDirective",
            },
          ],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "fields": Array [
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "name",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "interfaces": Array [],
          "isDeprecated": false,
          "kind": "Interface",
          "name": "InterfaceTest",
          "possibleTypes": Array [
            Object {
              "fullName": "Astronaut",
              "kind": "Object",
              "name": "Astronaut",
            },
          ],
        },
      ],
      "kind": "Graph",
      "mutation": undefined,
      "objects": Array [
        Object {
          "description": undefined,
          "directives": Array [
            Object {
              "args": Array [
                Object {
                  "name": "fields",
                  "value": "id",
                },
              ],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "astronauts",
                  "missions",
                ],
              },
              "isRepeatable": false,
              "kind": "Directive",
              "name": "key",
            },
            Object {
              "args": Array [
                Object {
                  "name": "one",
                  "value": "astronauts",
                },
              ],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isRepeatable": false,
              "kind": "Directive",
              "name": "mismatched",
            },
            Object {
              "args": Array [
                Object {
                  "name": "two",
                  "value": "missions",
                },
              ],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isRepeatable": false,
              "kind": "Directive",
              "name": "mismatched",
            },
          ],
          "federation": Object {
            "isAPI": true,
            "isEntity": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "fields": Array [
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [
                Object {
                  "args": Array [],
                  "federation": Object {
                    "isAPI": false,
                    "subgraphs": Array [
                      "missions",
                    ],
                  },
                  "isRepeatable": false,
                  "kind": "Directive",
                  "name": "external",
                },
              ],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "astronauts",
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "id",
              "type": Object {
                "fullName": "ID!",
                "kind": "Scalar",
                "name": "ID",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "name",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
            Object {
              "arguments": Array [],
              "deprecationReason": "not relevant",
              "description": undefined,
              "directives": Array [
                Object {
                  "args": Array [
                    Object {
                      "name": "reason",
                      "value": "not relevant",
                    },
                  ],
                  "federation": Object {
                    "isAPI": true,
                    "subgraphs": Array [
                      "astronauts",
                    ],
                  },
                  "isRepeatable": false,
                  "kind": "Directive",
                  "name": "deprecated",
                },
                Object {
                  "args": Array [
                    Object {
                      "name": "foo",
                      "value": "bar",
                    },
                  ],
                  "federation": Object {
                    "isAPI": false,
                    "subgraphs": Array [
                      "astronauts",
                    ],
                  },
                  "isRepeatable": false,
                  "kind": "Directive",
                  "name": "testDirective",
                },
              ],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isDeprecated": true,
              "kind": "Field",
              "name": "isHungry",
              "type": Object {
                "fullName": "Boolean",
                "kind": "Scalar",
                "name": "Boolean",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "testEnum",
              "type": Object {
                "fullName": "TestEnum",
                "kind": "Enum",
                "name": "TestEnum",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "missions",
              "type": Object {
                "fullName": "[Mission]",
                "kind": "Object",
                "name": "Mission",
              },
            },
          ],
          "interfaces": Array [
            Object {
              "fullName": "InterfaceTest",
              "kind": "Interface",
              "name": "InterfaceTest",
            },
          ],
          "isDeprecated": false,
          "kind": "Object",
          "name": "Astronaut",
          "unions": Array [
            Object {
              "fullName": "UnionTest",
              "kind": "Union",
              "name": "UnionTest",
            },
          ],
        },
        Object {
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "isEntity": false,
            "subgraphs": Array [
              "missions",
            ],
          },
          "fields": Array [
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "id",
              "type": Object {
                "fullName": "ID!",
                "kind": "Scalar",
                "name": "ID",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "crew",
              "type": Object {
                "fullName": "[Astronaut]",
                "kind": "Object",
                "name": "Astronaut",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "designation",
              "type": Object {
                "fullName": "String!",
                "kind": "Scalar",
                "name": "String",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "startDate",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
            Object {
              "arguments": Array [],
              "description": undefined,
              "directives": Array [
                Object {
                  "args": Array [
                    Object {
                      "name": "foo",
                      "value": "bar",
                    },
                  ],
                  "federation": Object {
                    "isAPI": false,
                    "subgraphs": Array [
                      "missions",
                    ],
                  },
                  "isRepeatable": false,
                  "kind": "Directive",
                  "name": "testDirective",
                },
              ],
              "federation": Object {
                "isAPI": true,
                "subgraphs": Array [
                  "missions",
                ],
              },
              "isDeprecated": false,
              "kind": "Field",
              "name": "endDate",
              "type": Object {
                "fullName": "String",
                "kind": "Scalar",
                "name": "String",
              },
            },
          ],
          "interfaces": Array [],
          "isDeprecated": false,
          "kind": "Object",
          "name": "Mission",
          "unions": Array [],
        },
      ],
      "query": Object {
        "description": undefined,
        "directives": Array [],
        "federation": Object {
          "isAPI": true,
          "isEntity": false,
          "subgraphs": Array [
            "astronauts",
            "missions",
          ],
        },
        "fields": Array [
          Object {
            "arguments": Array [
              Object {
                "description": undefined,
                "directives": Array [],
                "federation": Object {
                  "isAPI": true,
                  "subgraphs": Array [],
                },
                "isDeprecated": false,
                "kind": "Argument",
                "name": "id",
                "type": Object {
                  "fullName": "ID!",
                  "kind": "Scalar",
                  "name": "ID",
                },
              },
            ],
            "description": "<Sample>{\`
    query GetAstronaut($id: ID!) {
      astronaut(id: $id) {
        id
        name
      }
    }
    \`}</Sample>",
            "directives": Array [],
            "federation": Object {
              "isAPI": true,
              "subgraphs": Array [
                "astronauts",
              ],
            },
            "isDeprecated": false,
            "kind": "Field",
            "name": "astronaut",
            "type": Object {
              "fullName": "Astronaut",
              "kind": "Object",
              "name": "Astronaut",
            },
          },
          Object {
            "arguments": Array [],
            "description": undefined,
            "directives": Array [],
            "federation": Object {
              "isAPI": true,
              "subgraphs": Array [
                "astronauts",
              ],
            },
            "isDeprecated": false,
            "kind": "Field",
            "name": "astronauts",
            "type": Object {
              "fullName": "[Astronaut]",
              "kind": "Object",
              "name": "Astronaut",
            },
          },
          Object {
            "arguments": Array [
              Object {
                "description": undefined,
                "directives": Array [],
                "federation": Object {
                  "isAPI": true,
                  "subgraphs": Array [],
                },
                "isDeprecated": false,
                "kind": "Argument",
                "name": "id",
                "type": Object {
                  "fullName": "ID!",
                  "kind": "Scalar",
                  "name": "ID",
                },
              },
            ],
            "description": "\`\`\`graphql
    query GetMission($id: ID!) {
      mission(id: $id) {
        id
        crew {
          name
        }
      }
    }
    \`\`\`",
            "directives": Array [],
            "federation": Object {
              "isAPI": true,
              "subgraphs": Array [
                "missions",
              ],
            },
            "isDeprecated": false,
            "kind": "Field",
            "name": "mission",
            "type": Object {
              "fullName": "Mission",
              "kind": "Object",
              "name": "Mission",
            },
          },
          Object {
            "arguments": Array [],
            "description": undefined,
            "directives": Array [],
            "federation": Object {
              "isAPI": true,
              "subgraphs": Array [
                "missions",
              ],
            },
            "isDeprecated": false,
            "kind": "Field",
            "name": "missions",
            "type": Object {
              "fullName": "[Mission]",
              "kind": "Object",
              "name": "Mission",
            },
          },
        ],
        "interfaces": Array [],
        "isDeprecated": false,
        "kind": "Object",
        "name": "Query",
        "unions": Array [],
      },
      "scalars": Array [
        Object {
          "description": "The \`ID\` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as \`\\"4\\"\`) or integer (such as \`4\`) input value will be accepted as an ID.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Scalar",
          "name": "ID",
          "specifiedBy": undefined,
        },
        Object {
          "description": "The \`String\` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Scalar",
          "name": "String",
          "specifiedBy": undefined,
        },
        Object {
          "description": "The \`Boolean\` scalar type represents \`true\` or \`false\`.",
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
              "missions",
            ],
          },
          "isDeprecated": false,
          "kind": "Scalar",
          "name": "Boolean",
          "specifiedBy": undefined,
        },
      ],
      "subgraphs": Array [
        Object {
          "contact": Object {
            "description": "send urgent issues to [#oncall](https://yourteam.slack.com/archives/oncall).",
            "name": "Astronauts team",
            "url": "https://myteam.slack.com/archives/teams-chat-room-url",
          },
          "directives": Array [
            Object {
              "args": Array [
                Object {
                  "name": "feature",
                  "value": "https://specs.apollo.dev/core/v0.1",
                },
              ],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isRepeatable": true,
              "kind": "Directive",
              "name": "core",
            },
            Object {
              "args": Array [
                Object {
                  "name": "feature",
                  "value": "https://another.site/myfeature/v1.0",
                },
              ],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isRepeatable": true,
              "kind": "Directive",
              "name": "core",
            },
            Object {
              "args": Array [
                Object {
                  "name": "name",
                  "value": "Astronauts team",
                },
                Object {
                  "name": "url",
                  "value": "https://myteam.slack.com/archives/teams-chat-room-url",
                },
                Object {
                  "name": "description",
                  "value": "send urgent issues to [#oncall](https://yourteam.slack.com/archives/oncall).",
                },
              ],
              "federation": Object {
                "isAPI": false,
                "subgraphs": Array [
                  "astronauts",
                ],
              },
              "isRepeatable": false,
              "kind": "Directive",
              "name": "contact",
            },
          ],
          "kind": "Subgraph",
          "name": "astronauts",
          "types": Array [
            Object {
              "fullName": "Boolean",
              "kind": "Scalar",
              "name": "Boolean",
            },
            Object {
              "fullName": "String",
              "kind": "Scalar",
              "name": "String",
            },
            Object {
              "fullName": "Astronaut",
              "kind": "Object",
              "name": "Astronaut",
            },
            Object {
              "fullName": "ID",
              "kind": "Scalar",
              "name": "ID",
            },
            Object {
              "fullName": "UnionTest",
              "kind": "Union",
              "name": "UnionTest",
            },
            Object {
              "fullName": "InterfaceTest",
              "kind": "Interface",
              "name": "InterfaceTest",
            },
            Object {
              "fullName": "TestEnum",
              "kind": "Enum",
              "name": "TestEnum",
            },
            Object {
              "fullName": "Query",
              "kind": "Object",
              "name": "Query",
            },
            Object {
              "kind": "Directive",
              "name": "include",
            },
            Object {
              "kind": "Directive",
              "name": "skip",
            },
            Object {
              "kind": "Directive",
              "name": "deprecated",
            },
            Object {
              "kind": "Directive",
              "name": "specifiedBy",
            },
            Object {
              "kind": "Directive",
              "name": "key",
            },
            Object {
              "kind": "Directive",
              "name": "extends",
            },
            Object {
              "kind": "Directive",
              "name": "external",
            },
            Object {
              "kind": "Directive",
              "name": "requires",
            },
            Object {
              "kind": "Directive",
              "name": "provides",
            },
            Object {
              "kind": "Directive",
              "name": "core",
            },
            Object {
              "kind": "Directive",
              "name": "myfeature",
            },
            Object {
              "kind": "Directive",
              "name": "contact",
            },
            Object {
              "kind": "Directive",
              "name": "testDirective",
            },
            Object {
              "kind": "Directive",
              "name": "anotherTestDirective",
            },
            Object {
              "kind": "Directive",
              "name": "mismatched",
            },
          ],
        },
        Object {
          "directives": Array [],
          "kind": "Subgraph",
          "name": "missions",
          "types": Array [
            Object {
              "fullName": "Boolean",
              "kind": "Scalar",
              "name": "Boolean",
            },
            Object {
              "fullName": "String",
              "kind": "Scalar",
              "name": "String",
            },
            Object {
              "fullName": "Mission",
              "kind": "Object",
              "name": "Mission",
            },
            Object {
              "fullName": "ID",
              "kind": "Scalar",
              "name": "ID",
            },
            Object {
              "fullName": "Astronaut",
              "kind": "Object",
              "name": "Astronaut",
            },
            Object {
              "fullName": "Query",
              "kind": "Object",
              "name": "Query",
            },
            Object {
              "kind": "Directive",
              "name": "include",
            },
            Object {
              "kind": "Directive",
              "name": "skip",
            },
            Object {
              "kind": "Directive",
              "name": "deprecated",
            },
            Object {
              "kind": "Directive",
              "name": "specifiedBy",
            },
            Object {
              "kind": "Directive",
              "name": "key",
            },
            Object {
              "kind": "Directive",
              "name": "extends",
            },
            Object {
              "kind": "Directive",
              "name": "external",
            },
            Object {
              "kind": "Directive",
              "name": "requires",
            },
            Object {
              "kind": "Directive",
              "name": "provides",
            },
            Object {
              "kind": "Directive",
              "name": "testDirective",
            },
            Object {
              "kind": "Directive",
              "name": "mismatched",
            },
          ],
        },
      ],
      "subscription": undefined,
      "unions": Array [
        Object {
          "description": undefined,
          "directives": Array [],
          "federation": Object {
            "isAPI": true,
            "subgraphs": Array [
              "astronauts",
            ],
          },
          "isDeprecated": false,
          "kind": "Union",
          "name": "UnionTest",
          "possibleTypes": Array [
            Object {
              "fullName": "Astronaut",
              "kind": "Object",
              "name": "Astronaut",
            },
          ],
        },
      ],
    }
  `);
});
