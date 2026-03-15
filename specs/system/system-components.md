# Componentes do Sistema

> **Arquivo:** `specs/system/system-components.md`  
> **Versão:** 1.0.0

---

## Componente 1 — hbbs (RustDesk ID Server)

**Tipo:** Binário Rust (imagem Docker oficial)  
**Imagem:** `rustdesk/rustdesk-server:latest`  
**Responsabilidade:** Servidor de rendezvous e registro de IDs RustDesk

### Função

O hbbs é o ponto central de registro da plataforma. Cada cliente RustDesk instalado nos dispositivos conecta ao hbbs para:
1. Registrar seu ID único e endereço IP/porta
2. Manter heartbeat periódico (keepalive)
3. Receber solicitações de conexão de técnicos
4. Facilitar NAT hole punching entre técnico e cliente

### Interface

| Porta | Protocolo | Função |
|-------|-----------|--------|
| 21115 | TCP | Registro de ID e verificação de tipo de NAT |
| 21116 | TCP | Heartbeat de dispositivos registrados |
| 21116 | UDP | NAT hole punching (conexão direta) |
| 21118 | TCP | Suporte a WebSocket (clientes web) |

### Configuração Crítica

- `RELAY`: endereço do(s) hbbr para fallback (ex: `relay.empresa.com:21117`)
- `ALWAYS_USE_RELAY`: `N` por padrão (tenta P2P primeiro)
- Chaves RSA (`id_ed25519` + `id_ed25519.pub`) geradas na primeira execução

### Dependências

- Volume persistente para chaves criptográficas
- Portas TCP e UDP abertas no firewall

---

## Componente 2 — hbbr (RustDesk Relay Server)

**Tipo:** Binário Rust (imagem Docker oficial)  
**Imagem:** `rustdesk/rustdesk-server:latest`  
**Responsabilidade:** Relay de tráfego quando P2P não é possível

### Função

Quando o hbbs não consegue estabelecer conexão direta entre técnico e cliente (NAT simétrico, firewall restritivo), o tráfego é roteado pelo hbbr. O hbbr faz relay bidirecional do tráfego **sem decifrar** o conteúdo (criptografado E2E no cliente).

### Interface

| Porta | Protocolo | Função |
|-------|-----------|--------|
| 21117 | TCP | Relay de sessões |
| 21119 | TCP | Relay via WebSocket |

### Considerações de Escala

- hbbr é o componente com maior uso de banda (trafega frames de tela)
- Pode ser escalado horizontalmente com múltiplas instâncias
- Instâncias adicionais são configuradas no hbbs via variável `RELAY`

---

## Componente 3 — API Server

**Tipo:** Aplicação Node.js (NestJS + TypeScript)  
**Container:** `remote-support/api:latest` (build local)  
**Porta:** 3000 (interna)  
**Responsabilidade:** Lógica de negócio, address book, RBAC, auditoria

### Módulos

| Módulo | Responsabilidade |
|--------|-----------------|
| `AuthModule` | Validação de JWT, integração com Keycloak, guards |
| `UsersModule` | CRUD de usuários técnicos, sincronização com Keycloak |
| `DevicesModule` | CRUD de dispositivos, grupos, status online |
| `AddressBookModule` | Gestão do address book por técnico/grupo |
| `SessionsModule` | Registro e consulta de sessões remotas |
| `AuditModule` | Log de todas as ações administrativas |
| `HealthModule` | Endpoint `/health` para healthcheck |
| `MetricsModule` | Endpoint `/metrics` para Prometheus |

### Interface

- REST API com documentação OpenAPI/Swagger em `/api/docs`
- Autenticação via Bearer Token (JWT emitido pelo Keycloak)
- Todas as respostas em JSON

### Dependências

- PostgreSQL (via TypeORM ou Prisma)
- Redis (sessões, rate limiting, cache de status de dispositivos)
- Keycloak Admin API (criação/gestão de usuários)

---

## Componente 4 — Portal Admin

**Tipo:** Aplicação React (Vite + TypeScript)  
**Container:** `remote-support/admin:latest`  
**Porta:** 80 (interna, servido por Nginx)  
**Responsabilidade:** Interface para administradores

### Páginas

