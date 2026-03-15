import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechnicianPortal from './TechnicianPortal';
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

describe('TechnicianPortal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading screen when auth is loading', () => {
    (useAuth as any).mockReturnValue({ isLoading: true });
    render(<TechnicianPortal />);
    expect(screen.getByText(/Carregando sistema.../i)).toBeInTheDocument();
  });

  it('renders error screen when auth fails', () => {
    (useAuth as any).mockReturnValue({ error: { message: 'Auth failed' } });
    render(<TechnicianPortal />);
    expect(screen.getByText(/Erro de Login OIDC: Auth failed/i)).toBeInTheDocument();
  });

  it('renders login screen when not authenticated', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false, signinRedirect: vi.fn() });
    render(<TechnicianPortal />);
    expect(screen.getByText(/Logar com Keycloak/i)).toBeInTheDocument();
  });

  it('calls signinRedirect when login button clicked', () => {
    const signinRedirect = vi.fn();
    (useAuth as any).mockReturnValue({ isAuthenticated: false, signinRedirect });
    render(<TechnicianPortal />);
    fireEvent.click(screen.getByText(/Logar com Keycloak/i));
    expect(signinRedirect).toHaveBeenCalled();
  });

  it('renders devices when authenticated', async () => {
    (useAuth as any).mockReturnValue({ 
      isAuthenticated: true, 
      user: { profile: { preferred_username: 'tech-user' } } 
    });
    (api.get as any).mockResolvedValue({ 
      data: { data: [{ id: '1', alias: 'Machine 1', status: 1, hostname: 'host1', platform: 'Win', tags: [] }] } 
    });

    render(<TechnicianPortal />);
    expect(screen.getByText(/tech-user/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Machine 1')).toBeInTheDocument();
    });
  });

  it('handles empty device list', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ data: { data: [] } });

    render(<TechnicianPortal />);
    await waitFor(() => {
      expect(screen.getByText(/Nenhum dispositivo encontrado/i)).toBeInTheDocument();
    });
  });

  it('triggers deep link when connect clicked', async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as any;

    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ 
      data: { data: [{ id: '123', alias: 'Machine 1', status: 1, hostname: 'host1', platform: 'Win', tags: [] }] } 
    });

    render(<TechnicianPortal />);
    
    await waitFor(() => {
      const btn = screen.getByText(/Conectar/i);
      fireEvent.click(btn);
    });

    expect(window.location.href).toBe('rustdesk://123');
    window.location = originalLocation as any;
  });

  it('handles api error in catch block', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockRejectedValue(new Error('API Error'));

    render(<TechnicianPortal />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });

  it('renders tags when available', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ 
      data: { data: [{ id: '1', alias: 'M1', status: 1, tags: ['tag1', 'tag2'], hostname: 'h', platform: 'p' }] } 
    });

    render(<TechnicianPortal />);
    await waitFor(() => {
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });
  });

  it('logs out when logout button is clicked', async () => {
    const removeUser = vi.fn();
    (useAuth as any).mockReturnValue({ 
      isAuthenticated: true,
      user: { profile: { preferred_username: 'tech-user' } },
      removeUser,
    });
    (api.get as any).mockResolvedValue({ data: { data: [] } });

    render(<TechnicianPortal />);
    const logoutBtn = await screen.findByText('Sair');
    fireEvent.click(logoutBtn);
    expect(removeUser).toHaveBeenCalled();
  });

  it('switches to settings tab and renders placeholder', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ data: { data: [] } });

    render(<TechnicianPortal />);
    
    const settingsBtn = screen.getByText('Configurações');
    fireEvent.click(settingsBtn);

    await waitFor(() => {
      expect(screen.getByText('Ajustes de perfil e preferências do técnico em desenvolvimento.')).toBeInTheDocument();
    });

    const machinesBtn = screen.getByText('Minhas Máquinas');
    fireEvent.click(machinesBtn);

    await waitFor(() => {
      expect(screen.getByText('Catálogo de Dispositivos (Address Book)')).toBeInTheDocument();
    });
  });
});
