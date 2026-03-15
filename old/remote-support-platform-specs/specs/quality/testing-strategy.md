# Estratégia de Testes

> **Arquivo:** `specs/quality/testing-strategy.md`  
> **Versão:** 1.0.0

---

## 1. Pirâmide de Testes

```
                         ┌──────────┐
                         │   E2E    │  < 10% dos testes
                         │ (Cypress)│  Lentos, alto custo
                         └────┬─────┘
                    ┌─────────┴──────────┐
                    │   INTEGRATION       │  ~20% dos testes
                    │ (Jest + Supertest   │  Médio custo
                    │  + Testcontainers) │
                    └─────────┬───────────┘
              ┌───────────────┴────────────────┐
              │          UNIT TESTS             │  ~70% dos testes
              │    (Jest + NestJS Testing)      │  Rápidos, baixo custo
              └────────────────────────────────┘
```

**Meta de cobertura:** ≥ 80% (linhas) para a API NestJS

---

## 2. Testes Unitários

**Framework:** Jest + @nestjs/testing  
**Onde:** `services/api/src/**/*.spec.ts`  
**Quando rodar:** A cada push (< 30s)

### 2.1 O Que Testar

- Lógica de negócio nos Services (ex: verificação de permissão RBAC)
- Transformações de DTOs
- Funções de utilidade e helpers
- Guards de autenticação (com mock do Keycloak)
- Handlers de erro

### 2.2 Exemplo: Teste de Verificação de Acesso

```typescript
// devices.service.spec.ts
describe('DevicesService', () => {
  describe('canAccessDevice', () => {
    it('deve retornar true para admin independente do dispositivo', async () => {
      const user = createMockUser({ role: 'admin' });
      const result = await service.canAccessDevice(user.id, 'device-uuid');
      expect(result).toBe(true);
    });

    it('deve retornar false para técnico sem acesso', async () => {
      const user = createMockUser({ role: 'technician' });
      deviceAccessRepo.findOne.mockResolvedValue(null);
      const result = await service.canAccessDevice(user.id, 'device-uuid');
      expect(result).toBe(false);
    });

    it('deve retornar true para técnico com acesso via grupo', async () => {
      const user = createMockUser({ role: 'technician' });
      deviceAccessRepo.findOne.mockResolvedValue({ group_id: 'group-1' });
      const result = await service.canAccessDevice(user.id, 'device-uuid');
      expect(result).toBe(true);
    });
  });
});
```

---

## 3. Testes de Integração

**Framework:** Jest + Supertest + Testcontainers  
**Onde:** `services/api/test/integration/**/*.e2e-spec.ts`  
**Quando rodar:** Em PRs e merge para main (< 3 minutos)

### 3.1 Configuração com Testcontainers

```typescript
// test/integration/setup.ts
let pgContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;

beforeAll(async () => {
  pgContainer = await new PostgreSqlContainer('postgres:16-alpine').start();
  redisContainer = await new GenericContainer('redis:7-alpine').start();
  
  // Configurar app com containers reais
  app = await Test.createTestingModule({
    imports: [AppModule.forTest({
      databaseUrl: pgContainer.getConnectionUri(),
      redisUrl: `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`,
    })]
  }).compile();

  await app.init();
  // Rodar migrations
  await runMigrations(pgContainer.getConnectionUri());
});

afterAll(async () => {
  await pgContainer.stop();
  await redisContainer.stop();
  await app.close();
});
```

### 3.2 Casos de Teste de Integração

```typescript
// devices.integration.spec.ts
describe('GET /api/v1/devices', () => {
  it('deve retornar 401 sem token', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/devices')
      .expect(401);
  });

  it('técnico deve ver apenas dispositivos autorizados', async () => {
    const token = await getTokenForTechnician('carlos@empresa.com');
    const { body } = await request(app.getHttpServer())
      .get('/api/v1/devices')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(body.data.every(d => authorizedDeviceIds.includes(d.id))).toBe(true);
  });

  it('admin deve ver todos os dispositivos', async () => {
    const token = await getTokenForAdmin('fernanda@empresa.com');
    const { body } = await request(app.getHttpServer())
      .get('/api/v1/devices')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(body.meta.total).toBe(totalDeviceCount);
  });
});
```

---

## 4. Testes E2E

**Framework:** Cypress  
**Onde:** `web/e2e/cypress/`  
**Quando rodar:** Deploy em staging (antes de produção)  
**Ambiente:** Servidor de staging com dados de teste

### 4.1 Cenários E2E Críticos (Smoke Tests)

| Cenário | Arquivo | Prioridade |
|---------|---------|------------|
| Login com MFA | `auth/login.cy.ts` | P0 |
| Listar dispositivos como técnico | `devices/list.cy.ts` | P0 |
| Bloquear acesso a dispositivo não autorizado | `devices/rbac.cy.ts` | P0 |
| Criar novo dispositivo como admin | `admin/create-device.cy.ts` | P1 |
| Iniciar sessão e registrar no histórico | `sessions/start-session.cy.ts` | P1 |
| Criar e desativar usuário técnico | `admin/user-management.cy.ts` | P1 |

### 4.2 Exemplo de Teste E2E

```typescript
// cypress/e2e/auth/login.cy.ts
describe('Login com MFA', () => {
  it('deve completar o fluxo de login com TOTP', () => {
    cy.visit('/');
    
    // Redirecionar para Keycloak
    cy.url().should('include', 'auth.empresa.com');
    
    // Inserir credenciais
    cy.get('#username').type('carlos@empresa.com');
    cy.get('#password').type(Cypress.env('TEST_PASSWORD'));
    cy.get('#kc-login').click();
    
    // TOTP screen
    cy.get('#otp').type(getTOTPCode(Cypress.env('TEST_TOTP_SECRET')));
    cy.get('#kc-login').click();
    
    // Verificar redirecionamento para portal
    cy.url().should('include', '/devices');
    cy.contains('Carlos Mendes').should('be.visible');
  });
});
```

---

## 5. Testes de Segurança

### 5.1 Verificações Automatizadas no CI

| Ferramenta | O que verifica | Quando |
|-----------|----------------|--------|
| `npm audit` | Vulnerabilidades em dependências NPM | A cada push |
| `cargo audit` | Vulnerabilidades em dependências Rust | No build do cliente |
| `trivy` | CVEs na imagem Docker | Após docker build |
| OWASP ZAP | Scan dinâmico de segurança da API | Semanal em staging |

### 5.2 Testes de RBAC Obrigatórios

Para cada endpoint da API, deve existir um teste de integração verificando:
- `401` sem token
- `403` com token de role sem permissão
- `200` com token de role autorizada

---

## 6. Cobertura de Testes

### 6.1 Metas por Módulo

| Módulo | Meta de Cobertura |
|--------|------------------|
| `AuthModule` | 90% |
| `DevicesModule` | 85% |
| `SessionsModule` | 85% |
| `UsersModule` | 85% |
| `AddressBookModule` | 80% |
| Geral (API) | 80% |

### 6.2 Relatório no CI

```yaml
# No workflow do GitHub Actions
- name: Test Coverage
  run: npm run test:coverage
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    fail_ci_if_error: true
    minimum_coverage: 80
```
