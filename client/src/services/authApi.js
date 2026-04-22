import api from "./api";

export async function loginRequest({ userCode, password }) {
  const response = await api.post("/api/auth/login", {
    userCode,
    password,
  });

  return response.data;
}

export async function getMeRequest() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function logoutRequest() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}
