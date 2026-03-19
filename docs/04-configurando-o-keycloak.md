# 04 — Configurando o Sistema de Login (Keycloak) 🛡️

⏱️ **Tempo estimado:** 30–40 minutos

Parabéns por chegar até aqui! Agora que o sistema está rodando, vamos configurar o nosso **"Porteiro Digital"**, o **Keycloak**. Ele é quem cuidará das senhas, logins e da segurança do celular (MFA).

---

## 5.1 Primeiro Acesso 🔑

O Keycloak é o nosso cérebro de segurança. Para acessá-lo:
1. Abra seu navegador e acesse `https://auth.empresa.com.br`.
2. Clique em **"Administration Console"**.
3. Use o usuário `admin` e a senha que você configurou no `.env` (na variável `KEYCLOAK_ADMIN_PASSWORD`).

---

## 5.2 Criando o seu "Condomínio" de Usuários (Realm) 🏰

No Keycloak, um **Realm** (Reino) é como se fosse um condomínio separado para a sua empresa. Nunca usaremos o padrão "master" para nossos técnicos por segurança.

1. Clique no botão azul no canto superior esquerdo (onde diz `master`).
2. Clique em **"Create Realm"**.
3. No campo **Realm name**, digite `remote-support`.
4. Clique em **"Create"**.

> ✅ **VERIFICAÇÃO**: Agora o nome no canto superior esquerdo deve ser `remote-support`.

---

## 5.3 Segurança Máxima no Celular (MFA) 🔐

O **MFA** garante que, mesmo que alguém roube a sua senha, não consiga logar sem o seu celular. Vamos tornar isso obrigatório para todos:

1. No menu lateral, clique em **"Authentication"**.
2. Na aba **"Required Actions"**, procure por **"Configure OTP"**.
3. Marque as caixas **"Set as default action"** e **"Enabled"**.

---

## 5.4 Criando Você: O Primeiro Administrador 👤

1. Vá em **"Users"** no menu lateral.
2. Clique em **"Add user"**.
3. Preencha seu nome de usuário (ex: `joao.silva`) e e-mail.
4. Clique em **"Create"**.
5. Na aba **"Credentials"**, clique em **"Set password"**.
6. Digite sua senha nova, desmarque a opção para mudar no primeiro acesso (opcional) e salve.

### Dando Poderes de Administrador:
1. Dentro do seu usuário, vá na aba **"Role mapping"**.
2. Clique em **"Assign role"**.
3. Selecione a opção `admin` e clique em **"Assign"**.

---

## 5.5 Como Criar um Técnico 🛠️

Para cada funcionário seu, repita os passsos de **"Add user"**, mas em vez de dar a permissão de `admin`, dê a permissão de **`technician`**.

> 🔒 **SEGURANÇA**: No primeiro acesso do técnico, o sistema mostrará um **QR Code**. Ele deve abrir o aplicativo (Google Authenticator ou Authy) no celular, escanear o código e digitar os 6 dígitos que aparecerem.

---

> ✅ **CHECKPOINT**: Agora você tem um sistema de login seguro e seus técnicos já podem entrar! Agora vamos para a parte mais legal: criar o **programa instalado no computador do cliente** com a sua marca.
> 
> **Próximo passo: [Documento 5: Criando o Instalador](05-criando-o-instalador-do-cliente.md)**
