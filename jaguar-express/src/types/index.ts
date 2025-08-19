// Tipos de usuario
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  type: 'cliente' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  direccion?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

// Tipos de negocio
export interface Negocio {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email?: string;
  tipo: TipoNegocio;
  horarioApertura: string;
  horarioCierre: string;
  imagen?: string;
  activo: boolean;
  calificacion?: number;
  tiempoEntrega?: number;
  costoDelivery?: number;
  montoMinimo?: number;
  createdAt: string;
  updatedAt: string;
  productos?: Producto[];
}

export enum TipoNegocio {
  RESTAURANTE = 'RESTAURANTE',
  FARMACIA = 'FARMACIA',
  SUPERMERCADO = 'SUPERMERCADO',
  TIENDA = 'TIENDA'
}

// Tipos de producto
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: string;
  disponible: boolean;
  negocioId: string;
  negocio?: Negocio;
  createdAt: string;
  updatedAt: string;
}

// Tipos de carrito
export interface CartItem {
  producto: Producto;
  cantidad: number;
  notas?: string;
}

export interface Cart {
  items: CartItem[];
  negocioId?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// Tipos de pedido
export interface Pedido {
  id: string;
  numero: string;
  clienteId: string;
  negocioId: string;
  repartidorId?: string;
  estado: EstadoPedido;
  direccionEntrega: string;
  telefono: string;
  notas?: string;
  subtotal: number;
  costoDelivery: number;
  total: number;
  metodoPago: MetodoPago;
  tiempoEstimado?: number;
  createdAt: string;
  updatedAt: string;
  cliente?: User;
  negocio?: Negocio;
  repartidor?: Repartidor;
  productos?: PedidoProducto[];
}

export interface PedidoProducto {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precio: number;
  notas?: string;
  producto?: Producto;
}

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  EN_PREPARACION = 'EN_PREPARACION',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

// Tipos de repartidor
export interface Repartidor {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  estado: EstadoRepartidor;
  ubicacionActual?: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum EstadoRepartidor {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  INACTIVO = 'INACTIVO'
}

// Tipos de configuración
export interface Configuracion {
  id: string;
  clave: string;
  valor: string;
  descripcion?: string;
  tipo: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  updatedAt: string;
}

// Tipos de API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos de formularios
export interface CheckoutForm {
  direccionEntrega: string;
  telefono: string;
  metodoPago: MetodoPago;
  notas?: string;
}

export interface ContactForm {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

export interface ProfileForm {
  nombre: string;
  telefono: string;
  direccion?: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Tipos de filtros
export interface NegocioFilters {
  tipo?: TipoNegocio;
  search?: string;
  abierto?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductoFilters {
  categoria?: string;
  search?: string;
  disponible?: boolean;
  negocioId?: string;
  page?: number;
  limit?: number;
}

export interface PedidoFilters {
  estado?: EstadoPedido;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  limit?: number;
}

// Tipos de notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Tipos de ubicación
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// Tipos de estadísticas
export interface OrderStats {
  totalPedidos: number;
  pedidosCompletados: number;
  ventasTotal: number;
  promedioVenta: number;
  pedidosPorEstado: Record<EstadoPedido, number>;
  ventasDiarias?: Array<{
    fecha: string;
    ventas: number;
    pedidos: number;
  }>;
}

// Tipos de componentes
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Tipos de hooks
export interface UseApiOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  staleTime?: number;
}

export interface UseFormOptions<T> {
  defaultValues?: Partial<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

// Tipos de estado global
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cart: Cart;
  notifications: Notification[];
  theme: 'light' | 'dark';
  loading: boolean;
}

// Tipos de errores
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface FormError {
  field: string;
  message: string;
}

// Tipos de eventos
export interface OrderEvent {
  type: 'status_change' | 'location_update' | 'message';
  orderId: string;
  data: any;
  timestamp: string;
}

// Tipos de configuración de la app
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  contactPhone: string;
  contactEmail: string;
  deliveryFee: number;
  minOrderAmount: number;
  maxDeliveryDistance: number;
  estimatedDeliveryTime: number;
  supportedPaymentMethods: MetodoPago[];
}

// Tipos de metadatos
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

// Tipos de componentes de UI
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

// Tipos de layout
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  className?: string;
}

// Tipos de navegación
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

// Tipos de búsqueda
export interface SearchResult {
  type: 'negocio' | 'producto';
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
}

export interface SearchFilters {
  query: string;
  type?: 'all' | 'negocios' | 'productos';
  categoria?: string;
  ubicacion?: Location;
  radio?: number;
}

// Tipos de geolocalización
export interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | null;
}

// Tipos de tiempo real
export interface RealtimeEvent {
  type: string;
  payload: any;
  timestamp: string;
}

export interface SocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

// Tipos de analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

// Tipos de SEO
export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}