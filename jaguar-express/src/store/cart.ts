import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Negocio, Producto } from '@/types';
import { toast } from 'react-hot-toast';

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

