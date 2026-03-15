# 🚀 Guia de Onboarding: Bem-vindo à Plataforma RustDesk

Este documento foi projetado para ajudar novos engenheiros a se aclimatarem rapidamente ao ecossistema da nossa plataforma privada de suporte remoto.

## 🧩 O que é cada peça do quebra-cabeça?

Se você está começando agora, pode se perguntar o que são todos esses nomes. Aqui está uma explicação simples:

- **RustDesk (O Motor)**: É o software que faz a conexão remota de fato. Ele permite ver a tela e mexer no mouse de outro computador de forma criptografada.
- **NestJS (O Cérebro/API)**: É o nosso backend. Ele guarda a lista de computadores, quem pode acessar o quê, e registra o histórico de quem entrou em qual máquina.
- **Keycloak (O Segurança)**: É quem cuida do seu login. Em vez de cada parte do sistema pedir sua senha, o Keycloak centraliza tudo com padrões de segurança bancária (SSO/MFA).
- **React/Vite (A Vitrine)**: É o que você vê no navegador. Onde você clica para ver a lista de máquinas e gerenciar os técnicos.
- **Docker (O Container)**: Imagine como uma "caixa" que já vem com tudo instalado. Você não precisa instalar banco de dados ou servidores na sua máquina manualmante; o Docker faz isso por você.

---

## 🛠️ Setup do Ambiente de Desenvolvimento
### Pré-requisitos
- **Docker & Docker Compose**: Essencial para rodar a stack localmente sem complicações.
- **Node.js 20+**: Para rodar o código da API e do Frontend se quiser mexer neles.
- **Git**: Para baixar e salvar seu progresso.

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
    > [!NOTE]
    > Na primeira vez, isso pode demorar alguns minutos pois o Docker vai baixar as imagens necessárias da internet.

3.  **Acesse o Sistema**:
    - **API (Swagger)**: `http://localhost:3000/api` (Veja os endpoints)
    - **Frontend**: `http://localhost:5173` (Use para navegar)


## 📂 Estrutura do Repositório
- `/api`: Servidor Backend local.
- `/web`: Portais Web em React.
- `/specs`: Toda a fundamentação teórica e requisitos.
- `/docs`: Guias técnicos por especialidade (Backend, Frontend, DevOps, QA).
- `/docs/keycloak-guide.md`: Guia de Integração e Segurança com Keycloak.
- `docker-compose.yml`: Orquestração da stack completa.

## 🤝 Fluxo de Trabalho
- **Branches**: Utilize o padrão `feature/nome-da-feature` ou `fix/nome-do-bug`.
- **Review**: Todo PR deve passar por revisão e validação de QA.
- **Commits**: Mantemos commits claros e descritivos.
