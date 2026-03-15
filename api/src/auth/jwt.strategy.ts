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
      // URL para validar as chaves públicas (JWKS) do formato correto do Keycloak
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.KEYCLOAK_URL 
          ? `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/certs`
          : 'http://localhost:8080/realms/master/protocol/openid-connect/certs',
      }),
      // Para validações simples, usaremos master (embora numa prod fosse um realm específico)
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    // Retorna as informacoes cruciais no request.user
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
    };
  }
}
