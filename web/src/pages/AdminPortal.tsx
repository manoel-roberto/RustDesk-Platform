import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { ShieldCheck, LogOut, Users, Server, Activity, Loader2 } from 'lucide-react';
import { api } from '../api/axios';

const AdminPortal = () => {
  const auth = useAuth();
  const [stats, setStats] = useState({ devices: 0, groups: 0, online: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated) {
      // Fake calls to populated endpoints, replacing with actual calls in future
      api.get('/devices')
        .then(res => setStats(s => ({ ...s, devices: res.data.meta?.total || 0 })))
        .catch(console.error);

      api.get('/groups')
        .then(res => setStats(s => ({ ...s, groups: res.data.data?.length || 0 })))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [auth.isAuthenticated]);

  if (!auth.isAuthenticated) return <div className="loading-screen"><Loader2 className="spinner"/></div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
           <ShieldCheck size={32} color="#10b981"/>
           <h2>Admin Center</h2>
        </div>
        <nav>
           <ul>
             <li className="active"><Activity size={18}/> Dashboard</li>
             <li><Server size={18}/> Máquinas</li>
             <li><Users size={18}/> Grupos</li>
           </ul>
        </nav>
        <div className="sidebar-footer">
           <div className="user-profile">
             <span>Administrador</span>
           </div>
           <button className="btn-logout" onClick={() => void auth.removeUser()}>
             <LogOut size={16}/> Sair
           </button>
        </div>
      </aside>

      <main className="main-content">
        <header>
          <h1>Gerenciamento de Frota</h1>
          <p>Visão global dos dispositivos, grupos e acessos da plataforma.</p>
        </header>

        {loading ? (
          <div className="loading-area"><Loader2 className="spinner"/> Carregando estatísticas...</div>
        ) : (
          <div className="devices-grid">
            <div className="device-card">
              <h3>Total de Dispositivos</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: 'var(--accent-color)' }}>{stats.devices}</p>
            </div>
            <div className="device-card">
              <h3>Grupos Cadastrados</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: 'var(--success)' }}>{stats.groups}</p>
            </div>
            <div className="device-card">
              <h3>Sessões Ativas</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: '#f59e0b' }}>0</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPortal;
