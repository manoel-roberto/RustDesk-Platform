# Modelo de Dados

> **Arquivo:** `specs/system/data-model.md`  
> **Versão:** 1.0.0

---

## 1. Diagrama de Entidades e Relacionamentos

```
┌─────────────────┐         ┌─────────────────────┐
│     users       │         │   device_groups     │
├─────────────────┤         ├─────────────────────┤
│ id (PK, UUID)   │         │ id (PK, UUID)       │
│ keycloak_id     │◄──┐     │ name                │
│ email           │   │     │ description         │
│ name            │   │     │ created_by (FK)  ───┼──► users.id
│ role            │   │     │ created_at          │
│ active          │   │     └──────────┬──────────┘
│ created_at      │   │                │ 1
│ updated_at      │   │                │
└────────┬────────┘   │                │ N
         │            │     ┌──────────▼──────────┐
         │ 1          │     │      devices        │
         │            │     ├─────────────────────┤
         │ N          │     │ id (PK, UUID)       │
┌────────▼────────┐   │     │ rustdesk_id (UNIQUE)│
│  device_access  │   │     │ alias               │
├─────────────────┤   │     │ hostname            │
│ id (PK, UUID)   │   │     │ os                  │
│ user_id (FK) ───┼───┘     │ os_version          │
│ device_id (FK)──┼─────────┼─► devices.id        │
│ group_id (FK) ──┼──────────── device_groups.id  │
│ level           │           │ ip_address          │
│                 │           │ group_id (FK)   ────┼──► device_groups.id
└─────────────────┘           │ password_hash       │
                              │ notes               │
                              │ tags (ARRAY)        │
                              │ last_seen_at        │
                              │ online              │
                              │ created_by (FK) ────┼──► users.id
                              │ created_at          │
                              │ updated_at          │
                              └──────────┬──────────┘
                                         │ 1
                                         │
                                         │ N
                              ┌──────────▼──────────┐
                              │      sessions       │
                              ├─────────────────────┤
                              │ id (PK, UUID)       │
                              │ device_id (FK)   ───┼──► devices.id
                              │ technician_id (FK) ─┼──► users.id
                              │ started_at          │
                              │ ended_at            │
                              │ duration_sec        │
                              │ relay_used          │
                              │ session_type        │
                              │ notes               │
                              └─────────────────────┘
```

---

## 2. Entidades Detalhadas

### 2.1 `users`

Armazena técnicos e administradores. Espelha usuários do Keycloak para joins locais.

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador primário (gerado localmente) |
| `keycloak_id` | UUID | Sim | Sub do token JWT — vínculo com Keycloak |
| `email` | VARCHAR(255) | Sim | Email único do usuário |
| `name` | VARCHAR(255) | Sim | Nome de exibição |
| `role` | VARCHAR(50) | Sim | `admin`, `technician`, `viewer`, `auditor` |
| `active` | BOOLEAN | Sim | Soft delete — `false` desativa sem remover |
| `created_at` | TIMESTAMPTZ | Sim | Timestamp de criação |
| `updated_at` | TIMESTAMPTZ | Sim | Timestamp de última atualização |

**Regras de negócio:**
- `keycloak_id` é único e imutável
- Desativar um usuário (`active = false`) não deve encerrar sessões ativas
- Role `admin` tem acesso implícito a todos os dispositivos

---

### 2.2 `device_groups`

Agrupamento lógico de dispositivos por cliente ou localização.

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador primário |
| `name` | VARCHAR(255) | Sim | Nome do grupo (ex: "Empresa XYZ — Matriz") |
| `description` | TEXT | Não | Descrição livre |
| `created_by` | UUID (FK) | Não | Referência ao usuário que criou |
| `created_at` | TIMESTAMPTZ | Sim | Timestamp de criação |

---

### 2.3 `devices`

Catálogo central de dispositivos gerenciados (address book).

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador primário interno |
| `rustdesk_id` | VARCHAR(20) | Sim | ID gerado pelo RustDesk (único) |
| `alias` | VARCHAR(255) | Não | Nome amigável (ex: "Servidor ERP - XYZ") |
| `hostname` | VARCHAR(255) | Não | Nome do computador na rede |
| `os` | VARCHAR(100) | Não | Sistema operacional (ex: "Windows") |
| `os_version` | VARCHAR(100) | Não | Versão do SO (ex: "Windows 11 Pro") |
| `ip_address` | INET | Não | Último IP registrado |
| `group_id` | UUID (FK) | Não | Grupo ao qual o dispositivo pertence |
| `password_hash` | VARCHAR(255) | Não | Hash da senha de acesso fixo do dispositivo |
| `notes` | TEXT | Não | Notas técnicas persistentes sobre o dispositivo |
| `tags` | TEXT[] | Não | Array de tags livres |
| `last_seen_at` | TIMESTAMPTZ | Não | Último timestamp de heartbeat |
| `online` | BOOLEAN | Sim | Status online atual (atualizado por webhook/polling) |
| `created_by` | UUID (FK) | Não | Técnico ou admin que cadastrou |
| `created_at` | TIMESTAMPTZ | Sim | Timestamp de criação |
| `updated_at` | TIMESTAMPTZ | Sim | Timestamp de última atualização |

