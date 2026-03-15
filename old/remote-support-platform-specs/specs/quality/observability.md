# Observabilidade

> **Arquivo:** `specs/quality/observability.md`  
> **Versão:** 1.0.0

---

## 1. Pilares da Observabilidade

A plataforma implementa os três pilares clássicos de observabilidade:

```
┌──────────────────────────────────────────────────────────────┐
│                     OBSERVABILIDADE                           │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐   │
│  │   MÉTRICAS  │   │    LOGS     │   │    RASTREAMENTO   │   │
│  │             │   │             │   │                   │   │
│  │ Prometheus  │   │    Loki     │   │  OpenTelemetry    │   │
│  │ + Grafana   │   │  + Promtail │   │  (futuro v2.0)    │   │
│  │             │   │  + Grafana  │   │                   │   │
│  └─────────────┘   └─────────────┘   └──────────────────┘   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ALERTAS: Alertmanager → Email / Webhook / Slack       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Métricas (Prometheus)

### 2.1 Métricas de Sistema (Node Exporter)

| Métrica | Alerta em |
|---------|-----------|
| `node_cpu_seconds_total` | CPU > 80% por 10min |
| `node_memory_MemAvailable_bytes` | Memória < 10% |
| `node_filesystem_avail_bytes` | Disco < 15% |
| `node_network_receive_bytes_total` | Anomalia de tráfego |
| `node_load1` | Load > N vCPUs por 5min |

### 2.2 Métricas de Containers (cAdvisor)

| Métrica | Alerta em |
|---------|-----------|
| `container_memory_usage_bytes` | Container usando > 90% do limit |
| `container_cpu_usage_seconds_total` | Container thrashing |
| `container_last_seen` | Container parou |

### 2.3 Métricas da API (Custom Prometheus)

Implementar no módulo `MetricsModule` da API:

```typescript
// Contador de requisições HTTP
api_http_requests_total{method, path, status_code}

// Histograma de latência
api_http_request_duration_seconds{method, path}
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]

// Sessões remotas ativas
api_active_sessions_total

// Dispositivos online
api_devices_online_total

// Total de dispositivos cadastrados
api_devices_total

// Tentativas de login falhadas
api_login_failures_total{reason}
```

### 2.4 Métricas do RustDesk (Proxy via Parsing de Logs)

Como o hbbs/hbbr não expõe Prometheus nativamente, usar `mtail` ou `promtail` para extrair métricas de logs:

```
rustdesk_registered_devices_total    ← Dispositivos registrados no hbbs
rustdesk_active_connections_total    ← Conexões ativas no hbbr
rustdesk_relay_sessions_total        ← Total de sessões via relay
rustdesk_direct_sessions_total       ← Total de sessões diretas (P2P)
```

---

## 3. Logs (Loki + Promtail)

### 3.1 Formato de Logs

Todos os serviços devem emitir logs em **JSON estruturado**:

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "service": "api",
  "message": "Device connection initiated",
  "context": {
    "device_id": "uuid",
    "technician_id": "uuid",
    "ip": "192.168.1.10",
    "trace_id": "abc123"
  }
}
```

### 3.2 Níveis de Log por Situação

| Nível | Quando usar |
|-------|-------------|
| `error` | Exceções não tratadas, falhas de banco, erros de integração |
| `warn` | Rate limit atingido, tentativa de acesso não autorizado, retry |
| `info` | Início/fim de sessão, criação/edição de entidades, login |
| `debug` | Detalhes de execução (apenas em desenvolvimento) |

### 3.3 Campos de Log Obrigatórios (API)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `timestamp` | ISO 8601 | Timestamp da entrada |
| `level` | string | `error`, `warn`, `info`, `debug` |
| `service` | string | Nome do serviço (ex: `api`, `hbbs`) |
| `message` | string | Mensagem descritiva |
| `request_id` | string | ID único da requisição HTTP |
| `user_id` | UUID | ID do usuário (quando autenticado) |
| `ip` | string | IP de origem da requisição |
| `method` | string | Método HTTP |
| `path` | string | Rota da API |
| `status` | integer | Código de status HTTP |
| `duration_ms` | integer | Duração da requisição em ms |

### 3.4 O Que NÃO Logar (Dados Sensíveis)

