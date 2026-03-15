import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { api } from '../api/axios';
import { MonitorPlay, Settings, LogOut, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
import '../index.css';

const TechnicianPortal = () => {
  const auth = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated) {
      api.get('/users/peers')
        .then(res => setDevices(res.data.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [auth.isAuthenticated]);

  if (auth.isLoading) {
    return <div className="loading-screen"><Loader2 className="spinner" size={48}/> Carregando sistema...</div>;
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

  const connectToDevice = (id: string) => {
    window.location.href = `rustdesk://${id}`;
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
           <MonitorPlay size={32} color="#fff"/>
           <h2>Suporte</h2>
        </div>
        <nav>
           <ul>
             <li className="active"><MonitorPlay size={18}/> Minhas Máquinas</li>
             <li><Settings size={18}/> Configurações</li>
           </ul>
        </nav>
        <div className="sidebar-footer">
           <div className="user-profile">
             <UserIcon size={24}/>
             <span>{auth.user?.profile.preferred_username || 'Técnico'}</span>
           </div>
           <button className="btn-logout" onClick={() => void auth.removeUser()}>
             <LogOut size={16}/> Sair
           </button>
        </div>
      </aside>

      <main className="main-content">
        <header>
          <h1>Catálogo de Dispositivos (Address Book)</h1>
          <p>Um clique para abrir o cliente customizado do RustDesk.</p>
        </header>

        {loading ? (
           <div className="loading-area"><Loader2 className="spinner"/> Carregando máquinas...</div>
        ) : (
          <div className="devices-grid">
            {devices.map(device => (
              <div key={device.id} className="device-card">
                <div className="device-header">
                  <h3>{device.alias}</h3>
                  <span className={`status-badge ${device.status === 1 ? 'online' : 'offline'}`}>
                    {device.status === 1 ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="device-body">
                  <p><strong>ID:</strong> {device.id}</p>
                  <p><strong>Host:</strong> {device.hostname}</p>
                  <p><strong>OS:</strong> {device.platform}</p>
                  <div className="tags">
                    {device.tags.map((t: string) => <span key={t} className="badge">{t}</span>)}
                  </div>
                </div>
                <div className="device-actions">
                   <button 
                     className="btn-connect" 
                     disabled={device.status === 0}
                     onClick={() => connectToDevice(device.id)}
                   >
                     Conectar (DeepLink)
                   </button>
                </div>
              </div>
            ))}
            {devices.length === 0 && <p className="no-data">Nenhum dispositivo encontrado na sua conta.</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default TechnicianPortal;
