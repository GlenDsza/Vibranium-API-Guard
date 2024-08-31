export const apisForCoverage: { name: string; coverage: number }[] = [
  {
    name: "Login APIs",
    coverage: 80,
  },
  {
    name: "Signup APIs",
    coverage: 90,
  },
  {
    name: "Payment APIs",
    coverage: 70,
  },
  {
    name: "Profile APIs",
    coverage: 60,
  },
  {
    name: "Notification APIs",
    coverage: 50,
  },
  {
    name: "Chat APIs",
    coverage: 40,
  },
  {
    name: "Settings APIs",
    coverage: 30,
  },
  {
    name: "Admin APIs",
    coverage: 20,
  },
  {
    name: "User APIs",
    coverage: 10,
  },
];

export type ApiType = "GET" | "POST" | "PUT" | "DELETE";
export type ApiRisk = "High" | "Medium" | "Low";
export interface Endpoint {
  id: string;
  type: ApiType;
  path: string;
  risk: ApiRisk;
  hostName: string;
  collection: string;
  accessType: string;
  authType: string;
  created_at: Date;
}

export const endpoints: Endpoint[] = [
  {
    id: "1",
    type: "GET",
    path: "/api/v1/login",
    risk: "High",
    hostName: "localhost",
    collection: "Authentication",
    accessType: "Public",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "2",
    type: "POST",
    path: "/api/v1/signup",
    risk: "Medium",
    hostName: "localhost",
    collection: "Authentication",
    accessType: "Public",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "3",
    type: "GET",
    path: "/api/v1/payment",
    risk: "Low",
    hostName: "localhost",
    collection: "Payment",
    accessType: "Private",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "4",
    type: "GET",
    path: "/api/v1/profile",
    risk: "Low",
    hostName: "localhost",
    collection: "User",
    accessType: "Private",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "5",
    type: "PUT",
    path: "/api/v1/notification",
    risk: "Low",
    hostName: "localhost",
    collection: "User",
    accessType: "Private",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "6",
    type: "DELETE",
    path: "/api/v1/chat",
    risk: "Low",
    hostName: "localhost",
    collection: "User",
    accessType: "Private",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "7",
    type: "GET",
    path: "/api/v1/settings",
    risk: "Low",
    hostName: "localhost",
    collection: "Settings",
    accessType: "Private",
    authType: "JWT",
    created_at: new Date(),
  },
  {
    id: "8",
    type: "POST",
    path: "/api/v1/admin",
    risk: "Low",
    hostName: "localhost",
    collection: "Admin",
    accessType: "Private",
    authType: "JWT",
    created_at: new Date(),
  },
];
