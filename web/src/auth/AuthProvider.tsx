import React from 'react';
import { AuthProvider } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

const oidcConfig = {
  authority: 'http://localhost:8080/realms/master', // Realm configurado (usando master no dev local)
  client_id: 'rustdesk-portal',                     // Fictício/Simulado. Precisaria criar no keycloak real
  redirect_uri: window.location.origin,
  response_type: 'code',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: (_user: any | void) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
};
