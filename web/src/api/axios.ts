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
            console.log('AXIOS_DEBUG: Enviando token:', user.access_token.substring(0, 20) + '...');
            config.headers.Authorization = `Bearer ${user.access_token}`;
          } else {
            console.warn('AXIOS_DEBUG: Nenhum access_token encontrado no storage');
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
