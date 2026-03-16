import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // URL para validar as chaves públicas (JWKS) do Keycloak
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.KEYCLOAK_URL
          ? `${process.env.KEYCLOAK_URL}/realms/rustdesk/protocol/openid-connect/certs`
          : 'http://localhost:8080/realms/rustdesk/protocol/openid-connect/certs',
      }),
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    // REQ-F-015 / REQ-S-004: Exigir MFA quando REQUIRE_MFA=true
    // O Keycloak emite `acr: "mfa"` quando autenticação de múltiplos fatores foi utilizada
    const requireMfa = process.env.REQUIRE_MFA === 'true';
    if (requireMfa) {
      const acr = payload.acr;
      if (!acr || !['mfa', 'aal2', '2'].includes(String(acr))) {
        throw new UnauthorizedException(
          'Autenticação de múltiplos fatores (MFA) é obrigatória. Por favor, autentique-se novamente com MFA habilitado.',
        );
      }
    }

    return {
      userId: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
      mfaVerified: !!payload.acr,
    };
  }
}
