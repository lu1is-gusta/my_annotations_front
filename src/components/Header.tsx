'use client';

import { useState, useRef, useEffect } from 'react';
import { logout } from '@/services/api';
import { User } from '@/types/note';

interface HeaderProps {
  user: User | null;
  dark: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({ user, dark, onToggleDark, onToggleSidebar, sidebarOpen }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
      <style>{`
        .header-btn:hover { background: var(--surface2) !important; }
        .menu-item:hover { background: var(--surface2) !important; }
        .menu-divider { height: 1px; background: var(--border); margin: 4px 0; }
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .user-menu-dropdown { animation: menuFadeIn 0.15s ease; }
      `}</style>

      <header style={{
        height: 52,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        zIndex: 50,
      }}>

        {/* Left: hamburger + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="header-btn"
            onClick={onToggleSidebar}
            title={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{
              padding: 7,
              border: 'none',
              borderRadius: 7,
              cursor: 'pointer',
              background: 'transparent',
              color: 'var(--text2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hamburger icon */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            📝 Anotações
          </span>
        </div>

        {/* Right: dark mode + user avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Dark mode toggle */}
          <button
            className="header-btn"
            onClick={onToggleDark}
            title={dark ? 'Modo claro' : 'Modo escuro'}
            style={{
              padding: 7,
              border: 'none',
              borderRadius: 7,
              cursor: 'pointer',
              background: 'transparent',
              color: 'var(--text2)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1"  x2="12" y2="3"  />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1"  y1="12" x2="3"  y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
                <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* User avatar button */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title="Minha conta"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '2px solid var(--border)',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
                ...(userMenuOpen ? { borderColor: 'var(--accent)' } : {}),
              }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : initials}
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div
                className="user-menu-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: 210,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
                  zIndex: 200,
                  overflow: 'hidden',
                  padding: '6px',
                }}
              >
                {/* User info */}
                <div style={{ padding: '8px 10px 10px', marginBottom: 2 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'Usuário'}</p>
                  <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{user?.email || ''}</p>
                </div>
                <div className="menu-divider" />

                {/* Menu items */}
                <a
                  href="/perfil"
                  className="menu-item"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 10px',
                    borderRadius: 7,
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Meu perfil
                </a>

                <a
                  href="/configuracoes"
                  className="menu-item"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 10px',
                    borderRadius: 7,
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Configurações
                </a>

                <div className="menu-divider" />

                <button
                  className="menu-item"
                  onClick={() => { setUserMenuOpen(false); logout(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 10px',
                    borderRadius: 7,
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
