# Pipeline DevOps / CI/CD

> **Arquivo:** `specs/infra/devops-pipeline.md`  
> **Versão:** 1.0.0

---

## 1. Visão Geral dos Pipelines

A plataforma possui três pipelines principais:

| Pipeline | Trigger | Propósito |
|----------|---------|-----------|
| `api-ci.yml` | Push em `main` / Pull Request | Lint, testes, build da imagem API |
| `infra-deploy.yml` | Push em `main` (paths: infra/, services/) | Deploy da infraestrutura no servidor |
| `build-client.yml` | Push de tag `v*` / Workflow manual | Build e publicação do cliente RustDesk |

---

## 2. Pipeline: API CI

```
Trigger: push em qualquer branch + PRs para main

┌─────────────────────────────────────────────────────────┐
│  JOB: test                                               │
│                                                           │
│  1. Checkout do código                                   │
│  2. Setup Node.js 20                                     │
│  3. npm ci                                               │
│  4. npm run lint (ESLint + Prettier)                     │
│  5. npm run test:unit (Jest)                             │
│  6. npm run test:integration (Jest + Testcontainers)     │
│  7. Cobertura mínima: 80%                                │
└─────────────────────┬───────────────────────────────────┘
                      │ (somente em merge para main)
                      ▼
┌─────────────────────────────────────────────────────────┐
│  JOB: build-and-push                                     │
│                                                           │
│  1. docker build --target production                     │
│  2. docker tag :sha + :latest                            │
│  3. docker push para GitHub Container Registry (GHCR)   │
│  4. Rodar trivy scan na imagem (vulnerabilidades)        │
└─────────────────────────────────────────────────────────┘
```

**Tempo estimado:** 3–5 minutos

---

## 3. Pipeline: Deploy de Infraestrutura

```
Trigger: push em main (arquivos infra/, services/, docker-compose.yml)

┌─────────────────────────────────────────────────────────┐
│  JOB: deploy-production                                   │
│  Environment: production (requer aprovação manual)        │
│                                                           │
│  1. Checkout do código                                   │
│  2. Verificar que API pipeline passou (depends_on)       │
│  3. SSH no servidor de produção                          │
│  4. git pull origin main                                 │
│  5. docker compose pull (puxa novas imagens)             │
│  6. docker compose up -d --remove-orphans                │
│  7. Aguardar 30s                                         │
│  8. Executar healthcheck.sh                              │
│  9. Notificar Slack / email em caso de falha             │
└─────────────────────────────────────────────────────────┘
```

**Rollback:** `docker compose up -d` com tag anterior da imagem

---

## 4. Pipeline: Build do Cliente RustDesk

```
Trigger: Push de tag v* (ex: v1.2.0) ou dispatch manual

┌─────────────────────────────────────────────────────────┐
│  JOB: build-windows (runs-on: windows-2022)              │
│                                                           │
│  1. Checkout do repositório                              │
│  2. Setup Rust (toolchain stable)                        │
│  3. Setup Flutter (3.19.x)                               │
│  4. git clone rustdesk/rustdesk (depth=1)                │
│  5. Executar inject-config.py                            │
│     - SERVER_HOST (de secrets)                           │
│     - RELAY_HOST (de secrets)                            │
│     - PUBLIC_KEY (de secrets)                            │
│     - APP_NAME (de vars)                                 │
│  6. Copiar assets de branding (logo.png, logo.ico)       │
│  7. cargo audit (checar vulnerabilidades)                │
│  8. python build.py --flutter --hwcodec                  │
│  9. makensis installer.nsi (gerar .exe)                  │
│  10. Upload artefato para GHCR Releases                  │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  JOB: publish (runs-on: ubuntu-latest)                   │
│                                                           │
│  1. Download artefatos do job anterior                   │
│  2. SCP artefatos para /opt/remote-support/downloads/    │
│     no servidor de produção                              │
│  3. Criar GitHub Release com notas de versão             │
│  4. Atualizar arquivo version.json no servidor           │
│     { "version": "1.2.0", "download_url": "..." }        │
└─────────────────────────────────────────────────────────┘
```

**Tempo estimado:** 25–45 minutos (build Rust é lento)

---

## 5. Secrets e Variáveis de Ambiente

### 5.1 Secrets (GitHub Secrets — valores secretos)

| Secret | Usado em | Descrição |
|--------|----------|-----------|
| `SERVER_HOST` | build-client | Endereço do servidor hbbs |
| `RELAY_HOST` | build-client | Endereço do servidor hbbr |
| `RUSTDESK_PUBLIC_KEY` | build-client | Chave pública do hbbs |
| `DEPLOY_SSH_KEY` | infra-deploy | Chave privada SSH para deploy |
| `PROD_SERVER_IP` | infra-deploy | IP do servidor de produção |

### 5.2 Variables (não-secretas)

| Variable | Valor padrão | Descrição |
|----------|-------------|-----------|
| `APP_NAME` | `SuporteERP` | Nome do cliente white-label |
| `APP_VERSION` | Gerado da tag | Versão do cliente |
| `COMPANY_NAME` | `Minha Empresa` | Empresa exibida no instalador |

---

## 6. Branch Strategy

```
main ────────────────────────────────────────────►  (produção)
   │           ↑           ↑           ↑
   │       merge PR     merge PR    merge PR
   │           │           │           │
feature/* ────┘        bugfix/* ────┘   hotfix/* ─┘

Regras:
- main é protegida — apenas via Pull Request
- PR requer: CI verde + 1 aprovação
- Tags semânticas (vX.Y.Z) disparam build do cliente
- Commits seguem Conventional Commits:
  feat: nova funcionalidade
  fix: correção de bug
  chore: manutenção
  docs: documentação
  refactor: refatoração sem mudança de comportamento
```

---

## 7. Monitoramento do Pipeline

- Falhas de pipeline notificam por email (GitHub Notifications)
- Build do cliente > 60 minutos → alerta de timeout
- Deploy com healthcheck falhando → pipeline marcado como falho + alerta
- Artefatos de build retidos por 30 dias no GitHub
