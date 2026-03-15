import axios from 'axios';
import { User } from 'oidc-client-ts';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// Interceptor para sempre carregar o token salvo no redirect do Keycloak
api.interceptors.request.use(
  (config) => {
    const storageKeys = Object.keys(localStorage);
    const oidcKey = storageKeys.find((key) => key.startsWith('oidc.user'));
    
    if (oidcKey) {
      try {
        const oidcDataStr = localStorage.getItem(oidcKey);
        if (oidcDataStr) {
          const user = User.fromStorageString(oidcDataStr);
          if (user?.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
          }
        }
      } catch (err) {
         console.warn("Could not load token", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
