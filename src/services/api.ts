// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// function getToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('auth_token');
// }

// export async function apiFetch<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = getToken();

//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...((options.headers as Record<string, string>) || {}),
//   };

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });
// console.log(response)
//   if (!response.ok) {
//     if (response.status === 401) {
//       localStorage.removeItem('auth_token');
//       window.location.href = '/users/login';
//     }
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error?.message || `HTTP error ${response.status}`);
//   }

//   return response.json();
// }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Token via cookie ───────────────────────────────────────────────────────
// O token vive APENAS no cookie (SameSite=Lax, path=/)
// O middleware lê esse cookie no servidor para proteger as rotas.

export function saveToken(token: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7 dias
  document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? match[1] : null;
}

export function removeToken() {
  document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
}

// ── Fetch base ─────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getTokenFromCookie();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Não autorizado');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// ── Logout ─────────────────────────────────────────────────────────────────

export async function logout() {
  try {
    await apiFetch('/logout', { method: 'POST' });
  } catch {
    // ignora erro de rede, remove o cookie de qualquer forma
  } finally {
    removeToken();
    window.location.href = '/login';
  }
}
