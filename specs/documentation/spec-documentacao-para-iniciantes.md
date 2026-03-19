# Spec: Geração de Documentação Completa para Iniciantes

> **Arquivo:** `specs/documentation/beginner-docs-spec.md`
> **Versão:** 1.0.0
> **Status:** Aprovado
> **Objetivo:** Instrução para a IA gerar documentação 100% acessível a pessoas sem experiência em programação

---

## CONTEXTO PARA A IA

Você irá gerar a documentação completa de uma **plataforma de suporte remoto corporativo** construída sobre RustDesk Open Source. Esta plataforma permite que empresas de suporte técnico tenham sua própria ferramenta de acesso remoto, sem depender de serviços pagos como TeamViewer ou AnyDesk.

Seu leitor **nunca programou antes**. Ele pode ser um técnico de informática, um gerente de TI, ou alguém que quer colocar esse sistema para funcionar em um servidor. Escreva como se estivesse explicando para um amigo inteligente que não é da área de tecnologia.

---

## REGRAS ABSOLUTAS DE ESCRITA

1. **Nunca use jargão sem explicar imediatamente o que significa**
   - ❌ Errado: "Configure o endpoint do OIDC no Keycloak"
   - ✅ Correto: "Configure o endereço de login no Keycloak (o sistema que cuida das senhas)"

2. **Use analogias do mundo real para cada tecnologia**
   - Exemplo: "O Docker é como uma caixa de papelão. Você coloca o programa dentro da caixa com tudo que ele precisa para funcionar. Assim, não importa em qual computador você abrir a caixa — o programa vai funcionar igual."

3. **Explique o PORQUÊ antes do COMO**
   - Antes de dizer "rode este comando", explique o que ele vai fazer e por que é necessário.

4. **Formato dos comandos**
   - Sempre apresente comandos em blocos de código
   - Logo após cada comando, explique em português o que aconteceu
   - Indique se o leitor vai ver algo na tela após rodar o comando

5. **Estrutura de cada passo**
   ```
   ### Passo X: [Título claro do que será feito]
   
   **O que é isso?** [Explicação em 1-2 frases simples]
   
   **Por que precisamos fazer isso?** [Justificativa]
   
   **Como fazer:**
   [Instrução]
   
   **O que você verá na tela:** [Resultado esperado]
   
   **Se der errado:** [Solução para o erro mais comum]
   ```

6. **Avisos visuais obrigatórios**
   - Use `> ⚠️ ATENÇÃO:` para pontos críticos
   - Use `> 💡 DICA:` para facilitadores
   - Use `> ✅ VERIFICAÇÃO:` para checar se o passo funcionou

---

## ESTRUTURA DA DOCUMENTAÇÃO A GERAR

Gere a documentação completa com **todas** as seções abaixo, nesta ordem:

---

### SEÇÃO 0: CAPA E APRESENTAÇÃO

**Título:** Guia Completo — Plataforma de Suporte Remoto (RustDesk Corporativo)

**Subtítulo:** Do zero ao sistema funcionando — para qualquer pessoa

**Inclua:**
- Uma introdução em linguagem simples explicando o que é este projeto (máx. 3 parágrafos)
- Uma lista de quem vai se beneficiar deste guia (técnicos de suporte, gerentes de TI, donos de empresa de TI)
- Uma estimativa honesta de tempo para configurar tudo
- Um glossário rápido com os 15 termos mais usados no guia

---

### SEÇÃO 1: O QUE É ESTE PROJETO E POR QUÊ ELE EXISTE

**O que a IA deve escrever:**

1.1 **O problema que ele resolve**
- Explique de forma simples que empresas de suporte técnico gastam muito dinheiro com TeamViewer, AnyDesk etc.
- Use números reais das specs: R$ 800 a R$ 5.000/mês para equipes de 5 a 20 técnicos
- Explique o problema de privacidade: seus dados de acesso remoto passam por servidores no exterior
- Explique o "vendor lock-in" com uma analogia: é como alugar uma casa onde o dono pode aumentar o aluguel ou te expulsar a qualquer momento

1.2 **A solução proposta**
- Esta plataforma coloca o servidor de acesso remoto na sua própria infraestrutura (VPS)
- Custo: apenas o servidor (~R$ 200–500/mês) em vez de licenças por usuário
- Seus dados nunca saem do seu controle
- Código aberto: qualquer pessoa pode verificar que não há "porta dos fundos" no código

