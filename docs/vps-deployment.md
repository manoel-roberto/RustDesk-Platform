# ☁️ Guia de Deploy em VPS (Ubuntu/Debian)

Este guia fornece o passo a passo para hospedar o ecossistema RustDesk em um servidor VPS simples.

## 📋 Requisitos Mínimos

Para rodar a stack completa (RustDesk + API + Keycloak), recomendamos:
- **SO**: Ubuntu 22.04 LTS ou Debian 12 (Recomendado)
- **CPU**: 2 vCPUs
- **RAM**: 4GB (Mínimo absoluto: 2GB com Swap ativado)
- **Disco**: 20GB SSD ou superior
- **Rede**: IP Público (IPv4)

---

## 🛠️ 1. Preparação do Servidor

Atualize o sistema e instale as dependências básicas:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

---

## 🔒 2. Configuração do Firewall

Certifique-se de que as seguintes portas estão abertas no seu provedor de VPS e no `ufw`:

| Porta | Protocolo | Descrição |
|-------|-----------|-----------|
| 21115 | TCP | RustDesk - Keep-alive |
| 21116 | TCP/UDP | RustDesk - ID Server |
| 21117 | TCP | RustDesk - Relay |
| 21118 | TCP | RustDesk - Web Client (Keep-alive) |
| 21119 | TCP | RustDesk - Web Client (Relay) |
| 3000  | TCP | API Server (Backend) |
| 8080  | TCP | Keycloak (IDP) |
| 5173  | TCP | Frontend Portal |

Comandos `ufw` sugeridos:
```bash
sudo ufw allow 21115:21119/tcp
sudo ufw allow 21116/udp
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 5173/tcp
sudo ufw allow ssh
sudo ufw enable
```

---

## 🚀 3. Deploy da Plataforma

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/manoel-roberto/RustDesk-Platform.git
   cd RustDesk-Platform
   ```

2. **Ajuste o arquivo `docker-compose.yml`**:
   Substitua `hbbr.empresa.com` pelo IP público ou domínio da sua VPS:
   ```yaml
   hbbs:
     command: hbbs -r SEU_IP_OU_DOMINIO:21117 -k _
   ```

3. **Suba a infraestrutura**:
   ```bash
   docker compose up -d
   ```

---

## 🔑 4. Pós-Instalação: Obtendo sua Chave Pública

Para conectar seus clientes RustDesk ao servidor, você precisará da chave pública gerada automaticamente:

```bash
cat ./data/rustdesk-data/id_ed25519.pub
```

Copie este código e insira-o na configuração de rede ("Key") do cliente RustDesk, junto com o IP do seu servidor ID.

---

## 📁 Backup e Manutenção

Os dados persistentes estão localizados na pasta `./data` dentro do diretório do projeto. Recomendamos backups periódicos desta pasta para evitar perda de configurações e registros do banco de dados.
