import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

// Mock jwks-rsa
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => jest.fn()),
  JwksClient: jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn(),
  })),
}));

// Mock PassportStrategy to avoid JWKS HTTP calls
jest.mock('@nestjs/passport', () => ({
  PassportStrategy: (Strategy: any) => {
    class MockStrategy {
      constructor(_options: any) {}
    }
    return MockStrategy;
  },
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    delete process.env.REQUIRE_MFA;
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data for a valid payload without MFA requirement', async () => {
      const payload = {
        sub: 'user-123',
        preferred_username: 'tecnico1',
        realm_access: { roles: ['technician'] },
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        username: 'tecnico1',
        roles: ['technician'],
        mfaVerified: false,
      });
    });

    it('should throw UnauthorizedException when payload is null', async () => {
      await expect(strategy.validate(null)).rejects.toThrow(UnauthorizedException);
    });

    it('should return user with mfaVerified=true when acr is present', async () => {
      const payload = {
        sub: 'user-123',
        preferred_username: 'admin',
        realm_access: { roles: ['admin'] },
        acr: 'mfa',
      };

      const result = await strategy.validate(payload);
      expect(result.mfaVerified).toBe(true);
    });

    it('should return empty roles when realm_access is missing', async () => {
      const payload = { sub: 'user-123', preferred_username: 'test' };
      const result = await strategy.validate(payload);
      expect(result.roles).toEqual([]);
    });

    describe('MFA enforcement (REQUIRE_MFA=true)', () => {
      beforeEach(() => {
        process.env.REQUIRE_MFA = 'true';
      });

      afterEach(() => {
        delete process.env.REQUIRE_MFA;
      });

      it('should allow access when acr is "mfa"', async () => {
        const payload = {
          sub: 'user-1',
          preferred_username: 'admin',
          realm_access: { roles: ['admin'] },
          acr: 'mfa',
        };
        const result = await strategy.validate(payload);
        expect(result.userId).toBe('user-1');
      });

      it('should allow access when acr is "aal2"', async () => {
        const payload = {
          sub: 'user-2',
          preferred_username: 'user',
          realm_access: { roles: [] },
          acr: 'aal2',
        };
        const result = await strategy.validate(payload);
        expect(result.userId).toBe('user-2');
      });

      it('should throw UnauthorizedException when acr is missing', async () => {
        const payload = {
          sub: 'user-3',
          preferred_username: 'user',
          realm_access: { roles: [] },
        };
        await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      });

      it('should throw UnauthorizedException when acr is "1" (password only)', async () => {
        const payload = {
          sub: 'user-4',
          preferred_username: 'user',
          realm_access: { roles: [] },
          acr: '1',
        };
        await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      });

      it('should allow access when acr is "2" (step-up auth)', async () => {
        const payload = {
          sub: 'user-5',
          preferred_username: 'user',
          realm_access: { roles: [] },
          acr: '2',
        };
        const result = await strategy.validate(payload);
        expect(result.userId).toBe('user-5');
      });
    });
  });
});
