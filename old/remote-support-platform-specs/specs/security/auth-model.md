# Modelo de Autenticação e Autorização

> **Arquivo:** `specs/security/auth-model.md`  
> **Versão:** 1.0.0

---

## 1. Visão Geral

A plataforma utiliza **Keycloak** como Identity Provider (IdP) centralizado. O fluxo de autenticação segue o protocolo **OpenID Connect (OIDC)** com **Authorization Code Flow + PKCE** para os portais web.

```
┌──────────────┐    (1) Auth Request    ┌─────────────┐
│   Browser    │ ─────────────────────► │  Keycloak   │
│  (Portal)    │                        │  Auth Server│
│              │ ◄───────────────────── │             │
│              │   (2) Login Page       │             │
│              │                        │             │
│              │ ─────────────────────► │             │
│              │  (3) Credentials+TOTP  │             │
│              │                        │             │
│              │ ◄───────────────────── │             │
│              │   (4) Auth Code        │             │
│              │                        │             │
│              │ ─────────────────────► │             │
│   Portal     │  (5) Code Exchange     │             │
│   Backend    │ ◄───────────────────── │             │
│              │   (6) Tokens (JWT)     │             │
└──────┬───────┘                        └─────────────┘
       │  (7) Bearer Token
       ▼
┌──────────────┐
│  API Server  │ ── Valida JWT ──► Keycloak JWKS Endpoint
└──────────────┘
```

---

## 2. Tokens

### 2.1 Access Token (JWT)

Usado para autenticar chamadas à API. Curta duração.

**Configuração:**
- **TTL:** 60 minutos
- **Algoritmo:** RS256 (assimétrico — chave pública disponível em JWKS)
- **Claims obrigatórios:**

```json
{
  "sub": "keycloak-user-uuid",
  "email": "carlos@empresa.com",
  "name": "Carlos Mendes",
  "realm_access": {
    "roles": ["technician"]
  },
  "iss": "https://auth.empresa.com/realms/remote-support",
  "aud": "api-server",
  "iat": 1705312200,
  "exp": 1705315800
}
```

### 2.2 Refresh Token

Usado pelo frontend para obter novos access tokens sem re-login.

- **TTL:** 8 horas (duração de uma jornada de trabalho)
- **Armazenado:** Apenas em memória no browser (não em localStorage/sessionStorage)
- **Rotação:** Novo refresh token emitido a cada renovação

### 2.3 ID Token

Contém informações de identidade do usuário para uso no frontend (não enviado à API).

---

## 3. Fluxo de Login Detalhado

### 3.1 Primeiro Acesso (Novo Técnico)

```
1. Admin cria o usuário via Portal Admin
2. Sistema cria o usuário no Keycloak via Admin API
3. Keycloak envia email com link de "definição de senha" (24h de validade)
4. Técnico acessa o link e define sua senha
5. Keycloak exige configuração obrigatória de MFA (TOTP)
6. Técnico escaneia QR code com Google Authenticator / Authy / similar
7. Técnico valida com o primeiro código gerado
8. Primeiro login completo
```

### 3.2 Login Padrão

```
1. Usuário acessa portal.empresa.com
2. Frontend detecta ausência de token e redireciona para Keycloak
3. Usuário insere email + senha
4. Keycloak exibe tela de MFA (TOTP)
5. Usuário insere código de 6 dígitos do app autenticador
6. Keycloak emite tokens e redireciona com authorization code
7. Frontend troca o code pelos tokens
8. Access token armazenado em memória; refresh token em cookie httpOnly
9. Frontend chama GET /auth/me para carregar perfil do usuário
```

### 3.3 Renovação Silenciosa de Token

```
1. Frontend detecta access token expirado (ou próximo da expiração)
2. Frontend chama POST /token com o refresh token
3. Keycloak valida o refresh token e emite novo access token
4. Se o refresh token também expirou (>8h), redirecionar para login
```

---

## 4. Autorização — RBAC

### 4.1 Papéis e Permissões

