'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveToken } from '@/services/api';

// Ícones de olho
function EyeOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) { setError(data?.message || 'Email ou senha inválidos.'); return; }

      const token = data?.token || data?.access_token || data?.data;
      if (!token) { setError('Token não encontrado na resposta da API.'); return; }

      saveToken(token);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', fontFamily: 'var(--font)', padding: '20px',
    }}>
      <style>{`
        .login-input:focus { border-color: var(--accent) !important; }
        .login-btn:hover   { opacity: 0.9; }
        .forgot:hover      { color: var(--accent) !important; }
        .eye-btn:hover     { color: var(--text) !important; }

        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
        input[type="password"]::-webkit-contacts-auto-fill-button,
        input[type="password"]::-webkit-credentials-auto-fill-button { display: none; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📝</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)' }}>Anotações</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>Entre na sua conta para continuar</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 24px' }}>
          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ padding: '9px 13px', background: '#2d1515', border: '1px solid #5c2020', borderRadius: 8, color: '#f87171', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>
                Email
              </label>
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 8, color: 'var(--text)', fontSize: 14,
                  fontFamily: 'inherit', transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Senha */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)' }}>Senha</label>
                <a href="/recuperar-senha" className="forgot" style={{ fontSize: 12, color: 'var(--text2)', textDecoration: 'none', transition: 'color 0.15s' }}>
                  Esqueceu a senha?
                </a>
              </div>

              {/* Campo com botão de olho */}
              <div style={{ position: 'relative' }}>
                <input
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '10px 40px 10px 12px',
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 8, color: 'var(--text)', fontSize: 14,
                    fontFamily: 'inherit', transition: 'border-color 0.15s',
                  }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: 'var(--text2)', display: 'flex', alignItems: 'center',
                    padding: 4, borderRadius: 4, transition: 'color 0.15s',
                  }}
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                width: '100%', padding: '11px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500,
                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
