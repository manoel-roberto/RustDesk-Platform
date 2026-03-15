# Remote Support Platform — Especificações do Sistema

> **Versão:** 1.0.0  
> **Status:** Em definição  
> **Última atualização:** 2025  
> **Metodologia:** Spec-Driven Development (SDD)

---

## Visão Geral

Este repositório contém a especificação completa da **Plataforma de Suporte Remoto Corporativo Open Source**, construída sobre RustDesk OSS. O objetivo desta especificação é permitir que qualquer engenheiro do time implemente o sistema com clareza, consistência e rastreabilidade total.

Toda implementação deve derivar diretamente das especificações contidas neste repositório. Mudanças na implementação que não estejam refletidas aqui são consideradas **não especificadas** e sujeitas a revisão.

---

## Objetivo do Projeto

Desenvolver uma plataforma corporativa de suporte remoto **100% open source e self-hosted**, capaz de substituir soluções comerciais como TeamViewer, AnyDesk e Splashtop para empresas de suporte técnico a sistemas ERP.

A plataforma deve permitir que técnicos acessem, suportem e gerenciem dispositivos de clientes de forma segura, rastreável e eficiente, sem dependência de fornecedores externos e sem custo de licenciamento.

---

## Escopo do Produto

### Dentro do Escopo

- Servidor de ID e Relay RustDesk (hbbs + hbbr) self-hosted
- API de gestão de dispositivos e address book
- Portal web de administração e portal de técnicos
- Sistema de autenticação com SSO, MFA e RBAC
- Build automatizado do cliente white-label (Windows)
- Observabilidade completa (métricas, logs, alertas)
- Pipeline CI/CD para build e deploy
- Backup e disaster recovery automatizados

### Fora do Escopo (v1.0)

- Aplicativo mobile para técnicos
- Gravação de sessões remotas
- Multi-tenancy (múltiplos clientes isolados)
- Suporte a macOS como cliente controlado
- Integração nativa com sistemas ERP

---

## Visão do Produto

Uma plataforma de suporte remoto que devolve à empresa o controle total sobre seus dados, suas ferramentas e sua infraestrutura — eliminando custos de licenciamento, dependências de vendors e riscos de conformidade.

---

## Público-Alvo

| Perfil | Descrição |
|--------|-----------|
| Empresa de suporte a ERP | Organização que utiliza a plataforma internamente |
| Técnicos de suporte | Usuários operacionais que realizam sessões remotas |
| Administradores de TI | Responsáveis pela gestão da plataforma |
| Clientes do ERP | Empresas cujos dispositivos são acessados remotamente |

---

## Estrutura da Especificação

```
specs/
├── README.md                        ← Este arquivo
├── vision.md                        ← Visão de produto e problema
├── requirements.md                  ← Requisitos funcionais e não funcionais
│
├── product/
│   ├── user-personas.md             ← Perfis de usuários
│   ├── user-stories.md              ← Histórias de usuário
│   └── use-cases.md                 ← Casos de uso detalhados
│
├── system/
│   ├── system-overview.md           ← Visão geral da arquitetura
│   ├── system-components.md         ← Componentes do sistema
│   ├── data-model.md                ← Modelo de dados
│   └── api-spec.md                  ← Especificação da API REST
│
├── security/
│   ├── security-model.md            ← Modelo de segurança
│   └── auth-model.md                ← Autenticação e autorização
│
├── infra/
│   ├── deployment-architecture.md   ← Arquitetura de infraestrutura
│   └── devops-pipeline.md           ← Pipeline CI/CD
│
├── quality/
│   ├── testing-strategy.md          ← Estratégia de testes
│   └── observability.md             ← Logs, métricas e rastreamento
│
└── roadmap/
    ├── milestones.md                ← Marcos do projeto
    └── technical-roadmap.md         ← Evolução técnica
```

---

## Como Usar Esta Especificação

1. **Novos engenheiros:** Comece por `vision.md` → `requirements.md` → `system/system-overview.md`
2. **Backend:** Foco em `system/api-spec.md`, `system/data-model.md`, `security/auth-model.md`
3. **Frontend:** Foco em `product/user-stories.md`, `product/use-cases.md`, `system/api-spec.md`
4. **DevOps:** Foco em `infra/deployment-architecture.md`, `infra/devops-pipeline.md`
5. **QA:** Foco em `quality/testing-strategy.md`, `quality/observability.md`

---

## Convenções

- Todo requisito possui um identificador único (ex: `REQ-F-001`)
- Toda história de usuário possui identificador (ex: `US-001`)
- Todo caso de uso possui identificador (ex: `UC-001`)
- Todo endpoint de API possui identificador (ex: `API-DEV-001`)
- Mudanças são rastreadas via Git com mensagens semânticas

---

## Glossário

| Termo | Definição |
|-------|-----------|
| hbbs | RustDesk ID Server — servidor de registro e rendezvous |
| hbbr | RustDesk Relay Server — servidor de relay de sessões |
| Dispositivo | Computador do cliente registrado na plataforma |
| Sessão | Conexão remota ativa entre técnico e dispositivo |
| Address Book | Catálogo centralizado de dispositivos gerenciados |
| White-label | Cliente RustDesk com branding da empresa |
| NAT Traversal | Técnica para conexão direta entre redes com NAT |
| E2E | End-to-End (criptografia de ponta a ponta) |
