import { create } from 'zustand';

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

