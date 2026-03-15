import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { ShieldCheck, LogOut, Users, Server, Activity, Loader2, ShieldAlert } from 'lucide-react';
import { api } from '../api/axios';

const AdminPortal = () => {
  const auth = useAuth();
  const [stats, setStats] = useState({ devices: 0, groups: 0, online: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      api.get('/devices').then(res => setStats(s => ({ ...s, devices: res.data.meta?.total || 0 }))).catch(console.error);
      api.get('/groups').then(res => setStats(s => ({ ...s, groups: res.data.data?.length || 0 }))).catch(console.error);
      api.get('/audit').then(res => setAuditLogs(res.data.data || [])).catch(console.error).finally(() => setLoading(false));
    }
  }, [auth.isAuthenticated, activeTab]);

  if (!auth.isAuthenticated) return <div className="loading-screen"><Loader2 className="spinner"/></div>;

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <>
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
        </>
      );
    }

    if (activeTab === 'auditoria') {
      return (
        <div className="audit-section">
          <header>
            <h1>Logs de Auditoria</h1>
            <p>Rastro de ações administrativas realizadas na plataforma.</p>
          </header>
          
          <div className="audit-table-container shadow-md bg-white rounded-lg overflow-hidden border border-slate-700">
            <table className="audit-table w-full text-left">
              <thead>
                <tr className="bg-slate-800 text-slate-300">
                  <th className="p-4">Data/Hora</th>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Ação</th>
                  <th className="p-4">Recurso</th>
                  <th className="p-4">IP</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {auditLogs.length > 0 ? auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="p-4">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                    <td className="p-4">{log.username}</td>
                    <td className="p-4"><span className={`badge ${log.action.toLowerCase()}`}>{log.action}</span></td>
                    <td className="p-4">{log.resource}</td>
                    <td className="p-4">{log.ipAddress}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Nenhum log registrado ainda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="placeholder-content">
        <h1>Seção: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        <p>Esta funcionalidade está em desenvolvimento para a próxima sprint.</p>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
           <ShieldCheck size={32} color="#10b981"/>
           <h2>Centro Administrativo</h2>
        </div>
        <nav>
           <ul>
             <li 
               className={activeTab === 'dashboard' ? 'active' : ''} 
               onClick={() => setActiveTab('dashboard')}
             >
               <Activity size={18}/> Visão Geral
             </li>
             <li 
               className={activeTab === 'maquinas' ? 'active' : ''} 
               onClick={() => setActiveTab('maquinas')}
             >
               <Server size={18}/> Máquinas
             </li>
             <li 
               className={activeTab === 'grupos' ? 'active' : ''} 
               onClick={() => setActiveTab('grupos')}
             >
               <Users size={18}/> Grupos
             </li>
             <li 
               className={activeTab === 'auditoria' ? 'active' : ''} 
               onClick={() => setActiveTab('auditoria')}
             >
               <ShieldAlert size={18}/> Auditoria
             </li>
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
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPortal;
