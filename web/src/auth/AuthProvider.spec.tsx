import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KeycloakProvider } from './AuthProvider';

vi.mock('react-oidc-context', () => ({
  AuthProvider: ({ children }: any) => <div data-testid="auth-provider">{children}</div>,
}));

describe('AuthProvider', () => {
  it('renders children within AuthProvider', () => {
    const { getByTestId } = render(
      <KeycloakProvider>
        <div data-testid="child">Child</div>
      </KeycloakProvider>
    );
    expect(getByTestId('auth-provider')).toBeInTheDocument();
  });

  it('handles signin callback without error', () => {
    window.history.replaceState = vi.fn();
    import('./AuthProvider').then(m => {
      m.oidcConfig.onSigninCallback({});
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });
});
