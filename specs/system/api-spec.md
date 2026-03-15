# Especificação da API REST

> **Arquivo:** `specs/system/api-spec.md`  
> **Versão:** 1.0.0  
> **Base URL:** `https://api.empresa.com/api/v1`  
> **Autenticação:** Bearer Token (JWT emitido pelo Keycloak)  
> **Formato:** JSON em todas as requisições e respostas

---

## Convenções

- **IDs** são UUIDs v4
- **Datas** são ISO 8601 com timezone (`2025-01-15T10:30:00Z`)
- **Erros** seguem o formato `{ "statusCode": N, "message": "...", "error": "..." }`
- **Paginação** usa query params `?page=1&limit=20`
- **Ordenação** usa `?sortBy=created_at&order=desc`

### Códigos de Status Padrão

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 204 | Sucesso sem conteúdo |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Sem permissão (RBAC) |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: duplicado) |
| 429 | Rate limit excedido |
| 500 | Erro interno |

---

## Módulo: Autenticação

### API-AUTH-001 — Verificar Token

**Endpoint:** `GET /auth/me`  
**Auth:** Bearer Token  
**Roles:** Qualquer usuário autenticado

**Resposta 200:**
```json
{
  "id": "uuid",
  "keycloak_id": "uuid",
  "email": "carlos@empresa.com",
  "name": "Carlos Mendes",
  "role": "technician",
  "active": true
}
```

### API-AUTH-002 — Health Check da API

**Endpoint:** `GET /health`  
**Auth:** Não requer  

