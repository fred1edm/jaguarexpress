import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, Negocio, Producto, Pedido } from '@/types';
import { authApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Store de autenticación
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await authApi.login({ email, password });
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('¡Bienvenido!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: any) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register(data);
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('¡Cuenta creada exitosamente!');
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success('Sesión cerrada');
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const updatedUser = await authApi.updateProfile(data);
          set({ user: updatedUser });
          localStorage.setItem('user', JSON.stringify(updatedUser));
          toast.success('Perfil actualizado');
        } catch (error: any) {
          throw error;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Store del carrito de compras
interface CartState {
  items: CartItem[];
  negocio: Negocio | null;
  total: number;
  addItem: (producto: Producto, cantidad: number, observaciones?: string) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  canAddProduct: (negocioId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      negocio: null,
      total: 0,

      addItem: (producto: Producto, cantidad: number, observaciones?: string) => {
        const state = get();
        
        // Verificar si se puede agregar el producto
        if (state.negocio && state.negocio.id !== producto.negocioId) {
          toast.error('Solo puedes agregar productos del mismo negocio');
          return;
        }

        const existingItem = state.items.find(item => item.producto.id === producto.id);
        
        if (existingItem) {
          // Actualizar cantidad del producto existente
          const updatedItems = state.items.map(item =>
            item.producto.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad, observaciones }
              : item
          );
          
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + (item.producto.precio * item.cantidad),
            0
          );
          
          set({ items: updatedItems, total: newTotal });
        } else {
          // Agregar nuevo producto
          const newItem: CartItem = {
            id: `${producto.id}-${Date.now()}`,
            producto,
            cantidad,
            observaciones,
            subtotal: producto.precio * cantidad,
          };
          
          const updatedItems = [...state.items, newItem];
          const newTotal = updatedItems.reduce(
            (sum, item) => sum + (item.producto.precio * item.cantidad),
            0
          );
          
          set({
            items: updatedItems,
            negocio: producto.negocio,
            total: newTotal,
          });
        }
        
        toast.success('Producto agregado al carrito');
      },

      removeItem: (productoId: string) => {
        const state = get();
        const updatedItems = state.items.filter(item => item.producto.id !== productoId);
        
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.producto.precio * item.cantidad),
          0
        );
        
        set({
          items: updatedItems,
          total: newTotal,
          negocio: updatedItems.length === 0 ? null : state.negocio,
        });
        
        toast.success('Producto eliminado del carrito');
      },

      updateQuantity: (productoId: string, cantidad: number) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }
        
        const state = get();
        const updatedItems = state.items.map(item =>
          item.producto.id === productoId
            ? { ...item, cantidad, subtotal: item.producto.precio * cantidad }
            : item
        );
        
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + (item.producto.precio * item.cantidad),
          0
        );
        
        set({ items: updatedItems, total: newTotal });
      },

      clearCart: () => {
        set({ items: [], negocio: null, total: 0 });
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },

      canAddProduct: (negocioId: string) => {
        const state = get();
        return !state.negocio || state.negocio.id === negocioId;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Store de ubicación
interface LocationState {
  currentLocation: { lat: number; lng: number } | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  setLocation: (lat: number, lng: number) => void;
  setAddress: (address: string) => void;
  getCurrentLocation: () => Promise<void>;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  currentLocation: null,
  address: null,
  isLoading: false,
  error: null,

  setLocation: (lat: number, lng: number) => {
    set({ currentLocation: { lat, lng }, error: null });
  },

  setAddress: (address: string) => {
    set({ address });
  },

  getCurrentLocation: async () => {
    if (!navigator.geolocation) {
      set({ error: 'Geolocalización no soportada' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      set({
        currentLocation: { lat: latitude, lng: longitude },
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      let errorMessage = 'Error obteniendo ubicación';
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Permiso de ubicación denegado';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Ubicación no disponible';
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'Tiempo de espera agotado';
      }
      
      set({ isLoading: false, error: errorMessage });
    }
  },

  clearLocation: () => {
    set({ currentLocation: null, address: null, error: null });
  },
}));

// Store de pedidos
interface OrdersState {
  orders: Pedido[];
  currentOrder: Pedido | null;
  isLoading: boolean;
  setOrders: (orders: Pedido[]) => void;
  addOrder: (order: Pedido) => void;
  updateOrder: (orderId: string, updates: Partial<Pedido>) => void;
  setCurrentOrder: (order: Pedido | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  setOrders: (orders: Pedido[]) => {
    set({ orders });
  },

  addOrder: (order: Pedido) => {
    const state = get();
    set({ orders: [order, ...state.orders] });
  },

  updateOrder: (orderId: string, updates: Partial<Pedido>) => {
    const state = get();
    const updatedOrders = state.orders.map(order =>
      order.id === orderId ? { ...order, ...updates } : order
    );
    
    set({ orders: updatedOrders });
    
    if (state.currentOrder?.id === orderId) {
      set({ currentOrder: { ...state.currentOrder, ...updates } });
    }
  },

  setCurrentOrder: (order: Pedido | null) => {
    set({ currentOrder: order });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

// Store de UI
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