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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [branding, setBranding] = useState<{ companyName: string; primaryColor: string } | null>(null);
  const [newDevice, setNewDevice] = useState({ rustdesk_id: '', alias: '', hostname: '', os: '', tags: '', group_id: '' });
  const [newGroup, setNewGroup] = useState({ name: '', description: '', parent_id: '' });
  const [selectedDeviceForGroup, setSelectedDeviceForGroup] = useState<any | null>(null);
  const [auditSearch, setAuditSearch] = useState('');

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
      api.get('/downloads/branding').then(res => setBranding(res.data)).catch(console.error);
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

  const handleDownloadTemplate = () => {
    const header = 'rustdesk_id,alias,hostname,os,online,tags';
    const example = '123456789,Meu Cliente,CLIENTE-PC,Windows,true,"suporte,financeiro"';
    const csvContent = [header, example].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_rustdesk.csv';
    a.click();
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

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newDevice,
        tags: newDevice.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        group_id: newDevice.group_id === '' ? undefined : newDevice.group_id
      };
      await api.post('/devices', payload);
      alert('Dispositivo cadastrado com sucesso!');
      setIsModalOpen(false);
      setNewDevice({ rustdesk_id: '', alias: '', hostname: '', os: '', tags: '', group_id: '' });
      // Refresh list
      const res = await api.get('/devices');
      setDevices(res.data.data || []);
      setStats(s => ({ ...s, devices: res.data.meta?.total || 0 }));
    } catch (error: any) {
       console.error('Erro ao criar dispositivo:', error);
       const errMsg = error.response?.data?.message || error.message;
       alert(`Erro ao criar dispositivo: ${errMsg}`);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este dispositivo?')) return;
    try {
      await api.delete(`/devices/${id}`);
      setDevices(prev => prev.filter(d => d.id !== id));
      setStats(s => ({ ...s, devices: s.devices - 1 }));
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Falha ao excluir dispositivo');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo? Dispositivos vinculados ficarão sem grupo.')) return;
    try {
      await api.delete(`/groups/${id}`);
      const resTree = await api.get('/groups/tree');
      setGroupTree(resTree.data.data || []);
      const resList = await api.get('/groups');
      setStats(s => ({ ...s, groups: resList.data.data?.length || 0 }));
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      alert('Falha ao excluir grupo');
    }
  };

  const handleLinkToGroup = async (deviceId: string, groupId: string) => {
    try {
      await api.patch(`/devices/${deviceId}`, { group_id: groupId === '' ? null : groupId });
      const res = await api.get('/devices');
      setDevices(res.data.data || []);
      setSelectedDeviceForGroup(null);
    } catch (error) {
      console.error('Erro ao vincular grupo:', error);
      alert('Falha ao vincular dispositivo ao grupo');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const groupPayload = {
        name: newGroup.name,
        description: newGroup.description,
        parent_id: newGroup.parent_id === '' ? undefined : newGroup.parent_id
      };
      await api.post('/groups', groupPayload);
      alert('Grupo criado com sucesso!');
      setIsGroupModalOpen(false);
      setNewGroup({ name: '', description: '', parent_id: '' });
      // Refresh tree and flat list
      const resTree = await api.get('/groups/tree');
      setGroupTree(resTree.data.data || []);
      const resList = await api.get('/groups');
      setStats(s => ({ ...s, groups: resList.data.data?.length || 0 }));
    } catch (error: any) {
       console.error('Erro ao criar grupo:', error);
       const errMsg = error.response?.data?.message || error.message;
       alert(`Erro ao criar grupo: ${errMsg}`);
    }
  };

  const handleCloseSession = async (id: string) => {
    if (!confirm('Deseja encerrar esta sessão remotamente?')) return;
    try {
      await api.patch(`/sessions/${id}/close`);
      alert('Comando de encerramento enviado!');
      const res = await api.get('/sessions');
      setSessions(res.data.data || []);
    } catch (error) {
      console.error('Erro ao fechar sessão:', error);
      alert('Falha ao encerrar sessão');
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
              {!isReadOnly && (
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', background: 'var(--accent-color)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  <Server size={16}/> Novo Dispositivo
                </button>
              )}
              <button className="btn-secondary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', cursor: 'pointer' }}>
                <Download size={16}/> Exportar CSV
              </button>
              {!isReadOnly && (
                <label className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #10b981', background: '#064e3b', color: '#fff', cursor: 'pointer' }}>
                  <Upload size={16}/> Importar CSV
                  <input type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
                </label>
              )}
              <button className="btn-secondary" onClick={handleDownloadTemplate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #94a3b8', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                <Download size={16}/> Baixar Modelo CSV
              </button>
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
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                     <h3 style={{ margin: 0 }}>{device.alias || 'Sem Apelido'}</h3>
                     <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {device.id}</p>
                   </div>
                   <span className={`status-badge ${device.status === 1 ? 'online' : 'offline'}`}>
                     {device.status === 1 ? 'Online' : 'Offline'}
                   </span>
                 </div>
                 <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}><strong>Host:</strong> {device.hostname || '—'}</p>
                  <p style={{ fontSize: '0.85rem' }}><strong>OS:</strong> {device.platform || '—'}</p>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}><strong>Grupo:</strong> {device.group?.name || 'Sem Grupo'}</p>
                  {!isReadOnly && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedDeviceForGroup(device)} style={{ background: '#6366f1', border: 'none', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Mudar Grupo</button>
                      <button onClick={() => handleDeleteDevice(device.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Excluir</button>
                    </div>
                  )}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{group.device_count || 0} dispositivos</span>
                {!isReadOnly && (
                  <button onClick={() => handleDeleteGroup(group.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }} title="Excluir Grupo">Excluir</button>
                )}
              </div>
            </div>
            {group.description && <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{group.description}</p>}
          </div>
          {group.children?.map((child: any) => renderGroupNode(child, depth + 1))}
        </div>
      );

      return (
        <div className="groups-section">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Grupos de Dispositivos</h1>
              <p>Hierarquia e organização das suas máquinas.</p>
            </div>
            {!isReadOnly && (
              <button className="btn-primary" onClick={() => setIsGroupModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer' }}>
                <Users size={16}/> Novo Grupo
              </button>
            )}
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
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Logs de Auditoria</h1>
              <p>Rastro de ações administrativas realizadas na plataforma.</p>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por usuário ou recurso..." 
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              style={{ padding: '0.6rem', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', width: '300px' }}
            />
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
                {auditLogs.filter(log => 
                  log.username.toLowerCase().includes(auditSearch.toLowerCase()) || 
                  log.resource.toLowerCase().includes(auditSearch.toLowerCase())
                ).length > 0 ? auditLogs.filter(log => 
                  log.username.toLowerCase().includes(auditSearch.toLowerCase()) || 
                  log.resource.toLowerCase().includes(auditSearch.toLowerCase())
                ).map((log) => (
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
                  <th className="p-4">Técnico</th>
                  <th className="p-4">Início</th>
                  <th className="p-4">Duração</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Notas</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {sessions.length > 0 ? sessions.map((sess) => (
                  <tr key={sess.id} className="border-b border-slate-700 hover:bg-slate-800">
                    <td className="p-4 font-medium text-slate-200">{sess.device?.alias || 'Desconhecido'}</td>
                    <td className="p-4">{sess.technician_id}</td>
                    <td className="p-4">{new Date(sess.started_at).toLocaleString('pt-BR')}</td>
                    <td className="p-4">{sess.duration ? `${Math.floor(sess.duration / 60)}m ${sess.duration % 60}s` : <span style={{ color: '#10b981', fontWeight: 'bold' }}>Em curso</span>}</td>
                    <td className="p-4"><span className="badge">{sess.session_type}</span></td>
                    <td className="p-4">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sess.notes || '—'}</span>
                        {!isReadOnly && (
                          <button className="text-xs text-emerald-500 underline" onClick={() => handleUpdateNote(sess.id, sess.notes || '')}>Editar</button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {!sess.duration && !isReadOnly && (
                         <button onClick={() => handleCloseSession(sess.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Fechar</button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">Nenhuma sessão registrada.</td>
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
           <ShieldCheck size={32} color={branding?.primaryColor || "#10b981"}/>
           <h2>{branding?.companyName || "Centro Administrativo"}</h2>
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

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '400px', border: '1px solid #334155' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Cadastrar Novo Dispositivo</h2>
            <form onSubmit={handleCreateDevice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>ID do Dispositivo *</label>
                <input required style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newDevice.rustdesk_id} onChange={e => setNewDevice({...newDevice, rustdesk_id: e.target.value})} placeholder="Ex: 123456789" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Apelido (Alias)</label>
                <input style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newDevice.alias} onChange={e => setNewDevice({...newDevice, alias: e.target.value})} placeholder="Ex: PC Financeiro" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Hostname</label>
                  <input style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newDevice.hostname} onChange={e => setNewDevice({...newDevice, hostname: e.target.value})} placeholder="DESKTOP-XYZ" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Plataforma</label>
                  <input style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newDevice.os} onChange={e => setNewDevice({...newDevice, os: e.target.value})} placeholder="windows" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Tags (separadas por vírgula)</label>
                <input style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newDevice.tags} onChange={e => setNewDevice({...newDevice, tags: e.target.value})} placeholder="finanças, suporte" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Grupo</label>
                <select style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newDevice.group_id} onChange={e => setNewDevice({...newDevice, group_id: e.target.value})}>
                  <option value="">Nenhum</option>
                  {/* Flattened tree for select */}
                  {stats.groups > 0 && (function flatten(items: any[]): any[] {
                    return items.reduce((acc, curr) => [...acc, curr, ...flatten(curr.children || [])], []);
                  })(groupTree).map((g: any) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid #334155', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '0.7rem', background: 'var(--accent-color)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isGroupModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '400px', border: '1px solid #334155' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Criar Novo Grupo</h2>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Nome do Grupo *</label>
                <input required style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newGroup.name} onChange={e => setNewGroup({...newGroup, name: e.target.value})} placeholder="Ex: Escritório São Paulo" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Descrição</label>
                <textarea style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', minHeight: '80px' }} value={newGroup.description} onChange={e => setNewGroup({...newGroup, description: e.target.value})} placeholder="Opcional..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Grupo Pai (Superior)</label>
                <select style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} value={newGroup.parent_id} onChange={e => setNewGroup({...newGroup, parent_id: e.target.value})}>
                  <option value="">Nenhum (Raiz)</option>
                  {/* Simplificando para mostrar todos os grupos no select */}
                  {groupTree.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsGroupModalOpen(false)} style={{ flex: 1, padding: '0.7rem', background: 'transparent', border: '1px solid #334155', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ flex: 1, padding: '0.7rem', background: '#6366f1', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Criar Grupo</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedDeviceForGroup && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '400px', border: '1px solid #334155' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Vincular ao Grupo</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>Mudar o grupo de: <strong>{selectedDeviceForGroup.alias || selectedDeviceForGroup.rustdesk_id}</strong></p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Selecionar Grupo</label>
              <select 
                style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }} 
                value={selectedDeviceForGroup.group?.id || ''}
                onChange={e => handleLinkToGroup(selectedDeviceForGroup.id, e.target.value)}
              >
                <option value="">Sem Grupo</option>
                {/* Flattened tree for select */}
                {(function flatten(items: any[]): any[] {
                  return items.reduce((acc, curr) => [...acc, curr, ...flatten(curr.children || [])], []);
                })(groupTree).map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setSelectedDeviceForGroup(null)} style={{ width: '100%', padding: '0.7rem', background: 'transparent', border: '1px solid #334155', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