1.3 **O que você vai ter ao final**
- Diagrama visual simplificado da plataforma (redesenhar o diagrama ASCII das specs de forma mais amigável)
- Lista das funcionalidades: gestão de dispositivos, gestão de técnicos, histórico de sessões, instalador personalizado com o nome da sua empresa

---

### SEÇÃO 2: GLOSSÁRIO COMPLETO DAS TECNOLOGIAS

**Para cada tecnologia listada abaixo, a IA deve escrever:**
- **O que é** (1 parágrafo, analogia obrigatória)
- **Para que serve neste projeto** (1 parágrafo específico)
- **Você precisa aprender a usar?** (Sim/Não/Parcialmente — e o porquê)

**Tecnologias a explicar (obrigatórias):**

#### 2.1 Linux (Ubuntu 22.04 LTS)
- Analogia sugerida: "O Linux é o sistema operacional do servidor — pense nele como o Windows, mas desenvolvido para computadores que ficam ligados 24 horas por dia sem interface gráfica."
- Explique o que é uma distribuição, o que é Ubuntu, o que significa LTS (Long Term Support)
- Explique que os comandos são digitados em um "terminal" (uma janela de texto)

#### 2.2 VPS (Virtual Private Server)
- Analogia: "Uma VPS é como alugar um computador em um datacenter. Você não vê o computador fisicamente, mas ele fica ligado 24h e você acessa ele pela internet."
- Explique a diferença entre hospedagem compartilhada, VPS e servidor dedicado
- Explique os requisitos mínimos: 4 vCPU, 8 GB RAM, 100 GB SSD
- Cite exemplos de provedores: DigitalOcean, Hetzner, AWS Lightsail, Vultr, Linode

#### 2.3 Docker e Docker Compose
- Analogia: "Docker é como uma caixa de papelão que contém um programa e tudo que ele precisa para funcionar. Não importa em qual computador você abrir a caixa — vai funcionar igual."
- Explique o que é uma imagem Docker vs. um container
- Explique que o Docker Compose é como uma "receita" que diz quais caixas (containers) usar e como elas se conectam
- Explique que este projeto usa Docker Compose para subir todos os serviços de uma vez

#### 2.4 RustDesk (hbbs e hbbr)
- Analogia: "RustDesk é o motor principal do sistema. É o programa de acesso remoto em si. O hbbs é como uma 'lista telefônica' que sabe onde cada computador está. O hbbr é como uma 'central de retransmissão' para quando dois computadores não conseguem se conectar diretamente."
- Explique a diferença entre conexão direta (P2P) e via relay
- Explique por que a comunicação é criptografada de ponta a ponta
- Explique o que é o cliente white-label: o instalador personalizado com o nome da sua empresa

#### 2.5 NestJS e a API
- Analogia: "A API é como um garçom em um restaurante. O portal web faz o pedido (ex: 'mostre os dispositivos'), o garçom (API) leva o pedido para a cozinha (banco de dados), e traz de volta a resposta."
- Explique que NestJS é um framework para criar APIs em Node.js
- Explique o que é TypeScript (JavaScript com "tipos" para evitar erros)
- O leitor NÃO precisa saber programar para usar — apenas para modificar

#### 2.6 React (Frontend)
- Analogia: "React é a tecnologia que cria as telas que você vê no navegador — os portais de administração e do técnico."
- Explique que existem dois portais: um para administradores e um para técnicos
- O leitor NÃO precisa saber React para usar o sistema

#### 2.7 PostgreSQL (Banco de Dados)
- Analogia: "O banco de dados é como uma planilha Excel gigante e muito organizada. Nele ficam guardadas todas as informações: dispositivos cadastrados, histórico de sessões, usuários, etc."
- Explique que o PostgreSQL é acessado internamente — nunca exposto à internet
- Explique a importância do backup diário

#### 2.8 Redis
- Analogia: "Redis é como um bloco de anotações muito rápido. Quando a API precisa de uma informação que busca com frequência (ex: 'esse dispositivo está online?'), ela guarda no Redis para não ter que perguntar ao banco de dados toda vez."
- Explique TTL (tempo de expiração)
- Explique que Redis é efêmero — dados podem ser perdidos, e tudo bem

