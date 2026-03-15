# 🧪 QA: Estratégias de Teste e Validação

O papel do QA é garantir que a experiência de suporte remoto seja estável, segura e que o catálogo de endereços funcione perfeitamente.

## 🎯 Foco dos Testes
1.  **Conectividade**: Validar se o cliente customizado conecta exclusivamente nos nossos servidores.
2.  **Address Book**: Verificar se a lista de máquinas exibida no Portal Web e na App nativa está sincronizada.
3.  **Segurança OIDC**: Garantir que as rotas da API e do Front estão protegidas por JWT.
4.  **Deep Links**: Testar o acionamento do `rustdesk://id` a partir do portal.

## 📋 Plano de Verificação Manual
1.  **Instalação**: Instalar o EXE customizado em uma máquina limpa e verificar se o ID aparece no Portal Web.
2.  **MFA/Login**: Testar fluxo de login no Keycloak.
3.  **Performance**: Verificar o delay de conexão via Relay (hbbr).

## 🤖 Testes Automatizados (Próximos Passos)
- **E2E**: Playwright para testar os fluxos dos Portais Admin/Técnico.
- **API**: Testes de integração no NestJS comparando respostas com o `api-spec.md`.

## 🚨 Critérios de Aceite por Release
- Sem erros de CORS na conexão Web -> API.
- Chave pública e ID Server obrigatoriamente chumbados no binário.
- Nenhuma falha de segurança crítica detectada no scanner de dependências.
