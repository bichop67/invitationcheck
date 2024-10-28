import { atom } from 'jotai';

interface AdminAuth {
  isAuthenticated: boolean;
  token: string | null;
}

export const adminAuthAtom = atom<AdminAuth>({
  isAuthenticated: false,
  token: null,
});

// Hardcoded admin credentials (in real production, this would be in a secure backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@soirees-entrepreneuriales.com',
  password: 'admin123',
};

export const loginAdmin = async (email: string, password: string) => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const token = btoa(`${email}:${Date.now()}`); // Simple token generation
    localStorage.setItem('adminToken', token);
    return { success: true, token };
  }
  throw new Error('Invalid credentials');
};

export const checkAuthStatus = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
};