#### 2.9 Keycloak (Autenticação)
- Analogia: "Keycloak é o porteiro do sistema. Ele cuida de login, senhas, autenticação em dois fatores (MFA) e controla quem tem permissão de fazer o quê."
- Explique SSO (Single Sign-On): entrar uma vez e ter acesso a tudo
- Explique MFA/TOTP: o código de 6 dígitos do Google Authenticator
- Explique o que é RBAC: diferentes níveis de permissão para admin, técnico, visualizador, auditor

#### 2.10 Nginx (Proxy Reverso)
- Analogia: "Nginx é como a recepção de um prédio. Quando alguém chega (uma requisição da internet), a recepção (Nginx) verifica se é HTTPS seguro e encaminha a pessoa para o departamento certo (API, portal admin, portal técnico, etc.)."
- Explique TLS/HTTPS e por que é obrigatório
- Explique o certificado SSL gratuito via Let's Encrypt

#### 2.11 Prometheus + Grafana + Loki (Observabilidade)
- Analogia: "Prometheus é como um médico que faz exames periódicos no sistema. Grafana é o laudo — um painel visual com gráficos. Loki é o arquivo de todos os registros (logs) do que aconteceu."
- Explique o que são métricas vs. logs
- Explique que alertas podem ser configurados (ex: servidor com 90% de CPU → envia email)

#### 2.12 GitHub Actions (CI/CD)
- Analogia: "CI/CD é como uma linha de montagem automática. Quando um desenvolvedor envia código novo, a linha de montagem automaticamente testa, empacota e instala o código no servidor — sem precisar fazer isso manualmente."
- Explique o que é pipeline de CI/CD
- Explique que o build do cliente RustDesk (instalador .exe) também é gerado automaticamente
- O leitor só precisa entender isso se for modificar o código

#### 2.13 DNS (Domain Name System)
- Analogia: "DNS é como a lista telefônica da internet. Quando você digita 'admin.suaempresa.com', o DNS traduz esse nome para o endereço IP real do servidor."
- Explique os registros do tipo A
- Liste todos os subdomínios necessários com exemplos

#### 2.14 SSH (Secure Shell)
- Analogia: "SSH é um 'controle remoto seguro' para o servidor. Você abre um terminal no seu computador e, como mágica, está digitando comandos diretamente no servidor que está em outro lugar do mundo."
- Explique o que é uma chave SSH vs. senha
- Mostre o comando básico de conexão: `ssh usuario@ip-do-servidor`

#### 2.15 Git
- Analogia: "Git é um sistema de versionamento — pense nele como o histórico de alterações do Word, mas para código. Ele guarda cada mudança feita no projeto."
- Explique que o código do projeto fica em um repositório (GitHub)
- O leitor precisa saber apenas: `git clone`, `git pull`, `git push`

---

### SEÇÃO 3: PRÉ-REQUISITOS

**3.1 O que você precisa ter antes de começar**

Liste de forma clara:
- [ ] Uma VPS com Ubuntu 22.04 LTS (mínimo: 4 vCPU, 8 GB RAM, 100 GB SSD)
- [ ] Um domínio registrado (ex: suaempresa.com) — explique como comprar e onde
- [ ] Acesso SSH ao servidor (IP, usuário e senha ou chave)
- [ ] Uma conta no GitHub (gratuita) — para o pipeline de CI/CD
- [ ] Um app autenticador no celular (Google Authenticator ou Authy) — para MFA
- [ ] Cerca de 2 a 4 horas de tempo disponível

**3.2 Conhecimentos mínimos necessários**
- Saber usar um terminal (abrir e digitar comandos)
- Saber copiar e colar texto
- Não é necessário saber programar

**3.3 Onde comprar / contratar cada item**
- Para cada item do pré-requisito, indique serviços concretos com links e faixa de preço em reais

---

### SEÇÃO 4: PREPARAÇÃO DO SERVIDOR

**4.1 Conectando ao servidor pela primeira vez**

Explique passo a passo:
- Como abrir o terminal no Windows (PowerShell ou PuTTY), Mac e Linux
- O comando de conexão SSH com exemplo concreto
- O que significa "The authenticity of host can't be established" e por que é seguro confirmar na primeira vez

**4.2 Atualização inicial do sistema**

```bash
sudo apt update && sudo apt upgrade -y
```
Explique: "Este comando atualiza a lista de programas disponíveis (`apt update`) e depois instala as atualizações (`apt upgrade`). O `-y` significa 'sim para tudo' — confirma automaticamente."

**4.3 Instalação do Docker**

