import { create } from 'zustand';
import { Pedido } from '@/types';

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

