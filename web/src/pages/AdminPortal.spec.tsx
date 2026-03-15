import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPortal from './AdminPortal';
import { useAuth } from 'react-oidc-context';
import { api } from '../api/axios';

// Mocks
vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('AdminPortal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    groupsBtn.click();

    await waitFor(() => {
      expect(screen.getByText('Seção: Grupos')).toBeInTheDocument();
    });

    const machinesBtn = screen.getByText('Máquinas');
    machinesBtn.click();

    await waitFor(() => {
      expect(screen.getByText('Seção: Maquinas')).toBeInTheDocument();
    });

    const overviewBtn = screen.getByText('Visão Geral');
    overviewBtn.click();

    await waitFor(() => {
      expect(screen.getByText('Gerenciamento de Frota')).toBeInTheDocument();
    });
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
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });
});
