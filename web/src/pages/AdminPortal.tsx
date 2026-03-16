import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { ShieldCheck, LogOut, Users, Server, Activity, Loader2, ShieldAlert, Download, Upload, History, Moon, Sun } from 'lucide-react';
import { api } from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const AdminPortal = () => {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [stats, setStats] = useState({ devices: 0, groups: 0, online: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [sessionStats, setSessionStats] = useState<{ totalSessions: number; totalHours: number; avgMinutes: number } | null>(null);
  const [offlineCount, setOfflineCount] = useState(0);
  const [healthStatus, setHealthStatus] = useState<{ status: string; services: Record<string, string> } | null>(null);
  const [groupTree, setGroupTree] = useState<any[]>([]);

  const roles = (auth.user?.profile as any)?.realm_access?.roles || [];
  const isReadOnly = roles.includes('ADMIN_READONLY');

  useEffect(() => {
    if (auth.isAuthenticated) {
      api.get('/devices').then(res => {
        const devData = res.data.data || [];
        setStats(s => ({ ...s, devices: res.data.meta?.total || devData.length }));
        setDevices(devData);
        setOfflineCount(devData.filter((d: any) => d.status === 0).length);
      }).catch(console.error);
      api.get('/groups').then(res => setStats(s => ({ ...s, groups: res.data.data?.length || 0 }))).catch(console.error);
      api.get('/audit').then(res => setAuditLogs(res.data.data || [])).catch(console.error);
      api.get('/sessions').then(res => setSessions(res.data.data || [])).catch(console.error).finally(() => setLoading(false));
      api.get('/sessions/stats').then(res => setSessionStats(res.data)).catch(console.error);
      api.get('/health').then(res => setHealthStatus(res.data)).catch(console.error);
      api.get('/groups/tree').then(res => setGroupTree(res.data.data || [])).catch(console.error);
    }
  }, [auth.isAuthenticated, activeTab]);
  
  const handleExport = async () => {
    try {
      const res = await api.get('/devices/export');
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dispositivos-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Erro na exportação:', error);
      alert('Falha ao exportar dispositivos');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        await api.post('/devices/import', { csv });
        alert('Dispositivos importados com sucesso!');
        // Refresh stats
        const res = await api.get('/devices');
        setStats(s => ({ ...s, devices: res.data.meta?.total || 0 }));
      } catch (error) {
        console.error('Erro na importação:', error);
        alert('Falha ao importar dispositivos. Verifique o formato do CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleUpdateNote = async (sessionId: string, currentNote: string) => {
    const newNote = prompt('Editar Notas da Sessão:', currentNote);
    if (newNote === null) return;
    try {
      await api.patch(`/sessions/${sessionId}`, { notes: newNote });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, notes: newNote } : s));
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      alert('Falha ao atualizar nota');
    }
  };

  if (!auth.isAuthenticated) return <div className="loading-screen"><Loader2 className="spinner"/></div>;

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Gerenciamento de Frota</h1>
              <p>Visão global dos dispositivos, grupos e acessos da plataforma.</p>
            </div>
            <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', cursor: 'pointer' }}>
                <Download size={16}/> Exportar CSV
              </button>
              {!isReadOnly && (
                <label className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #10b981', background: '#064e3b', color: '#fff', cursor: 'pointer' }}>
                  <Upload size={16}/> Importar CSV
                  <input type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
                </label>
              )}
            </div>
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
              {sessionStats && (
                <>
                  <div className="device-card">
                    <h3>Total de Horas Suporte</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: '#6366f1' }}>{sessionStats.totalHours}h</p>
                  </div>
                  <div className="device-card">
                    <h3>Sessões Concluídas</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: '#ec4899' }}>{sessionStats.totalSessions}</p>
                  </div>
                  <div className="device-card">
                    <h3>Duração Média</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: '#0ea5e9' }}>{sessionStats.avgMinutes}min</p>
                  </div>
                </>
              )}
              {healthStatus?.services && (
                <div className="device-card" style={{ borderLeft: `4px solid ${healthStatus.status === 'ok' ? '#10b981' : '#ef4444'}` }}>
                  <h3>{healthStatus.status === 'ok' ? '✅' : '⚠️'} Saúde do Sistema</h3>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {Object.entries(healthStatus.services).map(([svc, st]) => (
                      <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ textTransform: 'capitalize' }}>{svc}</span>
                        <span style={{ color: st === 'ok' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{st === 'ok' ? '● OK' : '● Error'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {offlineCount > 0 && (
                <div className="device-card" style={{ borderLeft: '4px solid #ef4444' }}>
                  <h3>⚠️ Dispositivos Offline</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', color: '#ef4444' }}>{offlineCount}</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Verifique os dispositivos inativos</p>
                </div>
              )}
            </div>
          )}
        </>
      );
    }

    if (activeTab === 'maquinas') {
      return (
        <div className="machines-section">
          <header>
            <h1>Máquinas</h1>
            <p>Gerencie seus dispositivos e conexões.</p>
          </header>
          <div className="devices-grid">
             {devices.length > 0 ? devices.map(device => (
               <div key={device.id} className="device-card">
                 <h3>{device.alias}</h3>
                 <p>ID: {device.id}</p>
                 <span className={`status-badge ${device.status === 1 ? 'online' : 'offline'}`}>
                   {device.status === 1 ? 'Online' : 'Offline'}
                 </span>
               </div>
             )) : <p className="no-data">Nenhum dispositivo encontrado.</p>}
          </div>
        </div>
      );
    }

    if (activeTab === 'grupos') {
      const renderGroupNode = (group: any, depth = 0): React.ReactNode => (
        <div key={group.id} style={{ marginLeft: `${depth * 1.5}rem`, marginBottom: '0.5rem' }}>
          <div className="device-card" style={{ borderLeft: depth > 0 ? '3px solid #6366f1' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{depth > 0 ? '↳ ' : ''}{group.name}</h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{group.device_count || 0} dispositivos</span>
            </div>
            {group.description && <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{group.description}</p>}
          </div>
          {group.children?.map((child: any) => renderGroupNode(child, depth + 1))}
        </div>
      );

      return (
        <div className="groups-section">
          <header>
            <h1>Grupos de Dispositivos</h1>
            <p>Hierarquia e organização das suas máquinas.</p>
          </header>
          <div style={{ marginTop: '1rem' }}>
            {groupTree.length > 0
              ? groupTree.map(g => renderGroupNode(g))
              : <p className="no-data">Nenhum grupo encontrado.</p>
            }
          </div>
        </div>
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

    if (activeTab === 'sessões') {
      return (
        <div className="sessions-section">
          <header>
            <h1>Histórico de Sessões</h1>
            <p>Registro de todos os acessos remotos realizados.</p>
          </header>
          
          <div className="audit-table-container shadow-md bg-white rounded-lg overflow-hidden border border-slate-700">
            <table className="audit-table w-full text-left">
              <thead>
                <tr className="bg-slate-800 text-slate-300">
                  <th className="p-4">Dispositivo</th>
                  <th className="p-4">Técnico ID</th>
                  <th className="p-4">Início</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Notas</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {sessions.length > 0 ? sessions.map((sess) => (
                  <tr key={sess.id} className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="p-4 font-medium text-slate-200">{sess.device?.alias || 'Desconhecido'}</td>
                    <td className="p-4">{sess.technician_id}</td>
                    <td className="p-4">{new Date(sess.started_at).toLocaleString('pt-BR')}</td>
                    <td className="p-4">{sess.duration ? `${Math.floor(sess.duration / 60)}m ${sess.duration % 60}s` : '-'}</td>
                    <td className="p-4"><span className="badge">{sess.session_type}</span></td>
                    <td className="p-4">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{sess.notes || '—'}</span>
                        {!isReadOnly && (
                          <button className="text-xs text-emerald-500 underline" onClick={() => handleUpdateNote(sess.id, sess.notes || '')}>Editar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Nenhuma sessão registrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
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
              <li 
                className={activeTab === 'sessões' ? 'active' : ''} 
                onClick={() => setActiveTab('sessões')}
              >
                <History size={18}/> Sessões
              </li>
            </ul>
        </nav>
        <div className="sidebar-footer">
           <div className="user-profile">
             <span>Administrador</span>
           </div>
           
           <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button className="btn-toggle-theme" onClick={toggleTheme} title="Alternar Tema" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}>
               {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
             </button>
             <button className="btn-logout" onClick={() => void auth.removeUser()}>
               <LogOut size={16}/> Sair
             </button>
           </div>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPortal;
