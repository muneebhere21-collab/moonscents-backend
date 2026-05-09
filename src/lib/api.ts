const AUTH_STORAGE_KEY = "moonscents.auth.v1";

import { supabase } from "./supabase";

export async function apiRequest<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  let token: string | undefined;
  
  if (typeof window !== "undefined") {
    try {
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch (e) {
      // Session loading
    }
  }
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Only set Content-Type to JSON if not uploading files (FormData)
  if (!(init?.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | { message?: string }) : undefined;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}
