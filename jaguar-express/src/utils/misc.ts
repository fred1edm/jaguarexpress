import { EstadoPedido, MetodoPago, TipoNegocio } from '@/types';

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

// Obtener color del estado del pedido
export function getOrderStatusColor(estado: EstadoPedido): string {
  const colors = {
    [EstadoPedido.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
    [EstadoPedido.CONFIRMADO]: 'bg-blue-100 text-blue-800',
    [EstadoPedido.EN_PREPARACION]: 'bg-orange-100 text-orange-800',
    [EstadoPedido.EN_CAMINO]: 'bg-purple-100 text-purple-800',
    [EstadoPedido.ENTREGADO]: 'bg-green-100 text-green-800',
    [EstadoPedido.CANCELADO]: 'bg-red-100 text-red-800',
  } as Record<EstadoPedido, string>;

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
  } as Record<EstadoPedido, string>;

  return texts[estado] || estado;
}

// Obtener texto del método de pago
export function getPaymentMethodText(metodo: MetodoPago): string {
  const texts = {
    [MetodoPago.EFECTIVO]: 'Efectivo',
    [MetodoPago.TARJETA]: 'Tarjeta',
    [MetodoPago.TRANSFERENCIA]: 'Transferencia',
  } as Record<MetodoPago, string>;

  return texts[metodo] || metodo;
}

// Obtener texto del tipo de negocio
export function getBusinessTypeText(tipo: TipoNegocio): string {
  const texts = {
    [TipoNegocio.RESTAURANTE]: 'Restaurante',
    [TipoNegocio.FARMACIA]: 'Farmacia',
    [TipoNegocio.SUPERMERCADO]: 'Supermercado',
    [TipoNegocio.TIENDA]: 'Tienda',
  } as Record<TipoNegocio, string>;

  return texts[tipo] || tipo;
}

// Obtener icono del tipo de negocio
export function getBusinessTypeIcon(tipo: TipoNegocio): string {
  const icons = {
    [TipoNegocio.RESTAURANTE]: '🍽️',
    [TipoNegocio.FARMACIA]: '💊',
    [TipoNegocio.SUPERMERCADO]: '🛒',
    [TipoNegocio.TIENDA]: '🏪',
  } as Record<TipoNegocio, string>;

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
  let inThrottle = false;

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
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Descargar archivo
export function downloadFile(
  data: string,
  filename: string,
  type: string = 'text/plain'
): void {
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
