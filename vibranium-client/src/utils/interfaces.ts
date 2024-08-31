export interface Property {
  name: string;
  type: string;
  title: string;
  anyOf?: any[];
  items?: any;
}

export interface Schema {
  name: string;
  title: string;
  type: string;
  properties: Property[];
  required?: string[];
}

export interface Parameter {
  name: string;
  in: string;
  required: boolean;
  schema: {
    type: string;
    title: string;
  };
}

export interface Response {
  description: string;
  content?: {
    "application/json": {
      schema: Schema;
    };
  };
}

export interface Endpoint {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  summary: string;
  operationId: string;
  parameters: Parameter[];
  requestBody: {
    content: {
      "application/json": {
        schema: Schema;
      };
    };
    required: boolean;
  };
  responses: Map<string, Response>;
}