**Resposta 200:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "keycloak": "ok"
  }
}
```

---

## Módulo: Dispositivos

### API-DEV-001 — Listar Dispositivos

**Endpoint:** `GET /devices`  
**Auth:** Bearer Token  
**Roles:** `admin`, `technician`, `viewer`  
**Nota:** Técnicos recebem apenas dispositivos que têm permissão de acesso.

**Query Params:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | integer | Página (default: 1) |
| `limit` | integer | Itens por página (default: 20, max: 100) |
| `groupId` | UUID | Filtrar por grupo |
| `online` | boolean | Filtrar por status online |
| `search` | string | Busca por alias ou hostname |
| `tag` | string | Filtrar por tag |

**Resposta 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "rustdesk_id": "123456789",
      "alias": "Servidor ERP - Empresa XYZ",
      "hostname": "SRV-XYZ-01",
      "os": "Windows",
      "os_version": "Windows Server 2019",
      "online": true,
      "last_seen_at": "2025-01-15T10:25:00Z",
      "tags": ["servidor", "critico"],
      "group": {
        "id": "uuid",
        "name": "Empresa XYZ"
      }
    }
  ],
  "meta": {
    "total": 87,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### API-DEV-002 — Obter Dispositivo por ID

**Endpoint:** `GET /devices/:id`  
**Auth:** Bearer Token  
**Roles:** `admin`, `technician`, `viewer`

**Resposta 200:**
```json
{
  "id": "uuid",
  "rustdesk_id": "123456789",
  "alias": "Servidor ERP - Empresa XYZ",
  "hostname": "SRV-XYZ-01",
  "os": "Windows",
  "os_version": "Windows Server 2019",
  "ip_address": "192.168.1.100",
  "online": true,
  "last_seen_at": "2025-01-15T10:25:00Z",
  "notes": "Reiniciar apenas fora do horário comercial",
  "tags": ["servidor", "critico"],
  "group": { "id": "uuid", "name": "Empresa XYZ" },
  "access_level": "full",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### API-DEV-003 — Criar Dispositivo

**Endpoint:** `POST /devices`  
**Auth:** Bearer Token  
**Roles:** `admin`

**Request Body:**
```json
{
  "rustdesk_id": "123456789",
  "alias": "PC do Gerente - XYZ",
  "hostname": "PC-GERENTE-01",
  "group_id": "uuid",
  "tags": ["gerencia"],
  "notes": "Máquina do gerente financeiro"
}
```

**Resposta 201:** Objeto do dispositivo criado  
**Resposta 409:** `{ "message": "rustdesk_id já cadastrado" }`

---

### API-DEV-004 — Atualizar Dispositivo

**Endpoint:** `PATCH /devices/:id`  
**Auth:** Bearer Token  
**Roles:** `admin`

**Request Body:** (todos os campos são opcionais)
```json
{
  "alias": "Novo alias",
  "group_id": "uuid",
  "tags": ["tag1", "tag2"],
  "notes": "Notas atualizadas"
}
```

**Resposta 200:** Objeto do dispositivo atualizado

---

### API-DEV-005 — Remover Dispositivo

**Endpoint:** `DELETE /devices/:id`  
**Auth:** Bearer Token  
**Roles:** `admin`

**Resposta 204:** Sem conteúdo  
**Nota:** Soft delete — `active = false`. Histórico de sessões preservado.

---

### API-DEV-006 — Gerar Link de Conexão

**Endpoint:** `POST /devices/:id/connect`  
**Auth:** Bearer Token  
**Roles:** `admin`, `technician`

**Resposta 200:**
```json
{
  "rustdesk_id": "123456789",
  "deep_link": "rustdesk://123456789",
  "access_level": "full",
  "expires_at": "2025-01-15T11:00:00Z"
}
```

**Resposta 403:** Técnico sem permissão para este dispositivo  
**Resposta 422:** Dispositivo offline

---

## Módulo: Grupos

### API-GRP-001 — Listar Grupos

**Endpoint:** `GET /groups`  
**Auth:** Bearer Token  
**Roles:** `admin`, `technician`

**Resposta 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Empresa XYZ",
      "description": "Grupo de dispositivos da Empresa XYZ",
      "device_count": 12,
      "online_count": 8
    }
  ]
}
```

### API-GRP-002 — Criar Grupo

**Endpoint:** `POST /groups`  
**Auth:** Bearer Token  
**Roles:** `admin`

```json
{
  "name": "Empresa ABC — Filial SP",
  "description": "Dispositivos da filial São Paulo"
}
```

---

## Módulo: Sessões

### API-SES-001 — Listar Sessões

**Endpoint:** `GET /sessions`  
**Auth:** Bearer Token  
**Roles:** `admin`, `auditor` (todas as sessões); `technician` (apenas as suas)

**Query Params:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `deviceId` | UUID | Filtrar por dispositivo |
| `technicianId` | UUID | Filtrar por técnico (admin only) |
| `from` | ISO Date | Data de início |
| `to` | ISO Date | Data de fim |
| `type` | string | `support`, `deploy`, `training`, `maintenance` |
| `active` | boolean | Apenas sessões ativas (sem ended_at) |

### API-SES-002 — Iniciar Sessão

**Endpoint:** `POST /sessions`  
**Auth:** Bearer Token  
**Roles:** `admin`, `technician`

```json
{
  "device_id": "uuid",
  "session_type": "support"
}
```

**Resposta 201:**
```json
{
  "id": "uuid",
  "device_id": "uuid",
  "technician_id": "uuid",
  "started_at": "2025-01-15T10:30:00Z",
  "relay_used": false
}
```

### API-SES-003 — Encerrar Sessão

**Endpoint:** `PATCH /sessions/:id/close`  
**Auth:** Bearer Token  
**Roles:** `admin`, `technician` (apenas sessões próprias)

```json
{
  "notes": "Problema resolvido — atualização do ERP aplicada",
  "session_type": "deploy"
}
```

---

## Módulo: Usuários

### API-USR-001 — Listar Usuários

**Endpoint:** `GET /users`  
**Roles:** `admin`

### API-USR-002 — Criar Usuário

**Endpoint:** `POST /users`  
**Roles:** `admin`

```json
{
  "email": "novo.tecnico@empresa.com",
  "name": "João Técnico",
  "role": "technician",
  "group_ids": ["uuid1", "uuid2"]
}
```

**Efeito colateral:** Cria usuário no Keycloak e dispara email de boas-vindas.

### API-USR-003 — Desativar Usuário

**Endpoint:** `PATCH /users/:id/deactivate`  
**Roles:** `admin`

**Efeito colateral:** Desativa o usuário no Keycloak (sem delete).

---

## Módulo: Métricas (interno)

### API-MET-001 — Exportar Métricas Prometheus

**Endpoint:** `GET /metrics`  
**Auth:** Não requer (apenas acessível na rede interna Docker)  
**Content-Type:** `text/plain`

**Métricas expostas:**
- `api_http_requests_total{method,path,status}`
- `api_http_request_duration_seconds{method,path}` (histogram)
- `api_active_sessions_total`
- `api_devices_online_total`
- `api_devices_total`
