import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import {
  ApiResponse,
  PaginatedResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  Negocio,
  Producto,
  Pedido,
  Repartidor,
  Configuracion,
} from '@/types';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      toast.error('Error del servidor. Intenta nuevamente.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Error de conexión. Verifica tu internet.');
    }
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },
};

// Funciones para negocios
export const negociosApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tipo?: string;
    activo?: boolean;
  }): Promise<PaginatedResponse<Negocio>> => {
    const response = await api.get<PaginatedResponse<Negocio>>('/negocios', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Negocio> => {
    const response = await api.get<ApiResponse<Negocio>>(`/negocios/${id}`);
    return response.data.data;
  },

  getNearby: async (lat: number, lng: number, radius: number = 5): Promise<Negocio[]> => {
    const response = await api.get<ApiResponse<Negocio[]>>('/negocios/nearby', {
      params: { lat, lng, radius },
    });
    return response.data.data;
  },

  getPopular: async (): Promise<Negocio[]> => {
    const response = await api.get<ApiResponse<Negocio[]>>('/negocios/popular');
    return response.data.data;
  },
};

// Funciones para productos
export const productosApi = {
  getByNegocio: async (negocioId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
    disponible?: boolean;
  }): Promise<PaginatedResponse<Producto>> => {
    const response = await api.get<PaginatedResponse<Producto>>(
      `/negocios/${negocioId}/productos`,
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<Producto> => {
    const response = await api.get<ApiResponse<Producto>>(`/productos/${id}`);
    return response.data.data;
  },

  search: async (query: string, filters?: {
    tipo?: string;
    precioMin?: number;
    precioMax?: number;
  }): Promise<Producto[]> => {
    const response = await api.get<ApiResponse<Producto[]>>('/productos/search', {
      params: { q: query, ...filters },
    });
    return response.data.data;
  },
};

// Funciones para pedidos
export const pedidosApi = {
  create: async (pedidoData: {
    negocioId: string;
    productos: Array<{ productoId: string; cantidad: number; observaciones?: string }>;
    direccionEntrega: string;
    metodoPago: string;
    observaciones?: string;
  }): Promise<Pedido> => {
    const response = await api.post<ApiResponse<Pedido>>('/pedidos', pedidoData);
    return response.data.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    estado?: string;
  }): Promise<PaginatedResponse<Pedido>> => {
    const response = await api.get<PaginatedResponse<Pedido>>('/pedidos', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Pedido> => {
    const response = await api.get<ApiResponse<Pedido>>(`/pedidos/${id}`);
    return response.data.data;
  },

  cancel: async (id: string, motivo?: string): Promise<Pedido> => {
    const response = await api.put<ApiResponse<Pedido>>(`/pedidos/${id}/cancel`, { motivo });
    return response.data.data;
  },

  rate: async (id: string, calificacion: number, comentario?: string): Promise<void> => {
    await api.post(`/pedidos/${id}/rate`, { calificacion, comentario });
  },

  trackOrder: async (id: string): Promise<{
    estado: string;
    ubicacion?: { lat: number; lng: number };
    tiempoEstimado?: number;
    repartidor?: Repartidor;
  }> => {
    const response = await api.get(`/pedidos/${id}/track`);
    return response.data.data;
  },
};

// Funciones para configuración
export const configuracionApi = {
  get: async (): Promise<Configuracion> => {
    const response = await api.get<ApiResponse<Configuracion>>('/configuracion');
    return response.data.data;
  },
};

// Funciones para ubicación
export const ubicacionApi = {
  geocode: async (address: string): Promise<{ lat: number; lng: number; formatted_address: string }> => {
    const response = await api.get('/ubicacion/geocode', {
      params: { address },
    });
    return response.data.data;
  },

  reverseGeocode: async (lat: number, lng: number): Promise<string> => {
    const response = await api.get('/ubicacion/reverse-geocode', {
      params: { lat, lng },
    });
    return response.data.data.formatted_address;
  },
};

// Funciones para notificaciones
export const notificacionesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    leida?: boolean;
  }): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/notificaciones', { params });
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notificaciones/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notificaciones/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notificaciones/${id}`);
  },
};

export default api;