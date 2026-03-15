# Modelo de Segurança

> **Arquivo:** `specs/security/security-model.md`  
> **Versão:** 1.0.0

---

## 1. Princípios de Segurança

A plataforma adota os princípios **Zero Trust** como base do modelo de segurança:

| Princípio | Descrição | Implementação |
|-----------|-----------|---------------|
| **Never Trust, Always Verify** | Nenhuma requisição é confiável por padrão | JWT obrigatório em todos os endpoints (exceto /health) |
| **Least Privilege** | Acesso mínimo necessário para cada papel | RBAC granular por dispositivo e grupo |
| **Assume Breach** | Projetar como se um atacante já estivesse dentro | Segmentação de rede, criptografia de dados em repouso |
| **Verify Explicitly** | Validar identidade em cada requisição | Token verificado a cada chamada de API |
| **Audit Everything** | Toda ação é registrada e rastreável | Audit log imutável para todas as operações |

---

## 2. Superfície de Ataque e Controles

### 2.1 Diagrama de Ameaças

```
[Internet]
    │
    │  Vetores de ataque externos:
    │  ├── Força bruta em login
    │  ├── Interceptação de tráfego
    │  ├── Injeção (SQL, XSS, CSRF)
    │  └── Varredura de portas / exploração de serviços
    │
    ▼
[Nginx — Linha de Defesa 1]
    │  Controles: TLS 1.3, Rate limiting, WAF headers,
    │             Bloqueio de métodos não permitidos
    ▼
[API Server — Linha de Defesa 2]
    │  Controles: JWT validation, RBAC guards,
    │             Input validation (DTOs), CORS configurado
    ▼
[Keycloak — Linha de Defesa 3]
    │  Controles: MFA obrigatório, bloqueio por tentativas,
    │             Tokens com TTL curto (1h)
    ▼
[PostgreSQL / Redis — Linha de Defesa 4]
    │  Controles: Sem acesso externo (rede Docker interna),
    │             Autenticação por senha forte,
    │             Dados sensíveis com hash/encrypt
```

### 2.2 Mapeamento de Ameaças (STRIDE)

| Categoria | Ameaça | Controle |
|-----------|--------|---------|
| **Spoofing** | Impersonação de técnico | JWT + MFA obrigatório |
| **Tampering** | Modificação de dados em trânsito | TLS 1.2+ em todo tráfego externo |
| **Repudiation** | Negar ter realizado ação | Audit log imutável com IP + timestamp |
| **Info Disclosure** | Acesso a dispositivos não autorizados | RBAC por dispositivo/grupo |
| **Denial of Service** | Sobrecarga da API ou hbbs | Rate limiting, Fail2Ban |
| **Elevation of Privilege** | Técnico tentando virar admin | Roles validadas no servidor via Keycloak |

---

## 3. Segurança de Transporte

### 3.1 TLS

```
Requisitos obrigatórios:
- Protocolo mínimo: TLS 1.2
- Protocolo preferido: TLS 1.3
- Cipher suites: HIGH:!aNULL:!MD5:!RC4
- HSTS: max-age=31536000; includeSubDomains
- Certificados: Let's Encrypt (renovação automática via certbot)
- Todos os redirects HTTP → HTTPS no Nginx
```

### 3.2 Headers de Segurança (Nginx)

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; ..." always;
```

---

## 4. Segurança de Aplicação

### 4.1 Rate Limiting

| Endpoint | Limite | Janela |
|----------|--------|--------|
| `POST /auth/*` (login) | 10 req | 5 minutos por IP |
| `POST /devices/*/connect` | 30 req | 1 minuto por usuário |
| `GET /devices` | 100 req | 1 minuto por usuário |
| API geral | 300 req | 1 minuto por IP |

### 4.2 Proteção contra Injection

- **SQL Injection:** ORM com prepared statements (TypeORM/Prisma)
- **XSS:** Sanitização de input nos DTOs + CSP headers
- **CSRF:** Não aplicável (SPA com JWT — sem cookies de sessão)
- **Path Traversal:** Validação estrita de parâmetros de rota

### 4.3 Proteção de Dados Sensíveis

| Dado | Proteção |
|------|----------|
| Senhas de usuário | Gerenciadas pelo Keycloak (bcrypt) — nunca na API |
| Senhas de dispositivos | bcrypt com salt antes de armazenar |
| Tokens JWT | Apenas em memória no frontend (não em localStorage) |
| Chave privada RSA do hbbs | Apenas em volume Docker — nunca exposta via API |
| Variáveis de ambiente | Via `.env` não versionado + secrets do CI/CD |

---

## 5. Segurança de Infraestrutura

### 5.1 Rede Docker

```yaml
# Todos os serviços internos em rede privada
# Apenas Nginx exposto externamente (portas 80, 443)
# hbbs/hbbr expostos diretamente (protocolo não-HTTP)

Exposto externamente:
  - :80 (nginx)
  - :443 (nginx)
  - :21115-21119 (hbbs/hbbr)

Apenas rede interna Docker:
  - :3000 (api)
  - :5432 (postgres)
  - :6379 (redis)
  - :8080 (keycloak)
  - :9090 (prometheus)
  - :3001 (grafana)
```

### 5.2 Política de Firewall (UFW)

```
ALLOW: 22/tcp     (SSH — restrito a IPs de gestão)
ALLOW: 80/tcp     (HTTP → redirect HTTPS)
ALLOW: 443/tcp    (HTTPS)
ALLOW: 21115/tcp  (hbbs)
ALLOW: 21116/tcp  (hbbs)
ALLOW: 21116/udp  (hbbs NAT traversal)
ALLOW: 21117/tcp  (hbbr relay)
ALLOW: 21118/tcp  (hbbs WebSocket)
ALLOW: 21119/tcp  (hbbr WebSocket)
DENY:  all others (política padrão)
```

### 5.3 Hardening do Sistema Operacional

- Login SSH apenas via chave pública (senha desabilitada)
- `PermitRootLogin no` no sshd_config
- Fail2Ban configurado para SSH e API
- `unattended-upgrades` habilitado para patches de segurança
- Kernel hardening via sysctl (SYN cookies, ICMP redirect bloqueado)
- Usuário não-root para execução de containers Docker

---

## 6. Criptografia de Sessões Remotas (RustDesk)

O RustDesk implementa criptografia E2E nas sessões de tela:

```
Técnico                    hbbr (Relay)              Dispositivo Cliente
   │                           │                            │
   │◄── Troca de chaves RSA ──────────────────────────────►│
   │    (hbbs facilita, mas não participa)                  │
   │                           │                            │
   │══ [AES-128 encrypted] ═══►│══ [AES-128 encrypted] ═══►│
   │   (relay não pode decifrar)│                           │
```

**O servidor relay (hbbr) NÃO tem acesso ao conteúdo das sessões.**  
Todo frame de tela, input de teclado/mouse é criptografado no cliente antes de ser enviado.
