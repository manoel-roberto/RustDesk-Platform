# Visão Geral do Sistema

> **Arquivo:** `specs/system/system-overview.md`  
> **Versão:** 1.0.0

---

## 1. Arquitetura Geral

A plataforma é composta por três camadas principais:

1. **Camada de Protocolo Remoto** — RustDesk (hbbs + hbbr)
2. **Camada de Aplicação** — API REST + Portais Web
3. **Camada de Suporte** — Autenticação, Banco, Cache, Observabilidade

### Diagrama de Componentes

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                            INTERNET                                         ║
║                                                                              ║
║  ┌─────────────────────┐        ┌──────────────────────────────────────┐   ║
║  │  CLIENTE WINDOWS    │        │  TÉCNICO (Navegador)                 │   ║
║  │  RustDesk Client    │        │  Portal Web + Deep Link rustdesk://  │   ║
║  │  (White-label)      │        │                                      │   ║
║  └──────────┬──────────┘        └───────────────────┬──────────────────┘   ║
║             │ TCP/UDP 21115-21119                    │ HTTPS 443            ║
╚═════════════╪═══════════════════════════════════════╪══════════════════════╝
              │                                       │
╔═════════════╪═══════════════════════════════════════╪══════════════════════╗
║             ▼                                       ▼                       ║
║  ┌────────────────────────────────────────────────────────────────────────┐ ║
║  │              NGINX (Reverse Proxy + TLS Termination)                   │ ║
║  │         Let's Encrypt | Rate Limiting | Security Headers               │ ║
║  └──────────┬──────────────────────────┬───────────────────┬─────────────┘ ║
║             │                          │                   │               ║
║  ┌──────────▼──────────┐  ┌────────────▼────────┐  ┌──────▼──────────┐   ║
║  │  hbbs (ID Server)   │  │  API Server          │  │  Portais Web    │   ║
║  │  Port 21115–21118   │  │  NestJS :3000        │  │  React :80      │   ║
║  │  Registro de IDs    │  │  REST API            │  │  Admin Portal   │   ║
║  │  NAT Traversal      │  │  Address Book        │  │  Tech Portal    │   ║
║  └──────────┬──────────┘  │  Auth + RBAC         │  └─────────────────┘   ║
║             │              │  Device Mgmt         │                        ║
║  ┌──────────▼──────────┐  │  Session Tracking    │                        ║
║  │  hbbr (Relay)       │  └────────────┬─────────┘                        ║
║  │  Port 21117–21119   │               │                                   ║
║  │  Relay de Sessões   │  ┌────────────▼─────────┐  ┌─────────────────┐   ║
║  │  E2E Criptografado  │  │  PostgreSQL 16        │  │  Keycloak       │   ║
║  └─────────────────────┘  │  Banco de Dados       │  │  Auth / SSO     │   ║
║                            └──────────────────────┘  │  MFA / RBAC    │   ║
║                                                       └─────────────────┘   ║
║                            ┌──────────────────────┐                        ║
║                            │  Redis 7             │                        ║
║                            │  Cache / Sessões     │                        ║
║                            └──────────────────────┘                        ║
║                                                                              ║
║  ┌─────────────────────────────────────────────────────────────────────┐   ║
║  │  OBSERVABILIDADE                                                      │   ║
║  │  Prometheus :9090 | Grafana :3001 | Loki :3100 | Alertmanager       │   ║
║  └─────────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 2. Fluxos Principais

### 2.1 Fluxo de Registro de Dispositivo

```
Cliente Windows              hbbs (ID Server)            Banco de Dados
      │                            │                           │
      │── TCP 21115: register ────►│                           │
      │   {id, pubkey, ip, port}   │                           │
      │                            │── INSERT device_online ──►│
      │◄── registration ACK ───────│                           │
      │                            │                           │
      │── UDP 21116: heartbeat ───►│ (keepalive a cada 30s)   │
```

### 2.2 Fluxo de Conexão Remota

```
Técnico (RustDesk)         hbbs                    Cliente
      │                      │                         │
      │── request_conn(id) ─►│                         │
      │                      │── punch_hole ──────────►│
      │                      │── peer_info(ip,port) ──►│ (técnico)
      │                      │                         │
      │◄════════════════ Tentativa P2P (UDP) ══════════│
      │           [sucesso: sem relay]                  │
      │                                                 │
      │◄══ [fallback] ══ hbbr Relay ══════════════════►│
           [todo tráfego criptografado E2E]
```

### 2.3 Fluxo de Autenticação Web

```
Navegador          Portal Web         Keycloak           API Server
    │                   │                  │                   │
    │── GET /portal ───►│                  │                   │
    │◄── redirect ──────│                  │                   │
    │── auth_request ──────────────────►  │                   │
    │◄── login_page ──────────────────── │                   │
    │── credentials + TOTP ────────────► │                   │
    │◄── tokens (JWT) ─────────────────── │                   │
    │── token ─────────►│                  │                   │
    │                   │── Bearer token ──────────────────► │
    │                   │◄── 200 + data ──────────────────── │
    │◄── interface ─────│                  │                   │
```

---

## 3. Decisões de Arquitetura

### ADR-001: RustDesk OSS como protocolo de acesso remoto

**Decisão:** Usar RustDesk Open Source (AGPL) como base do protocolo remoto.  
**Justificativa:** Protocolo auditável, E2E criptografado, cliente multiplataforma, sem custo.  
**Consequência:** Funcionalidades avançadas (ex: gravação de sessão) exigem extensão customizada.

### ADR-002: NestJS para API

**Decisão:** Implementar a API com NestJS (Node.js + TypeScript).  
**Justificativa:** Modularidade, decorators para RBAC/Auth, suporte nativo a OpenAPI/Swagger, ecossistema maduro.  
**Consequência:** Equipe precisa de conhecimento em TypeScript e IoC/DI pattern.

### ADR-003: Keycloak para Identidade

**Decisão:** Usar Keycloak como Identity Provider (IdP).  
**Justificativa:** SSO, MFA, RBAC, federação com AD/LDAP — tudo open source e self-hosted.  
**Consequência:** Overhead de operação do Keycloak (Java, memória, configuração).

### ADR-004: Monolito Modular na v1.0

**Decisão:** A API na v1.0 é um monolito modular (não microsserviços).  
**Justificativa:** Reduz complexidade operacional para equipe pequena. Módulos bem definidos permitem extração futura.  
**Consequência:** Escala vertical mais simples; extração de microsserviços possível no v2.0+.

---

## 4. Princípios de Design

| Princípio | Aplicação |
|-----------|-----------|
| **API First** | A API é especificada antes da implementação do frontend |
| **Security by Default** | TLS obrigatório, MFA obrigatório, RBAC em todos os endpoints |
| **Observabilidade First** | Todo serviço expõe métricas Prometheus e logs estruturados |
| **Infra como Código** | Docker Compose versionado como única fonte de verdade da infra |
| **Falha Isolada** | Falha de um componente não deve derrubar toda a plataforma |