Forneça o passo a passo completo de instalação do Docker no Ubuntu 22.04:
- Remover versões antigas (se houver)
- Adicionar repositório oficial do Docker
- Instalar Docker Engine e Docker Compose
- Verificar instalação: `docker --version` e `docker compose version`
- Adicionar o usuário atual ao grupo docker (para não precisar de `sudo` sempre)

**4.4 Instalação do Git**

```bash
sudo apt install git -y
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

**4.5 Configuração do Firewall (UFW)**

Explique o que é firewall e por que precisamos abrir portas específicas:

| Porta | Protocolo | Serviço | Por que abrir |
|-------|-----------|---------|---------------|
| 22 | TCP | SSH | Acesso ao servidor |
| 80 | TCP | HTTP | Redirecionamento para HTTPS |
| 443 | TCP | HTTPS | Portal web seguro |
| 21115 | TCP | hbbs | Registro do cliente RustDesk |
| 21116 | TCP/UDP | hbbs | Heartbeat e NAT |
| 21117 | TCP | hbbr | Relay de sessões |
| 21118 | TCP | hbbs | WebSocket |
| 21119 | TCP | hbbr | WebSocket relay |

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 21115/tcp
sudo ufw allow 21116/tcp
sudo ufw allow 21116/udp
sudo ufw allow 21117/tcp
sudo ufw allow 21118/tcp
sudo ufw allow 21119/tcp
sudo ufw enable
sudo ufw status
```

---

### SEÇÃO 5: CONFIGURAÇÃO DO DNS

**5.1 Por que precisamos de DNS**

Explique que o servidor precisa de domínios para:
- Os clientes RustDesk saberem como chegar ao servidor
- O certificado SSL funcionar
- Os portais web terem URLs amigáveis

**5.2 Registros DNS necessários**

Para cada registro, explique:
- O que é o subdomínio
- Para que ele serve
- Como configurar no painel DNS do seu provedor (com screenshot descrito em texto)

| Subdomínio | Tipo | Valor | Descrição |
|-----------|------|-------|-----------|
| `suporte.suaempresa.com` | A | IP_DO_SERVIDOR | Endereço do servidor hbbs (embutido no cliente) |
| `relay.suaempresa.com` | A | IP_DO_SERVIDOR | Endereço do servidor de relay |
| `api.suaempresa.com` | A | IP_DO_SERVIDOR | API REST da plataforma |
| `admin.suaempresa.com` | A | IP_DO_SERVIDOR | Portal de administração |
| `portal.suaempresa.com` | A | IP_DO_SERVIDOR | Portal do técnico |
| `auth.suaempresa.com` | A | IP_DO_SERVIDOR | Servidor de autenticação (Keycloak) |
| `downloads.suaempresa.com` | A | IP_DO_SERVIDOR | Download do cliente RustDesk |

**5.3 Verificando a propagação do DNS**

Explique o que é propagação de DNS (pode levar até 24h) e como verificar:
```bash
nslookup suporte.suaempresa.com
# ou
dig suporte.suaempresa.com
```

---

### SEÇÃO 6: INSTALANDO OS CERTIFICADOS SSL (HTTPS)

Explique o que é HTTPS e por que é obrigatório (dados criptografados + confiança do navegador).

Explique que o Let's Encrypt é um serviço **gratuito** que emite certificados SSL.

**6.1 Instalação do Certbot**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**6.2 Emissão dos certificados**
```bash
sudo certbot certonly \
  --nginx \
  --agree-tos \
  --email admin@suaempresa.com \
  -d suporte.suaempresa.com \
  -d relay.suaempresa.com \
  -d api.suaempresa.com \
  -d admin.suaempresa.com \
  -d portal.suaempresa.com \
  -d auth.suaempresa.com \
  -d downloads.suaempresa.com
```

Explique cada linha do comando.

**6.3 Renovação automática**
Explique que o certbot já configura a renovação automática, e como verificar:
```bash
sudo certbot renew --dry-run
```

---

### SEÇÃO 7: BAIXANDO E CONFIGURANDO O PROJETO

**7.1 Clonando o repositório**
```bash
sudo mkdir -p /opt/remote-support
cd /opt/remote-support
git clone https://github.com/suaempresa/remote-support-platform.git .
```

**7.2 Criando o arquivo de configuração (.env)**

Explique o que é um arquivo `.env` e por que ele existe (guardar senhas e configurações fora do código):

