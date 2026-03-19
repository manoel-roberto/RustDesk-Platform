# 03 — Instalando a Plataforma 🛠️

⏱️ **Tempo estimado:** 40–60 minutos

Agora o seu servidor está pronto. Vamos transformar aquele computador alugado no seu **Centro de Suporte Remoto** instalando os programas da plataforma.

---

## 4.1 Baixando o Projeto (Clonando) 📥

O **Git** é como o "Google Drive" de quem cria códigos: ele guarda versões de um projeto e permite baixá-las de qualquer lugar.

Rode os comandos abaixo no terminal do servidor:
```bash
# Entrar na pasta correta
cd /opt

# Baixar o projeto do GitHub
sudo git clone https://github.com/SUA_ORG/remote-support-platform.git remote-support

# Dar permissão para o seu usuário editar as coisas
sudo chown -R $USER:$USER /opt/remote-support

# Entrar na pasta do projeto
cd /opt/remote-support
```

---

## 4.2 Configurando os Dados da Sua Empresa (.env) 🚗

As **Variáveis de Ambiente** são como as configurações do seu carro: a posição do banco, a temperatura do ar e as rádios salvas. Aqui, você vai "contar" ao sistema qual é o seu domínio e as suas senhas.

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo para editar:
   ```bash
   nano .env
   ```
3. Preencha as informações conforme a tabela abaixo:

| Variável | O que colocar? | Exemplo |
|----------|----------------|---------|
| `DOMAIN` | O seu domínio principal | `empresa.com.br` |
| `POSTGRES_PASSWORD` | Uma senha **FORTE** para o banco de dados | `SenhaDificil123!` |
| `KEYCLOAK_ADMIN_PASSWORD` | Senha para você entrar na área de login | `MinhaSenhaRoot789!` |

> 💡 **DICA**: Para salvar no editor `nano`, aperte `Ctrl+O` e depois `Enter`. Para sair, aperte `Ctrl+X`.

---

## 4.3 Iniciando os Motores! 🏗️

O comando abaixo é fantástico: ele vai baixar todos os "especialistas" (hbbs, hbbr, api, site) e deixá-los prontos para trabalhar.

```bash
docker compose up -d
```
> ⏱️ **Aguarde**: Isso pode demorar uns 10 minutos na primeira vez.

Para ver se está tudo ligado:
```bash
docker compose ps
```
> ✅ **VERIFICAÇÃO**: Todos os nomes devem estar com o status "Up" ou "Running" (ligado).

---

## 4.4 Colocando o Cadeado de Segurança (HTTPS) 🔒

Para que o Google Chrome (e outros navegadores) aceitem o seu site como seguro, precisamos gerar os certificados oficiais. 

Rode este comando (trocando pelo seu e-mail e domínios):
```bash
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email seu-email@empresa.com.br --agree-tos --no-eff-email \
  -d suporte.empresa.com.br \
  -d relay.empresa.com.br \
  -d api.empresa.com.br \
  -d admin.empresa.com.br \
  -d portal.empresa.com.br \
  -d auth.empresa.com.br \
  -d downloads.empresa.com.br
```

---

## 4.5 Teste Final de Saúde 🩺

Acesse o endereço abaixo pelo seu navegador (no seu computador mesmo):
`https://api.empresa.com.br/health`

Se aparecer uma mensagem como `{"status":"ok"}`, parabéns! **O cérebro da sua plataforma está vivo e operando.**

---

> ✅ **CHECKPOINT**: O sistema está instalado e seguro (com o cadeado verde!). Agora vamos configurar quem pode logar e quem são os seus técnicos.
> 
> **Próximo passo: [Documento 4: Configurando o Keycloak](04-configurando-o-keycloak.md)**
