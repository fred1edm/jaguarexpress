import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  filters: {
    tipo?: string;
    precioMin?: number;
    precioMax?: number;
    calificacionMin?: number;
  };
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: any) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  searchQuery: '',
  filters: {},

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilters: (filters: any) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },
}));

