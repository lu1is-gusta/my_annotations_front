'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note, Category, NoteFilter } from '@/types/note';
import {
  getNotes,
  getCategories,
  createNote,
  updateNote,
  deleteNote,
  toggleFavorite,
  toggleArchive,
} from '@/services/notes';

// ── Icons (inline SVG) ─────────────────────────────────────────────────────

const Icons = {
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Star: ({ filled }: { filled?: boolean }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Archive: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  ),
  Note: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  More: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Save: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  ),
};

// ── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'agora mesmo';
  if (mins < 60) return `há ${mins} min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 30) return `há ${days} dias`;
  return new Date(date).toLocaleDateString('pt-BR');
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>');
}

// ── Mock data para desenvolvimento (remova quando a API estiver integrada) ──

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Trabalho', color: '#3b82f6' },
  { id: 2, name: 'Pessoal', color: '#22c55e' },
  { id: 3, name: 'Estudos', color: '#a855f7' },
];

// ── Main Component ─────────────────────────────────────────────────────────

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filter, setFilter] = useState<NoteFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const [notesData, catsData] = await Promise.all([getNotes(), getCategories()]);
        setNotes(notesData);
        setCategories(catsData);
      } catch {
        // fallback to mock for development
        setCategories(MOCK_CATEGORIES);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filtered notes
  const filteredNotes = notes.filter((n) => {
    if (filter === 'favorites' && !n.is_favorite) return false;
    if (filter === 'archived' && !n.is_archived) return false;
    if (filter === 'trash' && !n.deleted_at) return false;
    if (filter === 'all' && (n.is_archived || n.deleted_at)) return false;
    if (selectedCategory && n.category?.id !== selectedCategory) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Counts
  const counts = {
    all: notes.filter((n) => !n.is_archived && !n.deleted_at).length,
    favorites: notes.filter((n) => n.is_favorite).length,
    archived: notes.filter((n) => n.is_archived).length,
    trash: notes.filter((n) => !!n.deleted_at).length,
  };

  // Reload notes
  const reloadNotes = useCallback(async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch {}
  }, []);

  // Handlers
  async function handleSave() {
    if (!editTitle.trim()) return;
    try {
      if (isCreating) {
        const created = await createNote({ title: editTitle, content: editContent, category_id: editCategoryId });
        setNotes((prev) => [created, ...prev]);
        setSelectedNote(created);
      } else if (selectedNote) {
        const updated = await updateNote(selectedNote.id, { title: editTitle, content: editContent, category_id: editCategoryId });
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setSelectedNote(updated);
      }
    } catch {}
    setIsEditing(false);
    setIsCreating(false);
  }

  function handleNewNote() {
    setSelectedNote(null);
    setIsCreating(true);
    setIsEditing(true);
    setEditTitle('');
    setEditContent('');
    setEditCategoryId(categories[0]?.id || 1);
  }

  function handleEdit(note: Note) {
    setSelectedNote(note);
    setIsCreating(false);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategoryId(note.category?.id || categories[0]?.id || 1);
    setMenuOpen(null);
  }

  function handleCancel() {
    setIsEditing(false);
    setIsCreating(false);
  }

  async function handleDelete(note: Note) {
    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      if (selectedNote?.id === note.id) setSelectedNote(null);
    } catch {}
    setMenuOpen(null);
  }

  async function handleFavorite(note: Note) {
    try {
      const updated = await toggleFavorite(note.id, !note.is_favorite);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      if (selectedNote?.id === updated.id) setSelectedNote(updated);
    } catch {}
    setMenuOpen(null);
  }

  async function handleArchive(note: Note) {
    try {
      const updated = await toggleArchive(note.id, !note.is_archived);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      if (selectedNote?.id === updated.id) setSelectedNote(null);
    } catch {}
    setMenuOpen(null);
  }

  // Keyboard shortcut save
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && isEditing) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape' && isEditing) handleCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isEditing, editTitle, editContent, editCategoryId]);

  const filterLabel: Record<NoteFilter, string> = {
    all: 'Anotações',
    favorites: 'Favoritas',
    archived: 'Arquivadas',
    trash: 'Lixeira',
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className={dark ? 'dark' : ''}
      style={{ height: '100vh', display: 'flex', fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f5f4f0;
          --surface: #ffffff;
          --surface2: #eeede9;
          --border: #e0deda;
          --text: #1a1916;
          --text2: #6b6860;
          --accent: #2563eb;
          --accent-soft: #dbeafe;
        }
        .dark {
          --bg: #141412;
          --surface: #1e1d1b;
          --surface2: #252422;
          --border: #2e2d2a;
          --text: #f0ede8;
          --text2: #8a8780;
          --accent: #60a5fa;
          --accent-soft: #1e3a5f;
        }
        body { background: var(--bg); color: var(--text); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .note-card:hover { background: var(--surface2) !important; }
        .sidebar-item:hover { background: var(--surface2) !important; }
        .btn-icon:hover { background: var(--surface2) !important; }
        .note-preview h1, .note-preview h2, .note-preview h3 { margin: 12px 0 6px; font-weight: 600; }
        .note-preview h1 { font-size: 1.4rem; }
        .note-preview h2 { font-size: 1.15rem; }
        .note-preview h3 { font-size: 1rem; color: var(--text2); }
        .note-preview ul { padding-left: 18px; margin: 8px 0; }
        .note-preview li { margin: 3px 0; }
        .note-preview strong { font-weight: 600; }
        textarea { font-family: 'IBM Plex Mono', monospace; resize: none; }
        textarea:focus { outline: none; }
        input:focus { outline: none; }
        .menu-dropdown { animation: fadeIn 0.12s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.2s ease; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0',
      }}>
        {/* New note button */}
        <div style={{ padding: '0 12px 16px' }}>
          <button
            onClick={handleNewNote}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 14px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            <Icons.Plus /> Nova Anotação
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '0 8px', flex: 1 }}>
          {(['all', 'favorites', 'archived', 'trash'] as NoteFilter[]).map((f) => (
            <button
              key={f}
              className="sidebar-item"
              onClick={() => { setFilter(f); setSelectedCategory(null); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'inherit',
                background: filter === f && !selectedCategory ? 'var(--accent-soft)' : 'transparent',
                color: filter === f && !selectedCategory ? 'var(--accent)' : 'var(--text)',
                fontWeight: filter === f && !selectedCategory ? 500 : 400,
                transition: 'background 0.1s',
                marginBottom: 2,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {f === 'all' && <Icons.Note />}
                {f === 'favorites' && <Icons.Star />}
                {f === 'archived' && <Icons.Archive />}
                {f === 'trash' && <Icons.Trash />}
                {filterLabel[f]}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {counts[f]}
              </span>
            </button>
          ))}

          {/* Categories */}
          <div style={{ margin: '16px 10px 8px', fontSize: 11, fontWeight: 500, color: 'var(--text2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Categorias
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="sidebar-item"
              onClick={() => { setSelectedCategory(cat.id); setFilter('all'); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'inherit',
                background: selectedCategory === cat.id ? 'var(--accent-soft)' : 'transparent',
                color: selectedCategory === cat.id ? 'var(--accent)' : 'var(--text)',
                fontWeight: selectedCategory === cat.id ? 500 : 400,
                transition: 'background 0.1s',
                marginBottom: 2,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                {cat.name}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'IBM Plex Mono, monospace' }}>
                {notes.filter((n) => n.category?.id === cat.id && !n.deleted_at).length}
              </span>
            </button>
          ))}
        </nav>

        {/* Settings */}
        <div style={{ padding: '12px 8px 0', borderTop: '1px solid var(--border)' }}>
          <button
            className="sidebar-item"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
              background: 'transparent',
              color: 'var(--text2)',
              transition: 'background 0.1s',
            }}
          >
            <Icons.Settings /> Configurações
          </button>
        </div>
      </aside>

      {/* ── Notes List ── */}
      <section style={{
        width: 290,
        flexShrink: 0,
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>
                {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : filterLabel[filter]}
              </h2>
              <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>
                {filteredNotes.length} anotaç{filteredNotes.length !== 1 ? 'ões' : 'ão'}
              </p>
            </div>
            {/* Dark mode toggle */}
            <button
              className="btn-icon"
              onClick={() => setDark(!dark)}
              style={{
                padding: 6,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                background: 'transparent',
                color: 'var(--text2)',
              }}
            >
              {dark ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }}>
              <Icons.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar anotações..."
              style={{
                width: '100%',
                padding: '8px 10px 8px 34px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontSize: 13,
                color: 'var(--text)',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>Carregando...</div>
          ) : filteredNotes.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
              Nenhuma anotação encontrada
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="note-card"
                onClick={() => { setSelectedNote(note); setIsEditing(false); setIsCreating(false); }}
                style={{
                  padding: '12px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  marginBottom: 4,
                  background: selectedNote?.id === note.id ? 'var(--surface2)' : 'transparent',
                  border: selectedNote?.id === note.id ? '1px solid var(--border)' : '1px solid transparent',
                  transition: 'all 0.1s',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, flex: 1, lineHeight: 1.3 }}>{note.title}</p>
                  {note.category && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 500,
                      padding: '2px 7px',
                      borderRadius: 20,
                      background: note.category.color + '22',
                      color: note.category.color,
                      flexShrink: 0,
                    }}>
                      {note.category.name}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 5, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {note.content.replace(/[#*\-]/g, '').trim()}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>{timeAgo(note.updated_at)}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Note Detail / Editor ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden' }}>
        {!selectedNote && !isCreating ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>📝</div>
              <p style={{ fontSize: 14 }}>Selecione uma anotação ou crie uma nova</p>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderBottom: '1px solid var(--border)',
              gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Título da anotação"
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  />
                ) : (
                  <h1 style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedNote?.title}
                  </h1>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {selectedNote && !isEditing && (
                  <>
                    {selectedNote.category && (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: selectedNote.category.color + '22',
                        color: selectedNote.category.color,
                      }}>
                        {selectedNote.category.name}
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--text2)', marginRight: 4 }}>
                      Atualizada {timeAgo(selectedNote.updated_at)}
                    </span>
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(selectedNote)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', fontSize: 12, background: 'transparent', color: 'var(--text)', fontFamily: 'inherit' }}
                    >
                      <Icons.Edit /> Editar
                    </button>
                    {/* More menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        className="btn-icon"
                        onClick={() => setMenuOpen(menuOpen === selectedNote.id ? null : selectedNote.id)}
                        style={{ padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer', background: 'transparent', color: 'var(--text)', display: 'flex' }}
                      >
                        <Icons.More />
                      </button>
                      {menuOpen === selectedNote.id && (
                        <div
                          className="menu-dropdown"
                          style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            minWidth: 160,
                            zIndex: 100,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            overflow: 'hidden',
                          }}
                        >
                          {[
                            { label: selectedNote.is_favorite ? 'Remover favorito' : 'Favoritar', action: () => handleFavorite(selectedNote) },
                            { label: selectedNote.is_archived ? 'Desarquivar' : 'Arquivar', action: () => handleArchive(selectedNote) },
                            { label: 'Excluir', action: () => handleDelete(selectedNote), danger: true },
                          ].map((item) => (
                            <button
                              key={item.label}
                              onClick={item.action}
                              style={{
                                width: '100%',
                                padding: '9px 14px',
                                border: 'none',
                                background: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontFamily: 'inherit',
                                color: item.danger ? '#ef4444' : 'var(--text)',
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {isEditing && (
                  <>
                    {/* Category selector */}
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(Number(e.target.value))}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid var(--border)',
                        borderRadius: 7,
                        background: 'var(--surface2)',
                        color: 'var(--text)',
                        fontSize: 12,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSave}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '6px 14px', background: 'var(--accent)', color: '#fff',
                        border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 12,
                        fontFamily: 'inherit', fontWeight: 500,
                      }}
                    >
                      <Icons.Save /> Salvar
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '6px 12px', background: 'transparent', color: 'var(--text2)',
                        border: '1px solid var(--border)', borderRadius: 7, cursor: 'pointer',
                        fontSize: 12, fontFamily: 'inherit',
                      }}
                    >
                      <Icons.Close /> Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {isEditing ? (
                <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text2)', padding: '6px 10px', background: 'var(--surface2)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    Use <kbd style={{ fontFamily: 'IBM Plex Mono, monospace', padding: '1px 5px', background: 'var(--border)', borderRadius: 3 }}>Ctrl+S</kbd> para salvar ou <kbd style={{ fontFamily: 'IBM Plex Mono, monospace', padding: '1px 5px', background: 'var(--border)', borderRadius: 3 }}>Esc</kbd> para cancelar
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Escreva sua anotação em Markdown..."
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--text)',
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  />
                </div>
              ) : (
                <div
                  className="note-preview fade-in"
                  style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', lineHeight: 1.7, fontSize: 14, color: 'var(--text)' }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote?.content || '') }}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Overlay to close menu */}
      {menuOpen !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}
