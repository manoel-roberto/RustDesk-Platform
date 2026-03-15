import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Loader2, ShieldCheck } from 'lucide-react';
import TechnicianPortal from './pages/TechnicianPortal';
import AdminPortal from './pages/AdminPortal';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  if (auth.isLoading) {
     return <div className="loading-screen"><Loader2 className="spinner" size={48}/> Validando sessão...</div>;
  }

  if (auth.error) {
     return <div className="error-screen">Erro de Login OIDC: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
     return (
        <div className="login-container">
          <div className="login-card">
            <ShieldCheck size={64} className="login-icon" />
            <h1>Portal RustDesk</h1>
            <p>Plataforma Privada de Suporte</p>
            <button className="btn-primary" onClick={() => void auth.signinRedirect()}>
              Logar com Keycloak
            </button>
          </div>
        </div>
     );
  }

  // Se tiver um requiredRole, nós validaríamos aqui:
  // const roles = auth.user?.profile.realm_access?.roles || [];
  // if (requiredRole && !roles.includes(requiredRole)) return <Navigate to="/technician" />;

  return <>{children}</>;
};

const RoleRedirect = () => {
   const auth = useAuth();
   if (!auth.isAuthenticated) return <Navigate to="/technician" />;
   
   // Simulação de check de role para MVPs:
   const isAdmin = auth.user?.profile?.preferred_username === 'admin';
   return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/technician" />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      
      <Route path="/technician" element={
        <PrivateRoute>
          <TechnicianPortal />
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute>
          <AdminPortal />
        </PrivateRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
