import { create } from 'zustand';
import api from '../api/axios';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async (stage = null, page = 1, append = false) => {
    set({ isLoading: true });
    try {
      const params = { page, limit: 20 };
      if (stage) params.stage = stage;
      const response = await api.get('/tasks', { params });
      set((state) => ({
        tasks: append ? [...state.tasks, ...response.data] : response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTask: async (data) => {
    try {
      const response = await api.post('/tasks', data);
      set((state) => ({ tasks: [response.data, ...state.tasks] }));
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id) => {
    // Optimistic delete
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      set({ tasks: previousTasks });
      throw error;
    }
  },
}));
