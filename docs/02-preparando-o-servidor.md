# 02 — Preparando o Servidor 🚀

⏱️ **Tempo estimado:** 30–50 minutos

Agora que você já tem o seu servidor (VPS) alugado, vamos deixá-lo pronto para receber o sistema da RustDesk Platform. Siga cada passo com calma — não tem erro!

---

## 3.1 Acessando o Servidor pela Primeira Vez (SSH) 🔑

Imagine que o **SSH** (Shell Seguro) é uma linha telefônica 100% protegida entre o seu computador e o servidor alugado. Tudo o que você digitar no seu teclado será executado no servidor.

### Como conectar:
1. Abra o **Terminal** do seu computador (no Windows, use o **PowerShell**).
2. Digite o seguinte comando (trocando `SEU_IP` pelo IP que a empresa do servidor te deu):
   ```bash
   ssh root@SEU_IP
   ```
3. Se aparecer uma pergunta sobre "authenticity", responda `yes`.
4. Digite a senha que você recebeu e aperte **Enter**. (Atenção: a senha não aparece enquanto você digita por segurança — apenas digite e aperte Enter).

---

## 3.2 Atualizando o Sistema 🔄

Assim como o seu celular ou Windows pedem atualizações, o Linux também precisa delas para ficar seguro.

Rode o comando abaixo para atualizar a "lista de programas":
```bash
sudo apt update
```

Agora, instale as atualizações:
```bash
sudo apt upgrade -y
```
> 💡 **DICA**: O `-y` significa "sim para tudo". Se aparecer uma tela rosa/azul no meio, pode apenas apertar **Enter** para aceitar o padrão.

---

## 3.3 Instalando o Docker 📦

O Docker é o nosso sistema de "caixas" que explicamos antes. Vamos instalá-lo com um atalho seguro:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Verifique se funcionou:
```bash
docker --version
```
> ✅ **VERIFICAÇÃO**: Se aparecer "Docker version..." seguido de alguns números, a instalação deu certo!

---

## 3.4 Configurando o Firewall (O Segurança) 🛡️

O **Firewall** (UFW) é como o porteiro do prédio: ele decide quem pode entrar. Vamos liberar apenas as "portas" necessárias para o RustDesk:

```bash
# Permite o acesso pelo terminal (não se tranque fora!)
sudo ufw allow 22/tcp

# Portas para o site e segurança (HTTP/HTTPS)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Portas essenciais do RustDesk
sudo ufw allow 21115/tcp
sudo ufw allow 21116/tcp
sudo ufw allow 21116/udp
sudo ufw allow 21117/tcp

# Ativar o firewall
sudo ufw enable
```
> ⚠️ **ATENÇÃO**: Quando rodar o último comando, ele vai perguntar se você tem certeza. Digite `y` e dê Enter.

---

## 3.5 Configurando o seu Domínio (Endereços DNS) 📍

Acesse o site onde você comprou o seu **Domínio** (ex: Registro.br, GoDaddy) e crie os endereços abaixo apontando para o **IP do seu servidor**:

| Nome (Subdomínio) | Tipo | Valor | Para que serve? |
|-------------------|------|-------|-----------------|
| `suporte` | A | SEU_IP | Endereço dos computadores |
| `relay` | A | SEU_IP | Operador de chamadas |
| `api` | A | SEU_IP | Cérebro do sistema |
| `admin` | A | SEU_IP | Seu painel de controle |
| `portal` | A | SEU_IP | Portal para os técnicos |
| `auth` | A | SEU_IP | Tela de Login |
| `downloads` | A | SEU_IP | Baixar o instalador |

> 💡 **EXEMPLO**: Se o seu domínio é `empresa.com.br`, você criará endereços como `suporte.empresa.com.br`.

---

> ✅ **CHECKPOINT**: Servidor atualizado, Docker instalado e endereço (DNS) configurado. Estamos prontos para o grande momento!
> 
> **Próximo passo: [Documento 3: Instalando a Plataforma](03-instalando-a-plataforma.md)**
