"use client";
const TOKEN_KEY = "bookworm_token";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY);
}
