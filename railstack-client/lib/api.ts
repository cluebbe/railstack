const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Note {
  id: number;
  title: string;
  body: string;
  created_at: string;
}

export interface NoteCreate {
  title: string;
  body?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  notes: {
    list: () => request<Note[]>("/api/notes/"),
    create: (data: NoteCreate) =>
      request<Note>("/api/notes/", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/api/notes/${id}`, { method: "DELETE" }),
  },
};