**Regras de negócio:**
- `rustdesk_id` é único e imutável após o primeiro registro
- `online` é atualizado periodicamente pelo worker de status
- `password_hash` usa bcrypt — nunca armazenar em plain text

---

### 2.4 `device_access`

Controle de quais técnicos têm acesso a quais dispositivos e com qual nível.

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador primário |
| `user_id` | UUID (FK) | Sim | Referência ao técnico |
| `device_id` | UUID (FK) | Não | Acesso a dispositivo específico |
| `group_id` | UUID (FK) | Não | Acesso a grupo inteiro de dispositivos |
| `level` | VARCHAR(50) | Sim | `full`, `view_only`, `no_clipboard` |

**Regras de negócio:**
- Ou `device_id` ou `group_id` deve ser preenchido (nunca ambos, nunca nenhum)
- Acesso por grupo prevalece sobre acesso individual se mais permissivo
- Role `admin` ignora esta tabela — tem acesso total implícito

---

### 2.5 `sessions`

Registro histórico de todas as sessões remotas realizadas.

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador primário |
| `device_id` | UUID (FK) | Sim | Dispositivo acessado |
| `technician_id` | UUID (FK) | Sim | Técnico que realizou a sessão |
| `started_at` | TIMESTAMPTZ | Sim | Início da sessão |
| `ended_at` | TIMESTAMPTZ | Não | Fim da sessão (NULL = sessão ativa) |
| `duration_sec` | INTEGER | Não | Duração calculada em segundos |
| `relay_used` | BOOLEAN | Sim | Indica se o relay foi utilizado |
| `session_type` | VARCHAR(50) | Não | `support`, `deploy`, `training`, `maintenance` |
| `notes` | TEXT | Não | Notas do técnico sobre o atendimento |

**Regras de negócio:**
- `ended_at` NULL indica sessão ainda ativa
- `duration_sec` é calculado em trigger ou ao encerrar a sessão
- `session_type` é preenchido pelo técnico após a sessão

---

### 2.6 `audit_logs`

Registro imutável de ações administrativas para auditoria.

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador primário |
| `actor_id` | UUID (FK) | Sim | Usuário que executou a ação |
| `action` | VARCHAR(100) | Sim | Ação executada (ex: `device.create`, `user.deactivate`) |
| `resource_type` | VARCHAR(50) | Sim | Tipo do recurso afetado |
| `resource_id` | UUID | Não | ID do recurso afetado |
| `payload` | JSONB | Não | Dados relevantes da ação (diff, parâmetros) |
| `ip_address` | INET | Sim | IP de origem da requisição |
| `created_at` | TIMESTAMPTZ | Sim | Timestamp da ação |

**Regras de negócio:**
- Registros de audit são **imutáveis** — sem UPDATE ou DELETE
- Todos os endpoints de escrita da API devem gerar um audit_log

---

## 3. Índices de Performance

```sql
-- Busca de dispositivos por rustdesk_id (muito frequente)
CREATE UNIQUE INDEX idx_devices_rustdesk_id ON devices(rustdesk_id);

-- Filtro de dispositivos online
CREATE INDEX idx_devices_online ON devices(online) WHERE online = true;

-- Busca de dispositivos por grupo
CREATE INDEX idx_devices_group ON devices(group_id);

-- Busca full-text em alias e hostname
CREATE INDEX idx_devices_search ON devices USING gin(to_tsvector('portuguese', coalesce(alias,'') || ' ' || coalesce(hostname,'')));

-- Histórico de sessões por técnico (paginado, mais recente primeiro)
CREATE INDEX idx_sessions_technician ON sessions(technician_id, started_at DESC);

-- Histórico de sessões por dispositivo
CREATE INDEX idx_sessions_device ON sessions(device_id, started_at DESC);

-- Sessões ativas (sem ended_at)
CREATE INDEX idx_sessions_active ON sessions(ended_at) WHERE ended_at IS NULL;

-- Audit log por ator e data
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
```
