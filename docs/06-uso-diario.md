# 06 — Como usar a plataforma no dia a dia? 🖥️

⏱️ **Tempo estimado:** 20–30 minutos (leitura)

Agora que tudo está configurado e o seu instalador pronto, vamos aprender como as pessoas da sua empresa usarão o sistema no cotidiano. Dividimos este guia em três partes:

---

## 7.1 Guia do Administrador (O Dono do Painel) 👑

Como administrador, você gerencia as "regras do jogo". 
Acesse: `https://admin.empresa.com.br`

### Ações Principais:
1. **Adicionar Dispositivos**: 
   - No menu lateral, vá em **"Devices"**.
   - Clique em **"Add Device"** para cadastrar manualmente ou importe em massa via **CSV** (planilha).
   - Isso é opcional se você usar o cliente customizado: ele aparecerá aqui automaticamente no primeiro acesso.
2. **Criar sua Equipe (Técnicos)**: 
   - Siga os passos do **Documento 4** para criar novos usuários no Keycloak.
3. **Ver Relatórios**: 
   - Na página inicial (Dashboard), veja quantos computadores estão online agora.
   - Em **"Audit Logs"**, veja tudo o que seus técnicos andaram fazendo no sistema por segurança.

---

## 7.2 Guia do Técnico (Quem faz o Suporte) 🛠️

O seu técnico terá um portal simplificado, direto ao ponto.
Acesse: `https://portal.empresa.com.br`

### Passo a Passo do Atendimento:
1. **Ver a Lista**: O técnico verá apenas os computadores que você autorizou ele a ver.
2. **Iniciar o Suporte**: Basta clicar no botão verde **"Conectar"** ao lado do dispositivo.
   - **Mágica**: O RustDesk no computador dele abrirá automaticamente e iniciará a conexão, sem ele precisar digitar senhas ou IDs.
3. **Finalizar**: Ao terminar o suporte, o técnico fecha a janela e pode adicionar notas (ex: "Atualização de sistema realizada") no histórico.

---

## 7.3 Guia do Cliente Final (Quem recebe Ajuda) 🤝

Para o seu cliente, tudo deve ser o mais simples possível:

1. **Instalação**: Ele baixa o `SuaEmpresa-Setup.exe` do link que você enviar e executa.
2. **Concessão de Acesso**: Quando o seu técnico tentar conectar, aparecerá um aviso na tela do cliente. Ele clica em **"Aceitar"** ou fornece a senha que aparece na tela (dependendo de como você configurou).
3. **Segurança**: O cliente vê uma barra flutuante indicando que você está conectado. Ele pode encerrar a sessão a qualquer momento clicando em **"Fechar"**.

---

> ✅ **CHECKPOINT**: Você e sua equipe já sabem usar o sistema! Mas agora vem uma parte vital: como garantir que tudo continue funcionando amanhã e depois?
> 
> **Próximo passo: [Documento 7: Manutenção e Backups](07-manutencao-e-backups.md)**
