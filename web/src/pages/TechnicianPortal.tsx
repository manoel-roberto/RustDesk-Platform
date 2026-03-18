import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { api } from '../api/axios';
import { MonitorPlay, Settings, LogOut, Loader2, ShieldCheck, Sun, Moon, Download, Copy, ExternalLink, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../index.css';

const TechnicianPortal = () => {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('maquinas');
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [branding, setBranding] = useState<{ companyName: string; primaryColor: string } | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoading(true);
      Promise.all([
        api.get('/users/peers').then(res => setDevices(res.data.data)),
        api.get('/downloads/client/info').then(res => setClientInfo(res.data)),
        api.get('/downloads/branding').then(res => setBranding(res.data))
      ])
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

  const connectToDevice = async (id: string) => {
    try {
      const res = await api.post(`/devices/${id}/connect`);
      const link = res.data.deep_link || res.data.url;
      if (link) {
        window.location.href = link;
      } else {
        window.location.href = `rustdesk://${id}`;
      }
    } catch (error) {
       console.error('Erro ao gerar link de conexão:', error);
       window.location.href = `rustdesk://${id}`; // Fallback
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    alert('ID copiado!');
  };

  const renderContent = () => {
    if (activeTab === 'maquinas') {
      return (
        <>
          <header>
            <h1>Catálogo de Dispositivos (Address Book)</h1>
            <p>Um clique para abrir o cliente customizado do RustDesk.</p>
          </header>

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Info color="#3b82f6" size={24}/>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>Importante:</strong> Para o botão "Acessar" funcionar, você precisa ter o <strong>RustDesk instalado</strong>. 
              Se não tiver, baixe na aba "Downloads" ou use o ícone de cópia ao lado para obter o ID.
            </p>
          </div>

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
                  <div className="device-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                     <button 
                       className="btn-connect" 
                       style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                       disabled={device.status === 0}
                       onClick={() => connectToDevice(device.id)}
                     >
                       <ExternalLink size={16}/> Acessar
                     </button>
                     <button 
                       className="btn-secondary"
                       style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: '#334155', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                       onClick={() => handleCopyId(device.id)}
                       title="Copiar ID"
                     >
                       <Copy size={16}/>
                     </button>
                  </div>
                </div>
              ))}
              {devices.length === 0 && <p className="no-data">Nenhum dispositivo encontrado na sua conta.</p>}
            </div>
          )}
        </>
      );
    }

    if (activeTab === 'downloads') {
      return (
        <div className="downloads-section">
          <header>
            <h1>Central de Downloads</h1>
            <p>Baixe o cliente RustDesk customizado e pré-configurado para o seu ambiente.</p>
          </header>

          {loading ? (
             <div className="loading-area"><Loader2 className="spinner"/> Carregando metadados...</div>
          ) : clientInfo && (
            <div className="download-card accent">
              <div className="card-icon">
                <MonitorPlay size={48} className="icon-blue" />
              </div>
              <div className="card-content">
                <h3>{clientInfo.name}</h3>
                <p className="version">Versão: {clientInfo.version} | {clientInfo.platform}</p>
                <div className="details">
                  <span><strong>Tamanho:</strong> {clientInfo.size}</span>
                  <span><strong>Atualizado em:</strong> {new Date(clientInfo.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="actions">
                  <a href={clientInfo.downloadUrl} className="btn-primary flex items-center gap-2">
                    <Download size={18}/> Baixar Agora (.exe)
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="info-box mt-8">
            <h4>Instruções de Instalação</h4>
            <ol>
              <li>Baixe o executável acima.</li>
              <li>A chave pública e o endereço do servidor já estão embutidos.</li>
              <li>Execute como administrador para garantir funcionalidades completas de controle remoto.</li>
            </ol>
          </div>
        </div>
      );
    }

    return (
      <div className="placeholder-content">
        <h1>Configurações</h1>
        <p>Ajustes de perfil e preferências do técnico em desenvolvimento.</p>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
           <MonitorPlay size={32} color={branding?.primaryColor || "#fff"}/>
           <h2>{branding?.companyName || "Suporte"}</h2>
        </div>
        <nav>
           <ul>
             <li 
               className={activeTab === 'maquinas' ? 'active' : ''} 
               onClick={() => setActiveTab('maquinas')}
             >
               <MonitorPlay size={18}/> Minhas Máquinas
             </li>
             <li 
               className={activeTab === 'downloads' ? 'active' : ''} 
               onClick={() => setActiveTab('downloads')}
             >
               <Download size={18}/> Downloads
             </li>
             <li 
               className={activeTab === 'configuracoes' ? 'active' : ''} 
               onClick={() => setActiveTab('configuracoes')}
             >
               <Settings size={18}/> Configurações
             </li>
           </ul>
        </nav>
        <div className="sidebar-footer">
           <div className="user-profile">
             <span>{auth.user?.profile.preferred_username || 'Técnico'}</span>
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

export default TechnicianPortal;
