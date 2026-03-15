# Marcos do Projeto

> **Arquivo:** `specs/roadmap/milestones.md`  
> **Versão:** 1.0.0

---

## Marco 0 — Fundação (Semana 1)

**Objetivo:** Ambiente de desenvolvimento e infraestrutura base funcionando.

**Entregáveis:**
- [ ] Repositório criado com estrutura de diretórios definida
- [ ] `docker-compose.yml` com hbbs, hbbr, PostgreSQL, Redis e Nginx
- [ ] Variáveis de ambiente configuradas (`.env.example` documentado)
- [ ] Certificados TLS configurados com Let's Encrypt
- [ ] Firewall UFW configurado e ativo
- [ ] `healthcheck.sh` rodando sem falhas
- [ ] hbbs e hbbr acessíveis externamente nas portas corretas

**Critério de aceitação:** Um cliente RustDesk padrão consegue se registrar no servidor.

---

## Marco 1 — MVP Operacional (Semana 2–3)

**Objetivo:** Técnicos conseguem usar a plataforma para acessar dispositivos, mesmo sem portal web.

**Entregáveis:**
- [ ] Cliente RustDesk com servidor da empresa embutido (build manual)
- [ ] Chave pública do hbbs embedded no cliente
- [ ] Instalador .exe distribuível gerado
- [ ] Keycloak configurado com realm, roles e MFA obrigatório
- [ ] Primeiros usuários técnicos criados no Keycloak
- [ ] Documentação de instalação do cliente para técnicos

**Critério de aceitação:** Carlos (técnico) instala o cliente, conecta seu dispositivo e consegue acessar o dispositivo de um cliente com credenciais pré-configuradas.

---

## Marco 2 — API e Address Book (Semana 4–6)

**Objetivo:** Plataforma com address book centralizado e controle de acesso.

**Entregáveis:**
- [ ] API NestJS com módulos: devices, users, groups, sessions, auth
- [ ] Banco de dados com schema completo e migrations
- [ ] Endpoints de CRUD de dispositivos, grupos e usuários
- [ ] RBAC implementado e testado
- [ ] Cobertura de testes ≥ 80%
- [ ] Documentação Swagger disponível em `/api/docs`
- [ ] CI pipeline (lint + test + build) no GitHub Actions

**Critério de aceitação:** Todos os endpoints do `api-spec.md` respondem corretamente com autenticação JWT.

---

## Marco 3 — Portais Web (Semana 7–9)

**Objetivo:** Interfaces web funcionais para técnicos e administradores.

**Entregáveis:**
- [ ] Portal Admin: CRUD de dispositivos, grupos e usuários
- [ ] Portal Técnico: lista de dispositivos com status online, botão de conectar
- [ ] Deep link `rustdesk://` funcionando ao clicar em "Conectar"
- [ ] Histórico de sessões exibido por dispositivo e por técnico
- [ ] Formulário de notas pós-sessão
- [ ] Portais com login via Keycloak OIDC

**Critério de aceitação:** Carlos acessa o Portal Técnico, vê a lista de seus dispositivos, clica em "Conectar" e o RustDesk abre automaticamente com o dispositivo correto.

---

## Marco 4 — Observabilidade e Produção (Semana 10–11)

**Objetivo:** Plataforma com observabilidade completa e pronta para operar em produção.

**Entregáveis:**
- [ ] Stack Prometheus + Grafana + Loki + Alertmanager no ar
- [ ] Dashboards de saúde, uso e segurança importados
- [ ] Alertas críticos configurados e testados (hbbs down, disco cheio)
- [ ] Backup automatizado com cron diário às 02:00
- [ ] Backup offsite configurado (S3-compatible)
- [ ] Runbooks documentados
- [ ] Checklist de produção 100% marcada

**Critério de aceitação:** Sistema em produção com todas as verificações do checklist concluídas. Fernanda recebe alerta por email quando hbbs é parado manualmente.

---

## Marco 5 — CI/CD do Cliente Automatizado (Semana 12)

**Objetivo:** Build e distribuição do cliente totalmente automatizados.

**Entregáveis:**
- [ ] GitHub Actions para build do cliente Windows (push de tag)
- [ ] Instalador .exe publicado automaticamente no servidor de downloads
- [ ] Portal Admin exibe versão atual do cliente com link de download
- [ ] Técnicos podem obter o link de download para enviar a clientes

**Critério de aceitação:** Criar tag `v1.0.0` no repositório → instalador disponível em `downloads.empresa.com` em menos de 45 minutos, sem intervenção manual.

---

## Sumário de Marcos

| Marco | Semanas | Foco |
|-------|---------|------|
| 0 | 1 | Infraestrutura base |
| 1 | 2–3 | MVP operacional |
| 2 | 4–6 | API + Address book |
| 3 | 7–9 | Portais web |
| 4 | 10–11 | Observabilidade + Produção |
| 5 | 12 | CI/CD automatizado |
