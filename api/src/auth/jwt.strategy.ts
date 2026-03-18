import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private jwksClient: JwksClient;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        try {
          const headerBase64 = rawJwtToken.split('.')[0];
          const header = JSON.parse(Buffer.from(headerBase64, 'base64').toString());
          const kid = header.kid;

          console.log('JWT_DEBUG: Buscando chave para kid:', kid);

          this.jwksClient.getSigningKey(kid, (err, key) => {
            if (err) {
              console.error('JWT_DEBUG: Erro ao buscar chave no Keycloak:', err.message);
              return done(err, null);
            }
            const publicKey = key.getPublicKey();
            console.log('JWT_DEBUG: Chave pública recuperada com sucesso para kid:', kid);
            done(null, publicKey);
          });
        } catch (e) {
          console.error('JWT_DEBUG: Erro ao processar token:', e.message);
          done(e, null);
        }
      },
    });

    const jwksUri = process.env.KEYCLOAK_URL
      ? `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/certs`
      : 'http://localhost:8080/realms/master/protocol/openid-connect/certs';

    this.jwksClient = new JwksClient({
      jwksUri,
      cache: true,
      rateLimit: true,
    });

    console.log('JWT_DEBUG: JwtStrategy INICIALIZADA. JWKS_URI:', jwksUri);
  }

  async validate(payload: any) {
    console.log('JWT_DEBUG: Validando payload:', JSON.stringify(payload));
    
    if (!payload) {
      console.error('JWT_DEBUG: Payload vazio ou nulo');
      throw new UnauthorizedException('Token inválido');
    }

    // REQ-F-015 / REQ-S-004: Exigir MFA quando REQUIRE_MFA=true
    const requireMfa = process.env.REQUIRE_MFA === 'true';
    if (requireMfa) {
      const acr = payload.acr;
      if (!acr || !['mfa', 'aal2', '2'].includes(String(acr))) {
        throw new UnauthorizedException(
          'Autenticação de múltiplos fatores (MFA) é obrigatória.',
        );
      }
    }

    const user = {
      userId: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
      mfaVerified: !!payload.acr,
    };
    
    console.log('JWT_DEBUG: Usuário validado:', JSON.stringify(user));
    return user;
  }
}
