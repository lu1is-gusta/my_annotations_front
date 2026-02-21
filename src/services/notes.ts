import { apiFetch } from './api';
import { Note, CreateNotePayload, UpdateNotePayload, Category } from '@/types/note';

// ── Notes ──────────────────────────────────────────────────────────────────

export async function getNotes(params?: {
  filter?: 'all' | 'favorites' | 'archived' | 'trash';
  category_id?: number;
  search?: string;
}): Promise<Note[]> {
  const query = new URLSearchParams();
  if (params?.filter) query.set('filter', params.filter);
  if (params?.category_id) query.set('category_id', String(params.category_id));
  if (params?.search) query.set('search', params.search);

  return apiFetch<Note[]>(`/notes?${query.toString()}`);
}

export async function getNote(id: number): Promise<Note> {
  return apiFetch<Note>(`/notes/${id}`);
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  return apiFetch<Note>('/notes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateNote(id: number, payload: UpdateNotePayload): Promise<Note> {
  return apiFetch<Note>(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(id: number): Promise<void> {
  return apiFetch(`/notes/${id}`, { method: 'DELETE' });
}

export async function restoreNote(id: number): Promise<Note> {
  return apiFetch<Note>(`/notes/${id}/restore`, { method: 'PATCH' });
}

export async function toggleFavorite(id: number, value: boolean): Promise<Note> {
  return updateNote(id, { is_favorite: value });
}

export async function toggleArchive(id: number, value: boolean): Promise<Note> {
  return updateNote(id, { is_archived: value });
}

// ── Categories ─────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}
