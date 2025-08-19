import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EstadoPedido, MetodoPago, TipoNegocio } from '@/types';

// Utility para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formateo de moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Formateo de números
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CO').format(num);
}

// Formateo de fechas
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('es-CO', { ...defaultOptions, ...options }).format(dateObj);
}

// Formateo de tiempo relativo
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Hace un momento';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }
  
  return formatDate(dateObj);
}

// Formateo de tiempo de entrega
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

// Validación de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validación de teléfono colombiano
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+57)?\s?[3][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Formateo de teléfono
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('57')) {
    const number = cleaned.substring(2);
    return `+57 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  return phone;
}

// Sanitización de texto
export function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Capitalizar primera letra
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Capitalizar cada palabra
export function capitalizeWords(text: string): string {
  return text.split(' ').map(word => capitalize(word)).join(' ');
}

// Generar slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim();
}

// Calcular distancia entre dos puntos (Haversine)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Verificar si un negocio está abierto
export function isBusinessOpen(
  horarioApertura: string,
  horarioCierre: string,
  currentTime?: Date
): boolean {
  const now = currentTime || new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const [openHour, openMinute] = horarioApertura.split(':').map(Number);
  const [closeHour, closeMinute] = horarioCierre.split(':').map(Number);
  
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  // Manejar horarios que cruzan medianoche
  if (closeTimeInMinutes < openTimeInMinutes) {
    return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
  }
  
  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
}

// Obtener color del estado del pedido
export function getOrderStatusColor(estado: EstadoPedido): string {
  const colors = {
    [EstadoPedido.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
    [EstadoPedido.CONFIRMADO]: 'bg-blue-100 text-blue-800',
    [EstadoPedido.EN_PREPARACION]: 'bg-orange-100 text-orange-800',
    [EstadoPedido.EN_CAMINO]: 'bg-purple-100 text-purple-800',
    [EstadoPedido.ENTREGADO]: 'bg-green-100 text-green-800',
    [EstadoPedido.CANCELADO]: 'bg-red-100 text-red-800',
  };
  
  return colors[estado] || 'bg-gray-100 text-gray-800';
}

// Obtener texto del estado del pedido
export function getOrderStatusText(estado: EstadoPedido): string {
  const texts = {
    [EstadoPedido.PENDIENTE]: 'Pendiente',
    [EstadoPedido.CONFIRMADO]: 'Confirmado',
    [EstadoPedido.EN_PREPARACION]: 'En preparación',
    [EstadoPedido.EN_CAMINO]: 'En camino',
    [EstadoPedido.ENTREGADO]: 'Entregado',
    [EstadoPedido.CANCELADO]: 'Cancelado',
  };
  
  return texts[estado] || estado;
}

// Obtener texto del método de pago
export function getPaymentMethodText(metodo: MetodoPago): string {
  const texts = {
    [MetodoPago.EFECTIVO]: 'Efectivo',
    [MetodoPago.TARJETA]: 'Tarjeta',
    [MetodoPago.TRANSFERENCIA]: 'Transferencia',
  };
  
  return texts[metodo] || metodo;
}

// Obtener texto del tipo de negocio
export function getBusinessTypeText(tipo: TipoNegocio): string {
  const texts = {
    [TipoNegocio.RESTAURANTE]: 'Restaurante',
    [TipoNegocio.FARMACIA]: 'Farmacia',
    [TipoNegocio.SUPERMERCADO]: 'Supermercado',
    [TipoNegocio.TIENDA]: 'Tienda',
  };
  
  return texts[tipo] || tipo;
}

// Obtener icono del tipo de negocio
export function getBusinessTypeIcon(tipo: TipoNegocio): string {
  const icons = {
    [TipoNegocio.RESTAURANTE]: '🍽️',
    [TipoNegocio.FARMACIA]: '💊',
    [TipoNegocio.SUPERMERCADO]: '🛒',
    [TipoNegocio.TIENDA]: '🏪',
  };
  
  return icons[tipo] || '🏪';
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Generar ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Copiar al portapapeles
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Descargar archivo
export function downloadFile(data: string, filename: string, type: string = 'text/plain'): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Obtener parámetros de URL
export function getUrlParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

// Actualizar parámetros de URL
export function updateUrlParams(params: Record<string, string | null>): void {
  const url = new URL(window.location.href);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  
  window.history.replaceState({}, '', url.toString());
}

// Verificar si es dispositivo móvil
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Verificar si es iOS
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Verificar si es Android
export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

// Obtener información del dispositivo
export function getDeviceInfo() {
  return {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
  };
}

// Formatear bytes
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Validar contraseña
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe tener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe tener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe tener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generar contraseña aleatoria
export function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + symbols;

  if (length < 4) length = 4;

  const passwordChars: string[] = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  for (let i = passwordChars.length; i < length; i++) {
    const chars = allChars;
    passwordChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }

  return passwordChars.sort(() => Math.random() - 0.5).join('');
}