```bash
cp .env.example .env
nano .env
```

Documente **cada variável** do arquivo `.env`, com:
- Nome da variável
- O que ela configura
- Um exemplo de valor válido
- Se é obrigatória ou opcional
- Como gerar senhas seguras (use: `openssl rand -base64 32`)

**Variáveis obrigatórias a documentar:**

```env
# === DOMÍNIOS ===
DOMAIN_HBBS=suporte.suaempresa.com
DOMAIN_RELAY=relay.suaempresa.com
DOMAIN_API=api.suaempresa.com
DOMAIN_ADMIN=admin.suaempresa.com
DOMAIN_PORTAL=portal.suaempresa.com
DOMAIN_AUTH=auth.suaempresa.com
DOMAIN_DOWNLOADS=downloads.suaempresa.com

# === BANCO DE DADOS ===
POSTGRES_USER=remote_support_user
POSTGRES_PASSWORD=[GERE UMA SENHA FORTE - veja como abaixo]
POSTGRES_DB=remote_support_db

# === REDIS ===
REDIS_PASSWORD=[GERE UMA SENHA FORTE]

# === KEYCLOAK ===
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=[GERE UMA SENHA FORTE]
KEYCLOAK_DB_PASSWORD=[GERE UMA SENHA FORTE]

# === API ===
JWT_SECRET=[GERE UMA SENHA FORTE]
API_KEY_INTERNAL=[GERE UMA SENHA FORTE]

# === EMPRESA ===
COMPANY_NAME=Sua Empresa de TI
APP_NAME=SuporteERP
```

---

### SEÇÃO 8: SUBINDO A PLATAFORMA

**8.1 Primeira execução**

Explique que o Docker vai baixar todas as "imagens" (programas empacotados) e pode demorar alguns minutos na primeira vez.

```bash
cd /opt/remote-support
docker compose up -d
```

Explique a flag `-d` (detached mode — roda em background).

**8.2 Verificando se tudo subiu**

```bash
docker compose ps
```

Explique como interpretar a saída: o que significa "Up", "healthy", "Exit 1".

```bash
docker compose logs -f api
docker compose logs -f keycloak
```

Explique que `-f` (follow) mantém os logs rolando em tempo real. Para sair: `Ctrl+C`.

**8.3 Verificação de saúde (healthcheck)**

```bash
curl https://api.suaempresa.com/health
```

Explique o que deve aparecer:
```json
{
  "status": "ok",
  "api": "healthy",
  "database": "healthy",
  "redis": "healthy"
}
```

> ✅ VERIFICAÇÃO: Se você viu o JSON acima, a API está funcionando corretamente.

---

### SEÇÃO 9: CONFIGURAÇÃO INICIAL DO KEYCLOAK

Esta é a seção mais longa e crítica. O leitor nunca usou Keycloak antes.

**9.1 Acessando o painel de administração do Keycloak**
- URL: `https://auth.suaempresa.com`
- Usuário e senha: os que você definiu no `.env`

**9.2 Criando o Realm**
- Explique o que é um "Realm" (um espaço isolado de usuários e configurações — como uma empresa dentro do Keycloak)
- Passo a passo com descrição de cada tela:
  1. Clique em "master" no canto superior esquerdo
  2. Clique em "Create realm"
  3. Nome: `remote-support`
  4. Clique em "Create"

**9.3 Criando os Clients (aplicações)**
Para cada client (portal-admin, portal-technician, api-server):
- O que é um "Client" no Keycloak (uma aplicação que vai usar o Keycloak para login)
- Passo a passo detalhado de criação
- Quais configurações definir (redirect URIs, web origins, etc.)

**9.4 Criando as Roles**
- O que são roles (papéis): admin, technician, viewer, auditor
- O que cada role pode fazer (repetir a tabela de permissões das specs)
- Como criar cada role no Keycloak

**9.5 Configurando o MFA obrigatório**
- Explique que MFA significa que o usuário precisará de senha + código do celular
- Passo a passo para tornar o MFA obrigatório para todos os usuários do realm

**9.6 Criando o primeiro usuário administrador**
- Como criar um usuário no Keycloak
- Como atribuir a role "admin"
- Como forçar redefinição de senha no primeiro acesso
- Como configurar o MFA (QR code + Google Authenticator)

---

### SEÇÃO 10: CONFIGURANDO O CLIENTE RUSTDESK

**10.1 Obtendo a chave pública do servidor**

