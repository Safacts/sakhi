import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  sub: string;
  name: string;
  email: string;
  role: string;
  college?: string;
  roll_no?: string;
  branch?: string;
  year?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  exchangeCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// PKCE Helpers
const generateRandomString = (length: number) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = (a: ArrayBuffer) => {
  let str = "";
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('sakhi_token'));
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('sakhi_user') || 'null'));
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8005';

  const login = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/config`);
      const config = await resp.json();
      
      const verifier = generateRandomString(128);
      localStorage.setItem('sakhi_verifier', verifier);
      
      const challengeBuffer = await sha256(verifier);
      const challenge = base64urlencode(challengeBuffer);
      
      const authUrl = `${config.authorize_url}?` + 
        `response_type=code` +
        `&client_id=${config.client_id}` +
        `&redirect_uri=${encodeURIComponent(config.redirect_uri)}` +
        `&code_challenge=${challenge}` +
        `&code_challenge_method=S256`;
        
      window.location.href = authUrl;
    } catch (error) {
      console.error('Auth initiation failed:', error);
      setIsLoading(false);
    }
  };

  const exchangeCode = async (code: string) => {
    setIsLoading(true);
    const verifier = localStorage.getItem('sakhi_verifier');
    if (!verifier) return;

    try {
      const resp = await fetch(`${API_BASE}/auth/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: verifier }),
      });
      
      if (!resp.ok) throw new Error(await resp.text());
      
      const data = await resp.json();
      localStorage.setItem('sakhi_token', data.token);
      localStorage.setItem('sakhi_user', JSON.stringify(data.user));
      localStorage.removeItem('sakhi_verifier');
      
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Token exchange failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sakhi_token');
    localStorage.removeItem('sakhi_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout, exchangeCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
 Hartman
