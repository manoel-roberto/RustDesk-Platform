# 🚀 Guia de Onboarding: Bem-vindo à Plataforma RustDesk

Este documento foi projetado para ajudar novos engenheiros a se aclimatarem rapidamente ao ecossistema da nossa plataforma privada de suporte remoto.

## 📌 Visão Geral do Projeto
A plataforma é uma solução completa de suporte remoto "Self-Hosted", composta por:
1.  **Core Infra**: Servidores de ID (hbbs) e Relay (hbbr) para tráfego P2P criptografado.
2.  **API Gateway**: Servidor NestJS que gerencia o catálogo de endereços (Address Book), sessões e grupos.
3.  **Portais Web**: Interfaces React para Técnicos (acesso rápido) e Administradores (gestão de frota).
4.  **Clientes Customizados**: Executáveis RustDesk modificados para conectar exclusivamente à nossa rede.

## 🛠️ Setup do Ambiente de Desenvolvimento
### Pré-requisitos
- **Docker & Docker Compose**: Essencial para rodar a stack localmente.
- **Node.js 20+**: Para desenvolvimento de API e Frontend.
- **Git**: Controle de versão oficial.

### Passo a Passo Inicial
1.  **Clone o Repositório**:
    ```bash
    git clone https://github.com/manoel-roberto/RustDesk-Platform.git
    cd RustDesk-Platform
    ```
2.  **Suba a Infra de Apoio**:
    ```bash
    docker-compose up -d
    ```
    Isso iniciará o Postgres, Redis, Keycloak e os servidores RustDesk.

3.  **Instale as Dependências**:
    - **API**: `cd api && npm install`
    - **Web**: `cd web && npm install`

## 📂 Estrutura do Repositório
- `/api`: Servidor Backend local.
- `/web`: Portais Web em React.
- `/specs`: Toda a fundamentação teórica e requisitos.
- `/docs`: Guias técnicos por especialidade (Backend, Frontend, DevOps, QA).
- `docker-compose.yml`: Orquestração da stack completa.

## 🤝 Fluxo de Trabalho
- **Branches**: Utilize o padrão `feature/nome-da-feature` ou `fix/nome-do-bug`.
- **Review**: Todo PR deve passar por revisão e validação de QA.
- **Commits**: Mantemos commits claros e descritivos.
