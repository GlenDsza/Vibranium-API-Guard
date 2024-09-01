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
export type ApiRisk = "High" | "Medium" | "Low" | "None Detected";
export interface TempEndpoint {
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

export const endpoints: TempEndpoint[] = [
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

export interface TempIP {
  ip: string;
}

export const ipaddresses: TempIP[] = [
  { ip: "166.146.62.254" },
  { ip: "42.214.247.167" },
  { ip: "152.33.246.174" },
  { ip: "139.20.115.179" },
  { ip: "88.202.198.188" },
  { ip: "87.154.125.16" },
  { ip: "99.106.74.255" },
  { ip: "58.138.104.239" },
  { ip: "191.243.217.151" },
  { ip: "63.226.53.197" },
];

export interface TempVulnerability {
  method: string;
  endpoint: string;
  risk: string;
  passed: boolean;
}

export const vulnerabilities: TempVulnerability[] = [
  {
    method: "POST",
    endpoint: "/products/{productId}",
    risk: "SQL Injection",
    passed: false,
  },
  {
    method: "GET",
    endpoint: "/products/{productId}",
    risk: "Cross Site Scripting (XSS) ",
    passed: false,
  },
  {
    method: "POST",
    endpoint: "/orders",
    risk: "Mass Assignment",
    passed: true,
  },
  {
    method: "PUT",
    endpoint: "/orders/{orderId}",
    risk: "Broken User Authentication",
    passed: true,
  },
  {
    method: "GET",
    endpoint: "/products",
    risk: "Excessive Data Exposure",
    passed: true,
  },
  {
    method: "PUT",
    endpoint: "/products/{productId}",
    risk: "Broken Function Level Authorization",
    passed: false,
  },
  {
    method: "GET",
    endpoint: "/orders/{orderId}",
    risk: "Broken Object Level Authorization",
    passed: true,
  },
  {
    method: "GET",
    endpoint: "/orders",
    risk: "Excessive Data Exposure",
    passed: true,
  },
];