```
❌ Senhas (mesmo que incorretas)
❌ Tokens JWT completos
❌ Conteúdo de sessões remotas
❌ Dados pessoais de clientes além do ID
❌ Credenciais de banco de dados
```

---

## 4. Dashboards Grafana

### 4.1 Dashboard: Visão Executiva

| Painel | Visualização | Período |
|--------|-------------|---------|
| Sessões por dia | Gráfico de barras | 30 dias |
| Dispositivos online agora | Stat panel | Tempo real |
| Top 10 dispositivos mais acessados | Tabela | 7 dias |
| Sessões por tipo | Pie chart | 30 dias |
| Técnicos mais ativos | Tabela | 30 dias |

### 4.2 Dashboard: Saúde do Sistema

| Painel | Métrica | Threshold |
|--------|---------|-----------|
| CPU do servidor | node_cpu | Verde < 60%, Amarelo < 80%, Vermelho > 80% |
| Memória disponível | node_memory | Verde > 30%, Amarelo > 10%, Vermelho < 10% |
| Disco disponível | node_filesystem | Verde > 30%, Amarelo > 15%, Vermelho < 15% |
| Status dos containers | container_last_seen | Verde = ativo, Vermelho = parado |
| Latência P95 da API | http_request_duration | Verde < 300ms, Vermelho > 1s |
| Taxa de erros API | http_requests_total{5xx} | Verde < 1%, Vermelho > 5% |

### 4.3 Dashboard: Segurança

| Painel | Métrica |
|--------|---------|
| Tentativas de login falhadas / hora | `api_login_failures_total` |
| IPs bloqueados pelo Fail2Ban | Log do Fail2Ban via Promtail |
| Requisições 403 (acesso negado) | `http_requests_total{status="403"}` |
| Picos de rate limiting | `http_requests_total{status="429"}` |

---

## 5. Alertas (Alertmanager)

### 5.1 Alertas Críticos (P0 — Notificar imediatamente)

| Alerta | Condição | Canal |
|--------|----------|-------|
| `HbbsDown` | hbbs offline por 2+ min | Email + Webhook |
| `HbbrDown` | hbbr offline por 2+ min | Email + Webhook |
| `PostgresDown` | Banco offline por 1+ min | Email + Webhook |
| `DiskCritical` | Disco < 5% disponível | Email + Webhook |
| `APIDown` | API offline por 2+ min | Email + Webhook |

### 5.2 Alertas de Atenção (P1 — Notificar em até 30min)

| Alerta | Condição | Canal |
|--------|----------|-------|
| `HighCPU` | CPU > 80% por 10+ min | Email |
| `DiskWarning` | Disco < 15% disponível | Email |
| `HighAPILatency` | P95 > 2s por 5+ min | Email |
| `HighErrorRate` | Taxa de erro > 5% por 5+ min | Email |
| `BackupFailed` | Backup sem sucesso por 24h | Email |

### 5.3 Configuração do Alertmanager

```yaml
# monitoring/alertmanager/alertmanager.yml
global:
  smtp_smarthost: 'smtp.empresa.com:587'
  smtp_from: 'alertas@empresa.com'
  smtp_auth_username: 'alertas@empresa.com'
  smtp_auth_password: '${SMTP_PASSWORD}'

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'ops-team'
  
  routes:
    - match:
        severity: critical
      receiver: 'ops-team-critical'
      repeat_interval: 30m

receivers:
  - name: 'ops-team'
    email_configs:
      - to: 'fernanda@empresa.com'
        subject: '[{{ .Status | toUpper }}] {{ .CommonAnnotations.summary }}'
        
  - name: 'ops-team-critical'
    email_configs:
      - to: 'fernanda@empresa.com, ti@empresa.com'
    webhook_configs:
      - url: '${WEBHOOK_URL}'
```

---

## 6. Retenção de Dados de Observabilidade

| Dado | Ferramenta | Retenção |
|------|-----------|----------|
| Métricas | Prometheus | 30 dias (TSDB local) |
| Logs | Loki | 15 dias |
| Dashboards | Grafana | Permanente (configs em git) |
| Audit logs (banco) | PostgreSQL | Permanente (retidos com os dados) |