| Recurso / Ação | admin | technician | viewer | auditor |
|----------------|-------|------------|--------|---------|
| Listar dispositivos | ✅ todos | ✅ autorizados | ✅ autorizados | ❌ |
| Criar/editar dispositivo | ✅ | ❌ | ❌ | ❌ |
| Deletar dispositivo | ✅ | ❌ | ❌ | ❌ |
| Iniciar sessão remota | ✅ | ✅ autorizados | ❌ | ❌ |
| Ver histórico de sessões | ✅ todos | ✅ próprias | ❌ | ✅ todos |
| Exportar sessões | ✅ | ❌ | ❌ | ✅ |
| Criar/editar usuário | ✅ | ❌ | ❌ | ❌ |
| Gerenciar grupos | ✅ | ❌ | ❌ | ❌ |
| Ver audit log | ✅ | ❌ | ❌ | ✅ |
| Ver métricas/dashboard | ✅ | ❌ | ❌ | ❌ |

### 4.2 Implementação no NestJS

```typescript
// Exemplo de guard RBAC na API
@Get('/devices')
@Roles('admin', 'technician', 'viewer')  // Decorator de roles permitidas
@UseGuards(JwtAuthGuard, RolesGuard)
async listDevices(
  @CurrentUser() user: AuthenticatedUser,
  @Query() query: ListDevicesDto,
) {
  // Para técnicos: filtrar automaticamente por dispositivos autorizados
  if (user.role === 'technician') {
    return this.devicesService.findByUser(user.id, query);
  }
  return this.devicesService.findAll(query);
}
```

### 4.3 Verificação de Acesso por Dispositivo

```typescript
// Antes de permitir conexão, verificar device_access
async canAccessDevice(userId: string, deviceId: string): Promise<boolean> {
  const user = await this.usersService.findById(userId);
  
  // Admin tem acesso a tudo
  if (user.role === 'admin') return true;
  
  // Verificar acesso direto ao dispositivo
  const directAccess = await this.deviceAccessRepo.findOne({
    where: { user_id: userId, device_id: deviceId }
  });
  if (directAccess) return true;
  
  // Verificar acesso via grupo
  const device = await this.devicesService.findById(deviceId);
  const groupAccess = await this.deviceAccessRepo.findOne({
    where: { user_id: userId, group_id: device.group_id }
  });
  
  return !!groupAccess;
}
```

---

## 5. MFA — Multi-Factor Authentication

### 5.1 Configuração

- **Tipo:** TOTP (Time-based One-Time Password)
- **Algoritmo:** HMAC-SHA1
- **Dígitos:** 6
- **Período:** 30 segundos
- **Apps suportados:** Google Authenticator, Microsoft Authenticator, Authy, Bitwarden

### 5.2 Política de Keycloak

```
otpPolicyType: totp
otpPolicyAlgorithm: HmacSHA1
otpPolicyDigits: 6
otpPolicyPeriod: 30
MFA obrigatório para todos os usuários do realm remote-support
Não é possível ignorar a configuração de MFA no primeiro acesso
```

### 5.3 Recuperação de Acesso (MFA Perdido)

```
1. Técnico reporta perda do app autenticador ao admin
2. Admin acessa Keycloak Admin Console
3. Admin remove o dispositivo OTP do usuário
4. Na próxima tentativa de login, Keycloak exige reconfiguração do MFA
5. Técnico registra novo app autenticador
```

---

## 6. Logout e Expiração de Sessão

### 6.1 Logout Ativo

```
1. Usuário clica em "Sair" no portal
2. Frontend chama endpoint de logout do Keycloak
3. Keycloak revoga o refresh token
4. Frontend limpa o access token da memória
5. Usuário é redirecionado para a tela de login
```

### 6.2 Expiração por Inatividade

- Access token expira em 60 minutos
- Refresh token expira em 8 horas
- Após 8 horas de inatividade → novo login + MFA obrigatório
- Não há renovação automática de sessão além do refresh token
