# Roadmap Técnico

> **Arquivo:** `specs/roadmap/technical-roadmap.md`  
> **Versão:** 1.0.0

---

## v1.0 — Plataforma Core (Semanas 1–12)

**Tema:** Substituir ferramentas comerciais na operação interna.

### Componentes Entregues

| Componente | Tecnologia | Status |
|-----------|-----------|--------|
| ID Server + Relay | RustDesk OSS (Docker) | Planejado |
| API Server | NestJS + TypeScript | Planejado |
| Banco de Dados | PostgreSQL 16 | Planejado |
| Cache | Redis 7 | Planejado |
| Autenticação + MFA | Keycloak 24 | Planejado |
| Reverse Proxy | Nginx 1.25 | Planejado |
| Portal Admin | React + Vite + TypeScript | Planejado |
| Portal Técnico | React + Vite + TypeScript | Planejado |
| Observabilidade | Prometheus + Grafana + Loki | Planejado |
| CI/CD Infra | GitHub Actions | Planejado |
| Build do Cliente | Rust + Flutter + NSIS | Planejado |
| Backup | Shell script + S3 | Planejado |

### Débito Técnico Aceito na v1.0

- Monolito modular (não microsserviços) — aceitável para escala atual
- Status online dos dispositivos via polling (não push) — simplifica implementação
- Sem gravação de sessões — não requerido no escopo v1.0
- Frontend sem testes E2E completos (apenas smoke tests)

---

## v1.1 — Estabilidade e Polimento (Semanas 13–16)

**Tema:** Corrigir débito técnico e melhorar experiência do usuário.

### Evoluções Técnicas

| Item | Descrição | Motivação |
|------|-----------|-----------|
| WebSockets para status de dispositivos | Substituir polling por push em tempo real | Performance + UX |
| Refresh automático do status no portal | Sem necessidade de reload de página | UX |
| Internacionalização (PT-BR) | i18n nos portais React | Qualidade |
| Testes E2E completos com Cypress | Aumentar confiança em deploys | Qualidade |
| Relatórios básicos em PDF | Exportar histórico de sessões | Funcionalidade |
| Notificações por email de boas-vindas | Email personalizado ao criar técnico | UX |
| Paginação cursor-based na API | Melhor performance em listas grandes | Performance |

---

## v2.0 — Plataforma Enterprise (Trimestres 2–3)

**Tema:** Adicionar funcionalidades enterprise e escalar a infraestrutura.

### Funcionalidades

| Funcionalidade | Descrição | Complexidade |
|---------------|-----------|-------------|
| Federação com Active Directory | Keycloak + LDAP sync | Alta |
| Múltiplos relay servers | Distribuição geográfica | Média |
| Agendamento de sessões | Calendário de atendimento com notificações | Alta |
| Inventário de dispositivos | Coletar SO, hardware, software instalado | Alta |
| Dashboard por cliente | Visão de saúde por empresa atendida | Média |
| Webhooks de sessão | Notificar sistemas externos (ERP) ao iniciar/encerrar sessão | Média |
| 2FA por SMS (backup) | Alternativa ao TOTP via SMS | Média |
| Controle de horário de acesso | Técnico só acessa dispositivo em horário permitido | Média |

### Evoluções de Infraestrutura

| Evolução | Descrição | Motivação |
|----------|-----------|-----------|
| PostgreSQL com replicação | Standby read-replica | Alta disponibilidade |
| Redis Sentinel | HA para o cache | Alta disponibilidade |
| Múltiplos nós de API | Load balancing com Nginx upstream | Escalabilidade |
| Kubernetes (opcional) | Para ambientes com orquestração existente | Escalabilidade |
| CDN para portal web | Cachear assets estáticos | Performance |
| Migrações sem downtime | Blue-green deploy | Disponibilidade |

### Evoluções de Segurança

| Evolução | Descrição |
|----------|-----------|
| OpenTelemetry | Rastreamento distribuído de requisições |
| Anomaly detection nos logs | Alerta automático em padrões suspeitos |
| Política de retenção de audit log | Arquivamento automático para cold storage |
| Pen test externo | Validação de segurança por terceiros |

---

## v3.0 — Plataforma SaaS Interna Multi-tenant (Ano 2)

**Tema:** Oferecer a plataforma como produto para múltiplos clientes ERP.

### Arquitetura Multi-tenant

```
Abordagem escolhida: Database-per-tenant
(Isolamento máximo — schema separado por cliente no PostgreSQL)

┌─────────────────────────────────────────────────────┐
│  API Gateway (tenant routing via header/subdomain)   │
└───────────────────────────┬─────────────────────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
    ┌─────────▼───┐  ┌──────▼──────┐  ┌───▼─────────┐
    │ DB: clienteA │  │ DB: clienteB│  │ DB: clienteC│
    └─────────────┘  └─────────────┘  └─────────────┘
```

### Funcionalidades v3.0

| Funcionalidade | Descrição |
|---------------|-----------|
| Portal self-service do cliente | Cliente ERP gerencia seus próprios dispositivos |
| Billing por volume | Cobrança por dispositivos ativos ou sessões |
| SLA tier por cliente | Diferentes níveis de suporte por contrato |
| API pública documentada | Swagger/OpenAPI para integrações de terceiros |
| White-label do portal | Cliente vê o portal com seu próprio branding |
| Auditoria cross-tenant | Admin global vê logs de todos os tenants |

---

## Dívida Técnica Planejada para Endereçamento

| Item | Versão Alvo | Impacto |
|------|-------------|---------|
| Migrar polling para WebSocket | v1.1 | Performance |
| Cobertura de testes E2E | v1.1 | Confiabilidade |
| Extrair worker de status para serviço separado | v2.0 | Escalabilidade |
| Implementar OpenTelemetry completo | v2.0 | Observabilidade |
| Migrar para arquitetura multi-tenant | v3.0 | Produto |

---

## Critérios de Upgrade de Versão

| De | Para | Gatilho |
|----|------|---------|
| v1.0 → v1.1 | v1.1 disponível | ≥ 2 meses em produção estável |
| v1.1 → v2.0 | ≥ 300 dispositivos | Demanda real de escala |
| v2.0 → v3.0 | Interesse de mercado | Decisão estratégica de produto |
