import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Saúde')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async getHealth() {
    const services: Record<string, 'ok' | 'error'> = {};
    let overallStatus: 'ok' | 'degraded' = 'ok';

    // Check Database
    try {
      await this.dataSource.query('SELECT 1');
      services['database'] = 'ok';
    } catch {
      services['database'] = 'error';
      overallStatus = 'degraded';
    }

    // Check Keycloak (OIDC endpoint availability)
    const keycloakUrl = process.env.KEYCLOAK_URL || 'http://keycloak:8080';
    try {
      const res = await fetch(`${keycloakUrl}/realms/rustdesk/.well-known/openid-configuration`, {
        signal: AbortSignal.timeout(3000),
      });
      services['keycloak'] = res.ok ? 'ok' : 'error';
      if (!res.ok) overallStatus = 'degraded';
    } catch {
      services['keycloak'] = 'error';
      overallStatus = 'degraded';
    }

    // Relay servers (hbbs/hbbr) — check via env config presence
    const relayConfigured = !!(process.env.RELAY_HOST || process.env.HBBR_HOST);
    services['relay'] = relayConfigured ? 'ok' : 'error';
    if (!relayConfigured) overallStatus = 'degraded';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
    };
  }
}
