"use client";

import { useEffect, useRef, useState } from "react";
import { api, Note } from "@/lib/api";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  async function fetchNotes() {
    try {
      setNotes(await api.notes.list());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNotes(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = titleRef.current!.value.trim();
    const body = bodyRef.current!.value.trim();
    if (!title) return;
    try {
      await api.notes.create({ title, body });
      titleRef.current!.value = "";
      bodyRef.current!.value = "";
      fetchNotes();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.notes.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Railstack Notes</h1>
      <p className="text-sm text-gray-500 mb-8">Next.js + FastAPI + Postgres on Railway</p>

      <form onSubmit={handleSubmit} className="mb-10 space-y-3">
        <input
          ref={titleRef}
          type="text"
          placeholder="Title"
          required
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          ref={bodyRef}
          placeholder="Body (optional)"
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Add note
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-400 text-sm">No notes yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="border rounded-md px-4 py-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{note.title}</p>
                {note.body && (
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{note.body}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none shrink-0"
                aria-label="Delete"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
