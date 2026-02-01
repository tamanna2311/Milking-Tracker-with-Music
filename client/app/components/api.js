export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function fetchSessions() {
  const response = await fetch(`${API_BASE_URL}/sessions`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load sessions");
  }
  return response.json();
}

export async function createSession(payload) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save session");
  }

  return response.json();
}