Explique o que é uma chave criptográfica e por que ela é necessária (garante que o cliente só aceita conexões do SEU servidor):

```bash
docker exec hbbs cat /data/id_ed25519.pub
```

Explique: copie e guarde esta chave — você vai precisar dela.

**10.2 Configurando o build do cliente (GitHub Actions)**

Explique o que vai acontecer: o GitHub vai compilar um instalador `.exe` personalizado com:
- O endereço do seu servidor embutido
- O nome da sua empresa
- Sua logo

**Passo a passo para configurar os secrets no GitHub:**
1. Acesse o repositório no GitHub
2. Vá em Settings → Secrets and variables → Actions
3. Clique em "New repository secret"
4. Crie cada secret listado abaixo:

| Secret | Valor |
|--------|-------|
| `SERVER_HOST` | suporte.suaempresa.com |
| `RELAY_HOST` | relay.suaempresa.com |
| `RUSTDESK_PUBLIC_KEY` | [a chave que você copiou no passo anterior] |
| `DEPLOY_SSH_KEY` | [sua chave SSH privada] |
| `PROD_SERVER_IP` | [IP do servidor] |

**10.3 Gerando o instalador**

```bash
git tag v1.0.0
git push origin v1.0.0
```

Explique: isso cria uma "etiqueta" de versão que dispara automaticamente o build do instalador. O processo leva de 25 a 45 minutos.

Como acompanhar o progresso: GitHub → Actions → build-client.yml

**10.4 Instalando o cliente nos computadores dos clientes**
- O instalador ficará disponível em: `https://downloads.suaempresa.com/SuporteERP-1.0.0.exe`
- O cliente já vem pré-configurado com o servidor — não precisa configurar nada
- Execute o instalador como administrador no Windows

---

### SEÇÃO 11: USANDO A PLATAFORMA

**11.1 Portal do Administrador**
URL: `https://admin.suaempresa.com`

Explique cada seção do portal:

**Dashboard**
- O que você vê: número de dispositivos online, sessões ativas, alertas
- Como interpretar os gráficos

**Gestão de Dispositivos**
- Como cadastrar um dispositivo manualmente
- Como importar em lote via CSV (com modelo do arquivo)
- Como organizar em grupos (ex: por cliente, por localidade)
- Como ver o histórico de sessões de um dispositivo

**Gestão de Usuários (Técnicos)**
- Como criar um novo técnico
- Como definir quais dispositivos/grupos o técnico pode acessar
- Como desativar um técnico que saiu da empresa
- Como resetar o MFA de um técnico (quando ele perde o celular)

**Histórico de Sessões**
- Como filtrar por técnico, dispositivo, período
- Como exportar para CSV
- O que cada campo significa: duração, tipo (relay/direto), notas

**Audit Log**
- O que é registrado: todas as ações administrativas
- Como usar para rastrear o que cada usuário fez

**Downloads**
- Como o administrador vê e atualiza a versão do cliente disponível

**11.2 Portal do Técnico**
URL: `https://portal.suaempresa.com`

**Lista de Dispositivos**
- Filtros: online/offline, grupo, nome
- Como iniciar uma sessão: botão "Conectar" abre o RustDesk automaticamente
- O que significa o ícone verde (online) e cinza (offline)

**Durante uma sessão**
- O RustDesk abre com o dispositivo já conectado
- Como adicionar notas à sessão (obrigatório? configurável)
- Como encerrar a sessão

**Histórico pessoal**
- O técnico só vê suas próprias sessões
- Como filtrar e buscar

---

### SEÇÃO 12: MANUTENÇÃO E OPERAÇÃO

**12.1 Backups (CRÍTICO)**

Explique por que backup é essencial e o que acontece se o banco de dados for perdido sem backup.

**Backup do banco de dados:**
```bash
# Criar backup manual
docker exec postgres pg_dump -U remote_support_user remote_support_db \
  | gzip > /opt/backups/remote-support/db-$(date +%Y%m%d-%H%M%S).sql.gz

# Verificar se o arquivo foi criado
ls -lh /opt/backups/remote-support/
```

**Configurando backup automático (cron):**
```bash
crontab -e
# Adicione a linha abaixo (backup todo dia às 2h da manhã):
0 2 * * * docker exec postgres pg_dump -U remote_support_user remote_support_db | gzip > /opt/backups/remote-support/db-$(date +\%Y\%m\%d).sql.gz
```

