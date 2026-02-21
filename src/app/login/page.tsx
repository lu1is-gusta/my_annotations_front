'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || 'Email ou senha inválidos.');
        return;
      }

      // Laravel Sanctum retorna o token em data.token ou data.access_token
      const token = data?.token || data?.access_token || data?.data;
      if (token) {
        localStorage.setItem('auth_token', token);
        router.push('/');
      } else {
        setError('Token não encontrado na resposta da API.');
      }
    } catch {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#141412',
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; border-color: #60a5fa !important; }
        .login-btn:hover { background: #3b82f6 !important; }
        .forgot-link:hover { color: #60a5fa !important; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 380, padding: '0 20px' }}>
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#f0ede8' }}>Anotações</h1>
          <p style={{ fontSize: 13, color: '#8a8780', marginTop: 6 }}>Entre na sua conta para continuar</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1e1d1b',
          border: '1px solid #2e2d2a',
          borderRadius: 12,
          padding: '28px 24px',
        }}>
          <form onSubmit={handleLogin}>
            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#2d1515',
                border: '1px solid #5c2020',
                borderRadius: 8,
                color: '#f87171',
                fontSize: 13,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#8a8780', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#252422',
                  border: '1px solid #2e2d2a',
                  borderRadius: 8,
                  color: '#f0ede8',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#8a8780' }}>Senha</label>
                <a
                  href="/recuperar-senha"
                  className="forgot-link"
                  style={{ fontSize: 12, color: '#8a8780', textDecoration: 'none', transition: 'color 0.15s' }}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#252422',
                  border: '1px solid #2e2d2a',
                  borderRadius: 8,
                  color: '#f0ede8',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={{
                width: '100%',
                padding: '11px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.15s',
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