| Rota | Conteúdo |
|------|----------|
| `/dashboard` | Métricas de uso, status de serviços |
| `/devices` | Lista, busca, CRUD de dispositivos |
| `/devices/:id` | Detalhe de dispositivo + histórico de sessões |
| `/groups` | Gestão de grupos de dispositivos |
| `/users` | Gestão de usuários técnicos |
| `/sessions` | Histórico global de sessões |
| `/audit` | Log de auditoria |
| `/settings` | Configurações da plataforma |
| `/downloads` | Links e versão atual do instalador do cliente |

---

## Componente 5 — Portal do Técnico

**Tipo:** Aplicação React (Vite + TypeScript)  
**Container:** `remote-support/technician:latest`  
**Porta:** 80 (interna)  
**Responsabilidade:** Interface operacional para técnicos

### Páginas

| Rota | Conteúdo |
|------|----------|
| `/` | Lista de dispositivos com status e ação de conectar |
| `/devices/:id` | Detalhe + últimas sessões do dispositivo |
| `/sessions` | Histórico de sessões do técnico logado |
| `/sessions/:id` | Detalhe de sessão + formulário de notas |

---

## Componente 6 — PostgreSQL

**Tipo:** Banco de dados relacional  
**Imagem:** `postgres:16-alpine`  
**Porta:** 5432 (apenas rede interna Docker)  
**Responsabilidade:** Persistência de todos os dados da plataforma

### Dados Armazenados

- Usuários (espelho do Keycloak)
- Grupos de dispositivos
- Dispositivos (address book)
- Permissões de acesso (RBAC)
- Sessões remotas (histórico)
- Log de auditoria
- Configurações da plataforma

---

## Componente 7 — Redis

**Tipo:** Cache in-memory + message broker  
**Imagem:** `redis:7-alpine`  
**Porta:** 6379 (apenas rede interna Docker)  
**Responsabilidade:** Cache, sessões HTTP, rate limiting, estado de dispositivos

### Usos

| Chave Redis | TTL | Propósito |
|-------------|-----|-----------|
| `device:status:{id}` | 60s | Status online/offline (atualizado pelo hbbs via webhook) |
| `rate:login:{ip}` | 600s | Contador de tentativas de login por IP |
| `session:{token}` | 3600s | Cache de sessão de usuário autenticado |
| `health:cache` | 30s | Cache do status de saúde dos serviços |

---

## Componente 8 — Keycloak

**Tipo:** Identity and Access Management  
**Imagem:** `quay.io/keycloak/keycloak:24.0`  
**Responsabilidade:** Autenticação, MFA, SSO, federação com AD

### Configuração do Realm `remote-support`

- **Flows:** Username/Password + TOTP obrigatório
- **Clients:** `portal-admin`, `portal-technician`, `api-server`
- **Roles:** `admin`, `technician`, `viewer`, `auditor`
- **Password Policy:** Mínimo 12 caracteres, 1 maiúscula, 1 número, 1 especial
- **Session Timeout:** 8 horas (renovável com refresh token)

---

## Componente 9 — Nginx (Reverse Proxy)

**Tipo:** Reverse proxy + TLS termination  
**Imagem:** `nginx:1.25-alpine`  
**Portas:** 80 (redirect), 443 (HTTPS)  
**Responsabilidade:** Roteamento, TLS, rate limiting, headers de segurança

### Roteamento

| Host | Destino |
|------|---------|
| `api.empresa.com` | API Server :3000 |
| `admin.empresa.com` | Portal Admin :80 |
| `portal.empresa.com` | Portal Técnico :80 |
| `auth.empresa.com` | Keycloak :8080 |
| `downloads.empresa.com` | Nginx File Server (instaladores) |

---

## Componente 10 — Stack de Observabilidade

**Responsabilidade:** Métricas, logs, alertas

| Serviço | Imagem | Função |
|---------|--------|--------|
| Prometheus | `prom/prometheus:v2.50.0` | Coleta e armazena métricas |
| Grafana | `grafana/grafana:10.3.0` | Visualização de dashboards |
| Loki | `grafana/loki:2.9.0` | Agregação de logs |
| Promtail | `grafana/promtail:2.9.0` | Agente de coleta de logs |
| Alertmanager | `prom/alertmanager` | Disparo de alertas por email/webhook |
| Node Exporter | `prom/node-exporter:v1.7.0` | Métricas do sistema operacional |
| cAdvisor | `gcr.io/cadvisor/cadvisor` | Métricas dos containers Docker |
