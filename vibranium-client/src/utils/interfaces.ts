import { Endpoint } from "@/app/features/EndpointSlice";

export interface Property {
  name: string;
  type: string;
  title: string;
  anyOf?: any[];
  items?: any;
}

export interface Schema {
  _id: string;
  name: string;
  title: string;
  type: string;
  properties: Property[];
  required: string[];
  organization: string;
  createdAt: string;
  updatedAt: string;
}

export interface Threat {
  _id: string;
  endpoint: Endpoint;
  name: string;
  description: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  recommendations?: string;
  status: "Pending" | "Resolved";
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  name: string;
  description: string;
  tags?: string;
  endpoints: Endpoint[];
  organization: string;
  createdAt: string;
  updatedAt: string;
}
