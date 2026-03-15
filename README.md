# 🤖 Remote Support Platform (Self-Hosted RustDesk)

Bem-vindo ao repositório oficial da nossa plataforma privada de suporte remoto! Este projeto permite que empresas gerenciem sua própria frota de dispositivos com segurança, privacidade e controle total.

---

## 🚀 Para Começar (Em 5 Minutos)

Se você é novo aqui e quer ver o projeto funcionando, siga estes passos:

1.  **Clone o projeto**: `git clone https://github.com/manoel-roberto/RustDesk-Platform.git`
2.  **Suba a infraestrutura**: Certifique-se de ter o Docker instalado e rode `docker-compose up -d` na raiz.
3.  **Acesse o Portal**: O frontend estará disponível em `http://localhost:5173`.
4.  **Consulte o Onboarding**: Para um guia detalhado, leia o nosso **[Guia de Onboarding (Iniciantes)](docs/onboarding.md)**.

---

## 🤝 Como Contribuir

Quer ajudar a melhorar a plataforma? Adoramos contribuições de todos os níveis! 
Leia nosso guia completo em **[CONTRIBUTING.md](CONTRIBUTING.md)** para saber como abrir Issues, sugerir melhorias ou enviar código.

---

## 📖 Visão do Projeto

Este repositório utiliza a metodologia **Spec-Driven Development (SDD)**. Isso significa que toda a inteligência e as regras de negócio estão documentadas nas [Especificações](specs/README.md) antes de serem codificadas.

---


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

## Guias de Implementação

Para detalhes práticos de como desenvolver e operar cada parte do sistema, consulte os guias no diretório `docs/`:

1.  **[Novos engenheiros (Onboarding)](docs/onboarding.md):** Guia de boas-vindas e setup do ambiente.
2.  **[Backend Guide](docs/backend.md):** Arquitetura NestJS, Database (TypeORM) e Keycloak.
3.  **[Frontend Guide](docs/frontend.md):** UI React, Design System (Glassmorphism) e Consumo de API.
4.  **[DevOps Guide](docs/devops.md):** Docker Compose, Scripts de Build e Segurança.
5.  **[QA Guide](docs/qa.md):** Plano de testes e critérios de aceitação.
6.  **[VPS Deployment Guide](docs/vps-deployment.md):** Manual Passo a Passo para Hospedagem Privada.
7.  **[Client Compilation Guide](docs/client-compilation.md):** Como criar seus próprios instaladores customizados.

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
