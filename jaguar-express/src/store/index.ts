import { useAuthStore } from './auth';
import { useCartStore } from './cart';
import { useLocationStore } from './location';
import { useOrdersStore } from './orders';
import { useUIStore } from './ui';

export const stores = {
  auth: useAuthStore,
  cart: useCartStore,
  location: useLocationStore,
  orders: useOrdersStore,
  ui: useUIStore,
};

export { useAuthStore, useCartStore, useLocationStore, useOrdersStore, useUIStore };
export default stores;