**Backup das chaves RSA do hbbs (CRÍTICO — sem isso, todos os clientes param de funcionar):**
```bash
docker cp hbbs:/data/id_ed25519 /opt/backups/remote-support/
docker cp hbbs:/data/id_ed25519.pub /opt/backups/remote-support/
```

> ⚠️ ATENÇÃO: As chaves RSA do hbbs são o item mais crítico para backup. Se você perder essas chaves e não tiver backup, TODOS os clientes RustDesk instalados nos computadores dos seus clientes deixarão de funcionar e precisarão ser reinstalados.

**12.2 Atualizando a plataforma**

```bash
cd /opt/remote-support
git pull origin main
docker compose pull
docker compose up -d
docker compose ps
```

Explique: isso baixa as versões mais recentes dos serviços e reinicia apenas os que foram atualizados.

**12.3 Verificando a saúde do sistema**

```bash
# Ver todos os containers e seu status
docker compose ps

# Ver o uso de recursos (CPU, RAM)
docker stats

# Ver logs em tempo real de um serviço específico
docker compose logs -f [nome-do-serviço]
# Exemplos: api, keycloak, hbbs, hbbr, postgres
```

**12.4 Reiniciando serviços**

```bash
# Reiniciar um serviço específico
docker compose restart api

# Reiniciar tudo
docker compose restart

# Parar tudo
docker compose down

# Subir tudo novamente
docker compose up -d
```

**12.5 Acessando o Grafana (monitoramento)**

URL: `https://admin.suaempresa.com/grafana` (ou porta configurada)

Explique os principais dashboards:
- **Overview:** saúde geral de todos os serviços
- **RustDesk:** dispositivos conectados, sessões ativas, uso de relay
- **API:** número de requisições, tempo de resposta, erros
- **Sistema:** CPU, RAM, disco do servidor

**12.6 Comandos úteis para solucionar problemas**

```bash
# Ver os últimos 100 erros de um serviço
docker compose logs --tail=100 api | grep ERROR

# Acessar o banco de dados diretamente (cuidado!)
docker exec -it postgres psql -U remote_support_user -d remote_support_db

# Reiniciar apenas o hbbs (se clientes não estiverem conectando)
docker compose restart hbbs

# Ver quantos dispositivos estão online agora
docker exec -it postgres psql -U remote_support_user -d remote_support_db \
  -c "SELECT COUNT(*) FROM devices WHERE online = true;"
```

---

### SEÇÃO 13: RESOLUÇÃO DE PROBLEMAS COMUNS

Para cada problema, forneça:
- Sintoma: o que o usuário observa
- Causa provável: explicação simples
- Solução passo a passo

**Problemas a cobrir:**

1. **"Os clientes RustDesk não conseguem se conectar ao servidor"**
   - Verificar firewall (portas abertas?)
   - Verificar se hbbs está rodando
   - Verificar se o domínio está apontando para o IP correto

2. **"O portal web não abre / erro 502 Bad Gateway"**
   - Nginx está rodando?
   - O serviço de destino está saudável?
   - Certificado SSL expirado?

3. **"Não consigo fazer login / erro de credenciais"**
   - Keycloak está rodando?
   - Usuário existe no Keycloak?
   - Senha expirou?

4. **"Perdeu o acesso MFA (perdeu o celular)"**
   - Passo a passo para admin resetar o MFA de um usuário no Keycloak

5. **"O servidor está lento / com pouca memória"**
   - Como verificar uso de recursos: `docker stats`
   - Qual serviço está consumindo mais
   - Quando considerar upgrade da VPS

6. **"O build do cliente não gerou o .exe"**
   - Como verificar o log do GitHub Actions
   - Erros comuns: secrets não configurados, tempo de build excedido

7. **"O banco de dados está cheio / disco cheio"**
   - Como verificar uso de disco: `df -h`
   - Como limpar logs antigos do Docker
   - Como fazer limpeza de sessões antigas

---

### SEÇÃO 14: ESCALABILIDADE — QUANDO E COMO CRESCER

**14.1 Indicadores de que você precisa crescer**
- Mais de 200 dispositivos conectados
- CPU acima de 80% constantemente
- Sessões remotas lentas (relay sobrecarregado)

**14.2 Adicionando um servidor de relay adicional**
Explique de forma simples como adicionar um hbbr em outro servidor para:
- Melhorar performance geográfica
- Distribuir a carga de sessões

