import { getCodeSandboxHost } from "@codesandbox/utils";

const apiPort = 8080;
const apiUrl = getCodeSandboxHost(apiPort);

export const API_BASE_URL = apiUrl ? `https://${apiUrl}` : "http://localhost:8080";

export const API_ENDPOINTS = {
  users: "/users",
} as const;
