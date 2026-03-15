import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './axios';
import { User } from 'oidc-client-ts';

vi.mock('oidc-client-ts', () => ({
  User: {
    fromStorageString: vi.fn(),
  },
}));

describe('axios api', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('adds authorization header when token exists in localStorage', async () => {
    const mockUser = { access_token: 'fake-token' };
    (User.fromStorageString as any).mockReturnValue(mockUser);
    
    localStorage.setItem('oidc.user:123', 'some-data');
    
    // Trigger interceptor
    const config = await (api.interceptors.request.handlers[0] as any).fulfilled({ headers: {} });
    
    expect(config.headers.Authorization).toBe('Bearer fake-token');
  });

  it('does not add authorization header when no token exists', async () => {
    const config = await (api.interceptors.request.handlers[0] as any).fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('handles errors when loading token', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('oidc.user:123', 'corrupt-data');
    (User.fromStorageString as any).mockImplementation(() => { throw new Error('Fail'); });

    const config = await (api.interceptors.request.handlers[0] as any).fulfilled({ headers: {} });
    expect(warnSpy).toHaveBeenCalled();
    expect(config.headers.Authorization).toBeUndefined();
    warnSpy.mockRestore();
  });

  it('rejects error in interceptor', async () => {
    const error = new Error('Test Error');
    await expect((api.interceptors.request.handlers[0] as any).rejected(error)).rejects.toThrow('Test Error');
  });
});
