import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechnicianPortal from './TechnicianPortal';
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
  },
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

describe('TechnicianPortal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/users/peers') return Promise.resolve({ data: { data: [] } });
      if (url === '/downloads/client/info') return Promise.resolve({ data: { name: 'RustDesk Test', version: '1.0', platform: 'Win', downloadUrl: '#' } });
      return Promise.reject(new Error('URL not mocked'));
    });
  });

  it('renders downloads tab', async () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: true,
      user: { profile: { preferred_username: 'tech1' } }
    });

    render(<TechnicianPortal />);
    
    const downloadsBtn = await screen.findByText('Downloads');
    fireEvent.click(downloadsBtn);

    expect(await screen.findByText('Central de Downloads')).toBeInTheDocument();
    expect(screen.getByText('RustDesk Test')).toBeInTheDocument();
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
    const user = userEvent.setup();
    const assignMock = vi.fn();
    
    // Backup original location
    const oldLocation = window.location;
    delete (window as any).location;
    window.location = { ...oldLocation, assign: assignMock } as any;

    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ 
      data: { data: [{ id: '123', alias: 'Machine 1', status: 1, hostname: 'host1', platform: 'Win', tags: [] }] } 
    });
    (api.post as any).mockResolvedValue({ data: { deep_link: 'rustdesk://123' } });

    render(<TechnicianPortal />);
    
    // Esperar o carregamento dos dispositivos e clicar no botão
    const btn = await screen.findByRole('button', { name: /Acessar/i });
    await user.click(btn);

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalled();
    });

    (window as any).location = oldLocation;
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

  it('renders branding data from api', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/downloads/branding') return Promise.resolve({ data: { companyName: 'My Awesome Corp', primaryColor: '#ff0000' } });
      return Promise.resolve({ data: { data: [] } });
    });

    render(<TechnicianPortal />);
    expect(await screen.findByText('My Awesome Corp')).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', () => {
    const toggleTheme = vi.fn();
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (useTheme as any).mockReturnValue({ theme: 'dark', toggleTheme });
    (api.get as any).mockResolvedValue({ data: { data: [] } });

    render(<TechnicianPortal />);
    const themeBtn = screen.getByTitle('Alternar Tema');
    fireEvent.click(themeBtn);
    expect(toggleTheme).toHaveBeenCalled();
  });

  it('handles copy id to clipboard', async () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    (api.get as any).mockResolvedValue({ 
      data: { data: [{ id: '999', alias: 'D9', status: 1, tags: [], hostname: 'H', platform: 'P' }] } 
    });
    
    // Mock clipboard and alert
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<TechnicianPortal />);
    const copyBtn = await screen.findByTitle('Copiar ID');
    fireEvent.click(copyBtn);

    expect(writeText).toHaveBeenCalledWith('999');
    expect(alertSpy).toHaveBeenCalledWith('ID copiado!');
    
    alertSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
