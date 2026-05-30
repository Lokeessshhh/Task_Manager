import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, user: { email }, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      set({ token: access_token, user: { email }, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  init: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT simple way to get email if needed, or just assume valid
      set({ token });
    }
  },
}));