**14.3 Upgrade da VPS**
- Tabela de configurações recomendadas por número de dispositivos:

| Dispositivos | vCPU | RAM | Disco |
|-------------|------|-----|-------|
| Até 200 | 2 | 4 GB | 40 GB |
| 100–500 | 4 | 8 GB | 100 GB |
| 500–1000 | 8 | 16 GB | 200 GB |

---

### SEÇÃO 15: SEGURANÇA — BOAS PRÁTICAS OBRIGATÓRIAS

**15.1 Checklist de segurança pós-instalação**

- [ ] MFA ativado e obrigatório para todos os usuários
- [ ] Senhas fortes geradas para todos os serviços (.env)
- [ ] Firewall configurado e ativo (UFW)
- [ ] Certificados SSL válidos e renovação automática configurada
- [ ] Backup automático funcionando (teste restaurar!)
- [ ] Porta do banco de dados (5432) NÃO exposta para internet
- [ ] Acesso SSH por chave (não por senha)
- [ ] Usuário `root` desabilitado para SSH

**15.2 Como desabilitar login root por SSH**
```bash
sudo nano /etc/ssh/sshd_config
# Altere: PermitRootLogin no
# Altere: PasswordAuthentication no
sudo systemctl restart sshd
```

> ⚠️ ATENÇÃO: Faça isso somente DEPOIS de garantir que consegue fazer login com seu usuário regular e chave SSH. Caso contrário, você pode se trancar fora do servidor.

**15.3 Mantendo o sistema atualizado**
```bash
sudo apt update && sudo apt upgrade -y
docker compose pull && docker compose up -d
```

---

### SEÇÃO 16: REFERÊNCIA RÁPIDA

**16.1 URLs da plataforma**
| Serviço | URL |
|---------|-----|
| Portal Admin | https://admin.suaempresa.com |
| Portal Técnico | https://portal.suaempresa.com |
| API (docs) | https://api.suaempresa.com/api/docs |
| Keycloak Admin | https://auth.suaempresa.com |
| Download do cliente | https://downloads.suaempresa.com |

**16.2 Comandos mais usados**
```bash
# Status de todos os serviços
docker compose ps

# Reiniciar um serviço
docker compose restart [serviço]

# Ver logs
docker compose logs -f [serviço]

# Backup do banco
docker exec postgres pg_dump -U USER DB | gzip > backup.sql.gz

# Atualizar tudo
git pull && docker compose pull && docker compose up -d
```

**16.3 Contatos e suporte**
- Documentação do RustDesk: https://rustdesk.com/docs
- Documentação do Keycloak: https://www.keycloak.org/docs
- Fórum da comunidade RustDesk: https://github.com/rustdesk/rustdesk/discussions

---

## INSTRUÇÕES FINAIS PARA A IA

1. **Tom:** Amigável, paciente, nunca condescendente. Imagine que você está ajudando um amigo pessoalmente.

2. **Comprimento:** Não se preocupe com tamanho. Documentação técnica precisa ser completa. Prefira pecar pelo excesso de explicação.

3. **Exemplos reais:** Use sempre exemplos concretos. Em vez de "exemplo.com", use "suaempresa.com.br" ou "tecnosuporte.com.br".

4. **Capturas de tela:** Como você não pode incluir imagens reais, descreva em detalhes o que o leitor verá na tela (ex: "Você verá um botão azul com o texto 'Create' no canto superior direito").

5. **Progressão:** Sempre siga a ordem das seções. Não pule etapas. Cada seção assume que as anteriores foram concluídas.

6. **Verificações:** Inclua uma verificação (✅) ao final de cada seção principal para o leitor confirmar que o passo foi bem-sucedido antes de continuar.

7. **Idioma:** Português do Brasil. Termos técnicos em inglês podem ser mantidos com tradução entre parênteses na primeira ocorrência.

8. **Formatação:** Use Markdown. Cabeçalhos hierárquicos, tabelas, blocos de código, listas com checkbox onde apropriado.

---

## METADADOS

| Campo | Valor |
|-------|-------|
| Projeto | Plataforma de Suporte Remoto Corporativo (RustDesk) |
| Audiência | Iniciantes e não-programadores |
| Idioma | Português (Brasil) |
| Versão da plataforma | v1.0.0 |
| Atualizado em | Março de 2026 |
| Responsável | Equipe de Desenvolvimento |
| Aprovado por | — |
