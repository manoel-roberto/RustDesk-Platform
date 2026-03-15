import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppRoutes } from './App';
import { useAuth } from 'react-oidc-context';
import { MemoryRouter } from 'react-router-dom';

// Mock components
vi.mock('./pages/TechnicianPortal', () => ({ default: () => <div>Technician Portal</div> }));
vi.mock('./pages/AdminPortal', () => ({ default: () => <div>Admin Portal</div> }));

vi.mock('react-oidc-context', () => ({
  useAuth: vi.fn(),
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    );
  };

  it('renders loading screen when auth is loading', () => {
    (useAuth as any).mockReturnValue({ isLoading: true });
    renderWithRouter(<AppRoutes />);
    expect(screen.getByText(/Validando sessão.../i)).toBeInTheDocument();
  });

  it('renders login screen when not authenticated at root', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false });
    renderWithRouter(<AppRoutes />);
    expect(screen.getByText(/Logar com Keycloak/i)).toBeInTheDocument();
  });

  it('redirects to admin portal at root for admin user', () => {
    (useAuth as any).mockReturnValue({ 
      isAuthenticated: true,
      user: { profile: { preferred_username: 'admin' } }
    });
    renderWithRouter(<AppRoutes />);
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
  });

  it('redirects to technician portal at root for normal user', () => {
    (useAuth as any).mockReturnValue({ 
      isAuthenticated: true,
      user: { profile: { preferred_username: 'user1' } }
    });
    renderWithRouter(<AppRoutes />);
    expect(screen.getByText('Technician Portal')).toBeInTheDocument();
  });

  it('renders admin portal on /admin path if authenticated', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true });
    renderWithRouter(<AppRoutes />, { route: '/admin' });
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
  });

  it('renders error screen when auth error exists', () => {
    (useAuth as any).mockReturnValue({ error: { message: 'Auth Error' } });
    renderWithRouter(<AppRoutes />);
    expect(screen.getByText(/Erro de Login OIDC: Auth Error/i)).toBeInTheDocument();
  });

  it('calls signinRedirect in PrivateRoute when not authenticated', () => {
    const signinRedirect = vi.fn();
    (useAuth as any).mockReturnValue({ isAuthenticated: false, signinRedirect });
    renderWithRouter(<AppRoutes />, { route: '/technician' });
    screen.getByText(/Logar com Keycloak/i).click();
    expect(signinRedirect).toHaveBeenCalled();
  });

  it('renders loading in PrivateRoute', () => {
    (useAuth as any).mockReturnValue({ isLoading: true });
    renderWithRouter(<AppRoutes />, { route: '/technician' });
    expect(screen.getByText(/Validando sessão.../i)).toBeInTheDocument();
  });

  it('renders auth error in PrivateRoute', () => {
    (useAuth as any).mockReturnValue({ error: { message: 'Private Error' } });
    renderWithRouter(<AppRoutes />, { route: '/technician' });
    expect(screen.getByText(/Erro de Login OIDC: Private Error/i)).toBeInTheDocument();
  });
});

import App from './App';
describe('App', () => {
  it('renders successfully', () => {
    (useAuth as any).mockReturnValue({ isLoading: true });
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
