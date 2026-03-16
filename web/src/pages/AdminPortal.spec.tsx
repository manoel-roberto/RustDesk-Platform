import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPortal from './AdminPortal';
import { useAuth } from 'react-oidc-context';
import { api } from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// Mocks
vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../context/BrandingContext', () => ({
  useBranding: vi.fn().mockReturnValue({
    companyName: 'Test Corp',
    logoUrl: null,
    primaryColor: '#10b981',
    supportEmail: 'test@test.com',
  }),
}));

describe('AdminPortal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/devices') return Promise.resolve({ data: { data: [], meta: { total: 0 } } });
      if (url === '/groups') return Promise.resolve({ data: { data: [] } });
      if (url === '/groups/tree') return Promise.resolve({ data: { data: [] } });
      if (url === '/audit') return Promise.resolve({ data: { data: [] } });
      if (url === '/sessions') return Promise.resolve({ data: { data: [] } });
      if (url === '/sessions/stats') return Promise.resolve({ data: { totalSessions: 10, totalHours: 5.5, avgMinutes: 33, totalSeconds: 19800 } });
      if (url === '/health') return Promise.resolve({ data: { status: 'ok', services: { database: 'ok', keycloak: 'ok', relay: 'ok' } } });
      if (url === '/devices/export') return Promise.resolve({ data: 'csv' });
      return Promise.reject(new Error('URL not mocked: ' + url));
    });
  });

  it('renders loading screen when not authenticated', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false });
    render(<AdminPortal />);
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  it('renders dashboard and fetches stats when authenticated', async () => {
    (useAuth as any).mockReturnValue({ 
      isAuthenticated: true,
      removeUser: vi.fn(),
    });

    (api.get as any).mockImplementation((url: string) => {
      if (url === '/devices') return Promise.resolve({ data: { meta: { total: 10 } } });
      if (url === '/groups') return Promise.resolve({ data: { data: [{}, {}] } });
      return Promise.resolve({ data: {} });
    });

    render(<AdminPortal />);

    expect(screen.getByText('Centro Administrativo')).toBeInTheDocument();
    expect(screen.getByText('Gerenciamento de Frota')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Device count
      expect(screen.getByText('2')).toBeInTheDocument();  // Group count
    });
  });

  it('handles missing data in api responses', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ data: {} }); // Missing meta and data fields

    render(<AdminPortal />);
    await waitFor(() => {
      expect(screen.getAllByText('0')).toHaveLength(3);
    });
  });

  it('displays session analytics cards on dashboard', async () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      removeUser: vi.fn(),
    });

    render(<AdminPortal />);

    expect(await screen.findByText('Total de Horas Suporte')).toBeInTheDocument();
    expect(await screen.findByText('5.5h')).toBeInTheDocument();
    expect(await screen.findByText('Sessões Concluídas')).toBeInTheDocument();
    expect(await screen.findByText('10')).toBeInTheDocument();
    expect(await screen.findByText('Duração Média')).toBeInTheDocument();
    expect(await screen.findByText('33min')).toBeInTheDocument();
  });

  it('logs out when logout button is clicked', async () => {
    const removeUser = vi.fn();
    (useAuth as any).mockReturnValue({ 
      isAuthenticated: true,
      removeUser,
    });
    (api.get as any).mockResolvedValue({ data: {} });

    render(<AdminPortal />);
    
    const logoutBtn = screen.getByText('Sair');
    await waitFor(() => {
      logoutBtn.click();
    });
    
    expect(removeUser).toHaveBeenCalled();
  });

  it('switches between tabs correctly', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ data: { data: [] } });

    render(<AdminPortal />);

    const auditBtn = screen.getByText('Auditoria');
    auditBtn.click();

    await waitFor(() => {
      expect(screen.getByText('Logs de Auditoria')).toBeInTheDocument();
    });

    const groupsBtn = screen.getByText('Grupos');
    fireEvent.click(groupsBtn);
    expect(await screen.findByText(/Grupos de Dispositivos/i)).toBeInTheDocument();

    const machinesBtn = screen.getByText('Máquinas');
    fireEvent.click(machinesBtn);
    expect(await screen.findByText(/Gerencie seus dispositivos/i)).toBeInTheDocument();

    const overviewBtn = screen.getByText('Visão Geral');
    fireEvent.click(overviewBtn);
    expect(await screen.findByText(/Gerenciamento de Frota/i)).toBeInTheDocument();
  });

  it('triggers export download when export button is clicked', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValueOnce({ data: 'stats' });
    (api.get as any).mockResolvedValueOnce({ data: { data: [] } });
    (api.get as any).mockResolvedValueOnce({ data: { data: [] } });
    (api.get as any).mockResolvedValueOnce({ data: 'csv,data' }); // For export call

    // Mock URL and click
    const createObjectURL = vi.fn().mockReturnValue('mock-url');
    window.URL.createObjectURL = createObjectURL;
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<AdminPortal />);
    const exportBtn = await screen.findByText(/Exportar CSV/i);
    exportBtn.click();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/devices/export');
      expect(createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });
    clickSpy.mockRestore();
  });

  it('handles csv import via file reader', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ data: { data: [] } });
    (api.post as any).mockResolvedValue({ data: {} });

    render(<AdminPortal />);
    const file = new File(['rustdesk_id,alias\nID1,A1'], 'test.csv', { type: 'text/csv' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Trigger change
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/devices/import', expect.objectContaining({ csv: expect.any(String) }));
    });
  });

  it('renders sessions tab and handles note update', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/sessions') return Promise.resolve({ data: { data: [{ id: 's1', device: { alias: 'D1' }, notes: 'old', started_at: new Date() }] } });
      return Promise.resolve({ data: { data: [] } });
    });
    (api.patch as any).mockResolvedValue({ data: {} });

    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('new note');

    render(<AdminPortal />);
    const sessionsTab = screen.getByText(/Sessões/i);
    sessionsTab.click();

    await waitFor(() => {
      expect(screen.getByText('D1')).toBeInTheDocument();
      expect(screen.getByText('old')).toBeInTheDocument();
    });

    const editBtn = screen.getByText('Editar');
    editBtn.click();

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/sessions/s1', { notes: 'new note' });
      expect(screen.getByText('new note')).toBeInTheDocument();
    });
    promptSpy.mockRestore();
  });

  it('displays audit logs when data is available', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/audit') return Promise.resolve({ data: { data: [{
        id: '1',
        createdAt: new Date().toISOString(),
        username: 'admin',
        action: 'UPDATE',
        resource: 'DEVICES',
        ipAddress: '127.0.0.1'
      }] } });
      return Promise.resolve({ data: {} });
    });

    render(<AdminPortal />);
    screen.getByText('Auditoria').click();

    await waitFor(() => {
      expect(screen.getByText('UPDATE')).toBeInTheDocument();
      expect(screen.getByText('Administrador')).toBeInTheDocument();
    });
  });

  it('hides action buttons in read-only mode', async () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      user: { profile: { preferred_username: 'viewer', realm_access: { roles: ['ADMIN_READONLY'] } } }
    });

    render(<AdminPortal />);
    
    // Botão de importação não deve existir
    expect(screen.queryByText('Importar CSV')).not.toBeInTheDocument();
    
    // Ir para sessões
    const sessionsBtn = screen.getByText('Sessões');
    fireEvent.click(sessionsBtn);
    
    // Botão de editar notas não deve existir na tabela de sessões
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });
});
