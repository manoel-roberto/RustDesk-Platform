# Arquitetura de Implantação

> **Arquivo:** `specs/infra/deployment-architecture.md`  
> **Versão:** 1.0.0

---

## 1. Visão Geral da Infraestrutura

### 1.1 Topologia de Produção

```
                        ┌─────────────────────────────────────────────┐
                        │              PROVEDOR CLOUD / VPS            │
                        │         (DigitalOcean / AWS / Hetzner)       │
                        │                                               │
                        │  ┌─────────────────────────────────────────┐ │
                        │  │     SERVIDOR PRINCIPAL (Linux)           │ │
                        │  │     Ubuntu 22.04 LTS / Debian 12         │ │
                        │  │     4 vCPU | 8 GB RAM | 100 GB NVMe SSD │ │
                        │  │                                           │ │
                        │  │  ┌──────────────────────────────────┐    │ │
                        │  │  │    DOCKER ENGINE                  │    │ │
                        │  │  │                                   │    │ │
                        │  │  │  ┌─────────┐  ┌──────────────┐  │    │ │
                        │  │  │  │  hbbs   │  │    hbbr      │  │    │ │
                        │  │  │  │ :21115+ │  │ :21117+      │  │    │ │
                        │  │  │  └─────────┘  └──────────────┘  │    │ │
                        │  │  │                                   │    │ │
                        │  │  │  ┌─────────┐  ┌──────────────┐  │    │ │
                        │  │  │  │  Nginx  │  │  Keycloak    │  │    │ │
                        │  │  │  │ :80/443 │  │ :8080        │  │    │ │
                        │  │  │  └─────────┘  └──────────────┘  │    │ │
                        │  │  │                                   │    │ │
                        │  │  │  ┌─────────┐  ┌──────────────┐  │    │ │
                        │  │  │  │   API   │  │  React Apps  │  │    │ │
                        │  │  │  │ :3000   │  │ Admin/Tech   │  │    │ │
                        │  │  │  └─────────┘  └──────────────┘  │    │ │
                        │  │  │                                   │    │ │
                        │  │  │  ┌─────────┐  ┌──────────────┐  │    │ │
                        │  │  │  │Postgres │  │   Redis      │  │    │ │
                        │  │  │  │ :5432   │  │ :6379        │  │    │ │
                        │  │  │  └─────────┘  └──────────────┘  │    │ │
                        │  │  │                                   │    │ │
                        │  │  │  ┌────────────────────────────┐  │    │ │
                        │  │  │  │  MONITORING STACK          │  │    │ │
                        │  │  │  │  Prometheus | Grafana      │  │    │ │
                        │  │  │  │  Loki | Alertmanager       │  │    │ │
                        │  │  │  └────────────────────────────┘  │    │ │
                        │  │  └──────────────────────────────────┘    │ │
                        │  │                                           │ │
                        │  │  Volumes: /opt/remote-support/            │ │
                        │  │  Backups: /opt/backups/ → S3 offsite     │ │
                        │  └─────────────────────────────────────────┘ │
                        └─────────────────────────────────────────────┘
```

### 1.2 Configurações Mínimas e Recomendadas

| Recurso | MVP Mínimo | Produção Padrão | Produção Plus |
|---------|------------|-----------------|---------------|
| vCPU | 2 | 4 | 8 |
| RAM | 4 GB | 8 GB | 16 GB |
| Disco | 40 GB SSD | 100 GB NVMe | 200 GB NVMe |
| Banda | 100 Mbps | 500 Mbps | 1 Gbps |
| Dispositivos | < 200 | 100–500 | 500–1000 |
| Sessões simultâneas | 5 | 20 | 50 |

---

## 2. Rede e DNS

### 2.1 Registros DNS Obrigatórios

| Hostname | Tipo | Destino | Uso |
|----------|------|---------|-----|
| `suporte.empresa.com` | A | IP do servidor | hbbs (embedded no cliente) |
| `relay.empresa.com` | A | IP do servidor | hbbr (embedded no cliente) |
| `api.empresa.com` | A | IP do servidor | API REST |
| `admin.empresa.com` | A | IP do servidor | Portal Admin |
| `portal.empresa.com` | A | IP do servidor | Portal Técnico |
| `auth.empresa.com` | A | IP do servidor | Keycloak |
| `downloads.empresa.com` | A | IP do servidor | Distribuição do cliente |

### 2.2 Rede Interna Docker

```yaml
# Subnet privada Docker — serviços se comunicam por nome
network: support-net (172.20.0.0/24)

IPs fixos:
  172.20.0.10  hbbs
  172.20.0.11  hbbr
  172.20.0.20  postgres
  172.20.0.21  redis
  172.20.0.30  keycloak
  172.20.0.40  api
  172.20.0.50  nginx
```

---

## 3. Volumes e Persistência de Dados

| Volume Docker | Dados Armazenados | Backup |
|---------------|-------------------|--------|
| `rustdesk-hbbs-data` | Chaves RSA id_ed25519 + id_ed25519.pub | Crítico — backup diário |
| `postgres-data` | Todos os dados da plataforma | Crítico — backup diário |
| `redis-data` | Cache (não-crítico, efêmero) | Não requerido |
| `keycloak-data` | Configurações do realm (espelho do banco) | Backup diário |
| `nginx-certs` | Certificados TLS (Let's Encrypt) | Renovação automática |

### 3.1 Localização no Host

```
/opt/remote-support/           ← Repositório + configurações (versionado)
/opt/backups/remote-support/   ← Backups locais (30 dias)
/var/lib/docker/volumes/       ← Volumes Docker gerenciados
```

---

## 4. Certificados TLS

### 4.1 Let's Encrypt com Certbot

```bash
# Instalação inicial de certificados
certbot certonly \
  --nginx \
  --agree-tos \
  --email admin@empresa.com \
  -d suporte.empresa.com \
  -d relay.empresa.com \
  -d api.empresa.com \
  -d admin.empresa.com \
  -d portal.empresa.com \
  -d auth.empresa.com \
  -d downloads.empresa.com

# Renovação automática via cron (já configurado pelo certbot)
# 0 0,12 * * * certbot renew --quiet
```

---

## 5. Topologia Multi-Relay (Escalabilidade)

Para suportar 1000+ dispositivos ou distribuição geográfica:

```
                    hbbs (único — pode ser HA com shared storage)
                      │
          RELAY=relay1:21117,relay2:21117,relay3:21117
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐  ┌─────▼────┐  ┌────▼────┐
   │ hbbr-SP │  │ hbbr-RJ  │  │ hbbr-RS │
   │Sao Paulo│  │Rio Jan.  │  │Rio Gde. │
   └─────────┘  └──────────┘  └─────────┘
   
hbbs seleciona o relay com menor latência para cada sessão
```

---

## 6. Diagrama de Deploy do CI/CD

```
Desenvolvedor faz git push / cria tag
         │
         ▼
GitHub Actions Pipeline
   ├── Lint + Tests
   ├── docker build
   ├── Push para registry
   └── Deploy via SSH
            │
            ▼
Servidor de Produção
   ├── git pull (configs)
   ├── docker compose pull (images)
   ├── docker compose up -d
   └── healthcheck.sh
```
