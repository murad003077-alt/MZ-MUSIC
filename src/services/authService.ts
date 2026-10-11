import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AUTH_STORAGE_KEY = 'mzMusicAuth';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export const authService = {
  /**
   * Registrar un nuevo usuario
   * NOTA: Requiere backend implementado
   */
  async register(credentials: AuthCredentials & { name: string }): Promise<AuthResponse> {
    try {
      // TODO: Reemplazar con tu endpoint de backend
      // const response = await axios.post('/auth/register', credentials);
      // return response.data;

      // Por ahora, simular registro local (SOLO PARA PRUEBAS)
      const user = {
        id: `user-${Date.now()}`,
        email: credentials.email,
        name: credentials.name,
      };
      const token = `token-${Date.now()}`;

      await SecureStore.setItemAsync(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token }),
      );

      return { user, token };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  /**
   * Iniciar sesión
   * NOTA: Requiere backend implementado
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      // TODO: Reemplazar con tu endpoint de backend
      // const response = await axios.post('/auth/login', credentials);
      // return response.data;

      // Por ahora, simular login local (SOLO PARA PRUEBAS)
      const user = {
        id: `user-${Date.now()}`,
        email: credentials.email,
        name: credentials.email.split('@')[0],
      };
      const token = `token-${Date.now()}`;

      await SecureStore.setItemAsync(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token }),
      );

      return { user, token };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  },

  /**
   * Obtener token guardado
   */
  async getToken(): Promise<string | null> {
    try {
      const auth = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
      if (auth) {
        return JSON.parse(auth).token;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  },

  /**
   * Obtener usuario guardado
   */
  async getUser() {
    try {
      const auth = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
      if (auth) {
        return JSON.parse(auth).user;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  },

  /**
   * Verificar si está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },
};
