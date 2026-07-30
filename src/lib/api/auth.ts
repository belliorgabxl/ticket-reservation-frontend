import type { User } from "@/types/auth";
import { API_BASE_URL } from "./base";

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || fallbackMessage);
  }

  return json.data ?? json;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return unwrap<User>(res, "failed to register");
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return unwrap<User>(res, "failed to login");
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  await unwrap<{ loggedOut: boolean }>(res, "failed to logout");
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    return null;
  }

  return unwrap<User>(res, "failed to load current user");
}
