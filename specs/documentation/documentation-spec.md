# Spec de Documentação — Guia Completo para Iniciantes

> **Arquivo:** `specs/documentation-spec.md`
> **Versão:** 1.0.0
> **Status:** Aprovado
> **Objetivo:** Instrução para geração de documentação acessível a qualquer pessoa, inclusive quem nunca programou

---

## INSTRUÇÕES PARA A INTELIGÊNCIA ARTIFICIAL

Este arquivo é um **roteiro detalhado** para que uma IA gere a documentação completa do projeto **RustDesk Platform** (plataforma self-hosted de suporte remoto corporativo). A documentação deve ser escrita **como se o leitor nunca tivesse visto código ou infraestrutura na vida**.

### Princípios de escrita obrigatórios

1. **Zero suposições de conhecimento prévio** — Antes de usar qualquer termo técnico, explique o que ele significa em linguagem simples. Exemplo: antes de falar "Docker", explique o que é Docker com uma analogia do cotidiano.
2. **Analogias do mundo real** — Use comparações com situações do dia a dia para explicar conceitos abstratos.
3. **Passo a passo numerado** — Cada procedimento deve ser uma sequência numerada, com um comando por vez, nunca agrupados.
4. **Explicação de cada comando** — Após cada bloco de código, explique em português o que aquele comando faz e por que é necessário.
5. **Antecipação de erros comuns** — Inclua uma seção "Se der errado" em cada etapa crítica.
6. **Glossário embutido** — Sempre que um termo técnico aparecer pela primeira vez, marque-o em **negrito** e forneça uma explicação entre parênteses logo após.
7. **Capturas de tela ou diagramas ASCII** — Indique onde capturas de tela devem ser inseridas para guiar visualmente o leitor.
8. **Tom encorajador** — Use linguagem positiva e tranquilizadora. Erros são normais e fazem parte do aprendizado.

---

## ESTRUTURA DA DOCUMENTAÇÃO A SER GERADA

A IA deve gerar os seguintes documentos, **nesta ordem**:

---

### DOCUMENTO 1 — `README.md` (Página Inicial do Projeto)

**Tamanho esperado:** 300–500 palavras
**Tom:** Apresentação amigável, como uma conversa

**Conteúdo obrigatório:**

1. **O que é este projeto?**
   - Explique em 2 parágrafos o que a plataforma faz, como se estivesse explicando para um amigo que nunca trabalhou com tecnologia.
   - Analogia sugerida: "Imagine um controle remoto para computadores, mas que funciona pela internet e pertence totalmente à sua empresa."

2. **Quem pode usar?**
   - Empresas de suporte técnico a sistemas ERP
   - Equipes de TI que querem parar de pagar por TeamViewer / AnyDesk
   - Qualquer empresa que precise acessar computadores de clientes remotamente

3. **O que você vai conseguir fazer com isso?**
   - Lista em linguagem simples (sem jargão técnico)
   - Acessar computadores de clientes pela internet
   - Ver quem está online e quem não está
   - Registrar cada sessão de suporte (quando começou, quando terminou, quem atendeu)
   - Controlar quem tem permissão para acessar qual computador
   - Criar um instalador personalizado com o nome e logo da sua empresa

4. **Quanto custa?**
   - Explicar que o software é gratuito (open source / AGPL)
   - Custo real = servidor VPS (aproximadamente R$ 150–300/mês dependendo do provedor)
   - Comparação com alternativas comerciais: TeamViewer custa R$ 800–5.000/mês

5. **O que você vai precisar antes de começar?**
   - Um computador com acesso à internet para seguir este guia
   - Um servidor VPS (explicar o que é — veja Documento 2)
   - Um domínio de internet (explicar o que é)
   - Aproximadamente 2–3 horas para a instalação completa

6. **Como navegar nesta documentação?**
   - Mapa de navegação: link para cada documento na ordem certa

---

### DOCUMENTO 2 — `docs/01-conceitos-basicos.md` (O que você precisa saber antes de começar)

**Tamanho esperado:** 1.500–2.500 palavras
**Tom:** Professoral, paciente, com muitas analogias

**Seções obrigatórias:**

#### 2.1 O que é um Servidor VPS?

Explique com esta analogia:
> "Imagine que você precisa de um escritório para a sua empresa, mas não quer comprar um prédio inteiro. Você aluga uma sala em um prédio compartilhado. Um **VPS** (Virtual Private Server) é exatamente isso, mas no mundo digital: você aluga um espaço em um servidor físico que fica em um datacenter, e esse espaço se comporta como se fosse um servidor inteiro só seu."

- Quais provedores de VPS existem? (lista com links)
  - DigitalOcean (americano, fácil para iniciantes)
  - Hetzner (alemão, ótimo custo-benefício)
  - Vultr (americano, bom suporte)
  - Hostinger VPS (opção com suporte em português)
  - Contabo (alemão, muito espaço em disco)
  - AWS Lightsail (Amazon, mais robusto)
- Qual configuração mínima escolher?
  - **Mínimo:** 2 vCPUs, 4 GB RAM, 40 GB SSD (para até 200 dispositivos)
  - **Recomendado:** 4 vCPUs, 8 GB RAM, 100 GB SSD (para até 500 dispositivos)
  - Sistema operacional: Ubuntu 22.04 LTS (sempre escolha esta opção)
- Quanto vai custar? (faixa de preço em USD e BRL aproximado)

#### 2.2 O que é um Domínio de Internet?

Explique com analogia:
> "Um **domínio** é como o endereço da sua empresa. Assim como um cliente precisa do seu endereço para te visitar, os computadores precisam de um domínio para encontrar o seu servidor. Em vez de decorar '167.234.12.89' (que é o IP do servidor), as pessoas usam 'suporte.suaempresa.com.br'."

- Onde comprar um domínio?
  - Registro.br (para domínios .com.br — mais barato e em português)
  - GoDaddy, Namecheap, Cloudflare (para domínios .com internacionais)
- Qual domínio escolher?
  - Sugestão: usar um subdomínio de um domínio que a empresa já tenha
  - Exemplo: se a empresa tem `suaempresa.com.br`, usar `suporte.suaempresa.com.br`
- O que são subdomínios?
  - Analogia: "Se o domínio é o endereço da empresa, o subdomínio é o ramal ou sala específica dentro dela."

#### 2.3 O que é Docker?

Explique com analogia:
> "Imagine que você precisa montar uma equipe com 10 especialistas diferentes: um segurança, um atendente, um gerente, um analista... Cada um tem suas ferramentas, seu uniforme e seu espaço de trabalho específico. O **Docker** é como um sistema de caixas padronizadas: cada especialista (programa) fica dentro de sua própria caixa, com tudo que precisa, sem interferir nos outros. O Docker garante que tudo funcione igual em qualquer lugar — seja no seu computador, no servidor alugado, em qualquer lugar do mundo."

- Por que usamos Docker neste projeto?
  - Instalação simplificada (um único arquivo configura tudo)
  - Facilidade de atualização e rollback
  - Isolamento de serviços (problema em um não afeta os outros)
- O que é Docker Compose?
  - "Se o Docker é cada caixa individual, o Docker Compose é a lista de todas as caixas que precisam estar abertas ao mesmo tempo e como elas se comunicam entre si."

#### 2.4 O que é HTTPS / TLS / Certificado SSL?

Explique com analogia:
> "Quando você acessa um site bancário, nota um cadeado na barra de endereços do navegador? Isso significa que a comunicação entre seu computador e o banco está **criptografada** — como uma conversa em código que só você e o banco entendem. O **certificado TLS** (também chamado de SSL) é o que garante essa proteção. Neste projeto, usamos o **Let's Encrypt**, um serviço gratuito que emite esses certificados automaticamente."

- Por que isso é obrigatório?
  - Protege senhas e dados dos técnicos
  - Navegadores modernos bloqueiam sites sem HTTPS

#### 2.5 O que é o RustDesk?

- Explique que é um programa open source (código aberto, gratuito, auditável)
- Como ele funciona: cliente instalado no computador do cliente + servidor na VPS
- Comparação com TeamViewer: mesma função, custo zero de licença
- O que é "self-hosted": você controla 100% — nenhum dado passa por servidores de terceiros

#### 2.6 Mapa dos Serviços da Plataforma

Apresente um diagrama ASCII simplificado (diferente do técnico nas specs) com linguagem simples:

```
DISPOSITIVO DO CLIENTE (Windows)
  └── Programa RustDesk instalado
        └── Conecta ao SERVIDOR DA SUA EMPRESA
               │
               ├── hbbs → "Lista telefônica" (sabe o ID de cada dispositivo)
               ├── hbbr → "Operador de chamadas" (faz a ligação quando necessário)
               ├── API  → "Gerente" (controla permissões e registra tudo)
               ├── Portal Admin → "Painel de controle" (interface web para o dono)
               └── Portal Técnico → "Mesa de trabalho" (interface para os técnicos)
```

#### 2.7 O que é Keycloak?

- Analogia: "É como o porteiro do prédio. Ele verifica se você tem autorização para entrar, pede sua senha e também confirma sua identidade com um segundo fator (o código do celular)."
- Por que não simplesmente criar um sistema de login normal?
  - Keycloak já resolve problemas difíceis: MFA, SSO, segurança comprovada
- O que é MFA / Autenticação de Dois Fatores?
  - Explique: "Além da senha, o sistema pede um código de 6 dígitos gerado pelo seu celular a cada 30 segundos. Mesmo que alguém roube sua senha, não consegue entrar sem o celular."

#### 2.8 Diagrama Geral Simplificado

Inclua orientação para inserir uma imagem mostrando o fluxo completo de forma visual.
`[INSERIR IMAGEM: diagrama-geral-simplificado.png]`

---

### DOCUMENTO 3 — `docs/02-preparando-o-servidor.md` (Configurando seu VPS do zero)

**Tamanho esperado:** 2.000–3.500 palavras
**Tom:** Guia prático passo a passo, como receita de bolo

**Pré-requisito declarado:** "Você já tem um VPS contratado com Ubuntu 22.04 LTS e conhece o IP do servidor."

**Seções obrigatórias:**

#### 3.1 Acessando o Servidor pela Primeira Vez (SSH)

- O que é SSH?
  - Analogia: "É uma linha telefônica segura entre o seu computador e o servidor. Você digita comandos no seu computador e eles são executados no servidor, que pode estar do outro lado do mundo."
- Como instalar o cliente SSH?
  - Windows: PowerShell já tem SSH embutido (Windows 10+) — não precisa instalar nada
  - Mac: Terminal já tem SSH — não precisa instalar nada
  - Linux: Terminal já tem SSH
- Comando para conectar:
  ```bash
  ssh root@SEU_IP_AQUI
  ```
  - Explicação linha a linha: o que é `ssh`, o que é `root`, o que é o IP
- O que fazer quando aparecer a pergunta `Are you sure you want to continue connecting? (yes/no)`?
  - Explicar que é normal na primeira conexão, digitar `yes`

#### 3.2 Criando um Usuário Seguro (Não usar root para tudo)

- Por que não usar o usuário `root` diretamente?
  - Analogia: "O usuário root é como a chave mestre de um prédio: abre tudo. Se alguém mal-intencionado conseguir acesso, pode destruir tudo. Por isso, criamos um usuário comum para o dia a dia."
- Comandos passo a passo com explicação de cada um:
  ```bash
  adduser deploy
  ```
  ```bash
  usermod -aG sudo deploy
  ```
  ```bash
  su - deploy
  ```

#### 3.3 Atualizando o Sistema

- Por que atualizar?
  - "Assim como o Windows pede para instalar atualizações de segurança, o Linux também precisa ser atualizado."
- Comandos com explicação:
  ```bash
  sudo apt update
  ```
  ```bash
  sudo apt upgrade -y
  ```
- O que significa cada parte do comando
- Quanto tempo leva (estimativa)
- Se der errado: o que fazer se aparecer mensagens de erro

#### 3.4 Instalando o Docker

- Explicar o que vai acontecer nesta etapa
- Script de instalação oficial (com link para verificar autenticidade)
- Comandos passo a passo com explicação de cada um
- Como verificar se a instalação funcionou:
  ```bash
  docker --version
  ```
- Como verificar se o Docker Compose está instalado:
  ```bash
  docker compose version
  ```

#### 3.5 Configurando o Firewall

- O que é um Firewall?
  - Analogia: "É como o interfone do prédio. Só entra quem você autorizar. Por padrão, bloqueamos tudo e só abrimos as portas necessárias."
- Quais portas abrir e por quê?

  | Porta | Protocolo | Para que serve | Analogia |
  |-------|-----------|---------------|----------|
  | 22 | TCP | Acesso SSH (administração) | Porta dos fundos (só para funcionários) |
  | 80 | TCP | HTTP (redirecionamento para HTTPS) | Entrada principal |
  | 443 | TCP | HTTPS (site seguro) | Entrada principal com segurança |
  | 21115 | TCP | RustDesk (registro de dispositivos) | Balcão de atendimento |
  | 21116 | TCP/UDP | RustDesk (comunicação de dispositivos) | Linha direta com o cliente |
  | 21117 | TCP | RustDesk (relay de sessões) | Operador de chamadas |
  | 21118 | TCP | RustDesk (WebSocket) | Canal alternativo |
  | 21119 | TCP | RustDesk (Relay WebSocket) | Canal alternativo seguro |

- Comandos para configurar o UFW (firewall do Ubuntu) com explicação:
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
  ```
- Como verificar se funcionou:
  ```bash
  sudo ufw status
  ```

#### 3.6 Configurando o DNS

- O que vai acontecer nesta etapa
- Acessar o painel do registrador de domínio (onde comprou o domínio)
- Criar os registros DNS necessários (tabela com explicação de cada um):

  | Subdomínio | Tipo | Valor | Para que serve |
  |-----------|------|-------|---------------|
  | `suporte.suaempresa.com.br` | A | IP_DO_SERVIDOR | Endereço dos clientes RustDesk |
  | `relay.suaempresa.com.br` | A | IP_DO_SERVIDOR | Relay de sessões |
  | `api.suaempresa.com.br` | A | IP_DO_SERVIDOR | API da plataforma |
  | `admin.suaempresa.com.br` | A | IP_DO_SERVIDOR | Portal do administrador |
  | `portal.suaempresa.com.br` | A | IP_DO_SERVIDOR | Portal dos técnicos |
  | `auth.suaempresa.com.br` | A | IP_DO_SERVIDOR | Login (Keycloak) |
  | `downloads.suaempresa.com.br` | A | IP_DO_SERVIDOR | Download do cliente |

- Como saber se o DNS propagou?
  - Usar o site `dnschecker.org` (com link)
  - Quanto tempo demora? (de 5 minutos a 48 horas — normalmente menos de 30 minutos)
- `[INSERIR IMAGEM: exemplo-configuracao-dns.png]`

---

### DOCUMENTO 4 — `docs/03-instalando-a-plataforma.md` (Instalação completa com Docker Compose)

**Tamanho esperado:** 3.000–5.000 palavras
**Tom:** Guia técnico mas acessível, passo a passo rigoroso

**Pré-requisito declarado:** "Você concluiu o Documento 3. Seu servidor tem Docker instalado e os subdomínios já estão apontando para o IP do servidor."

**Seções obrigatórias:**

#### 4.1 Baixando o Projeto

- O que é um repositório Git?
  - Analogia: "É como um Google Drive do código: guarda todas as versões do projeto e permite que várias pessoas trabalhem juntas."
- Instalar o Git e clonar o repositório:
  ```bash
  sudo apt install git -y
  ```
  ```bash
  cd /opt
  ```
  ```bash
  sudo git clone https://github.com/SUA_ORG/remote-support-platform.git remote-support
  ```
  ```bash
  sudo chown -R deploy:deploy /opt/remote-support
  ```
  ```bash
  cd /opt/remote-support
  ```

#### 4.2 Configurando as Variáveis de Ambiente

- O que são variáveis de ambiente?
  - Analogia: "São como as configurações personalizadas do seu carro: velocidade máxima no limitador, temperatura do ar-condicionado padrão. Aqui, você vai configurar senhas, endereços e nomes específicos da sua empresa."
- Copiar o arquivo de exemplo:
  ```bash
  cp .env.example .env
  ```
- Abrir o arquivo para editar:
  ```bash
  nano .env
  ```
- **Tabela completa de todas as variáveis com explicação simples de cada uma:**

  | Variável | O que é | Exemplo |
  |----------|---------|---------|
  | `DOMAIN` | Domínio principal da plataforma | `suaempresa.com.br` |
  | `HBBS_HOST` | Endereço do servidor de IDs do RustDesk | `suporte.suaempresa.com.br` |
  | `HBBR_HOST` | Endereço do relay do RustDesk | `relay.suaempresa.com.br` |
  | `POSTGRES_DB` | Nome do banco de dados | `remote_support` |
  | `POSTGRES_USER` | Usuário do banco de dados | `rs_user` |
  | `POSTGRES_PASSWORD` | Senha do banco de dados (**use uma senha forte!**) | `SenhaForte123!` |
  | `REDIS_PASSWORD` | Senha do Redis (**use uma senha forte!**) | `SenhaRedis456!` |
  | `KEYCLOAK_ADMIN` | Usuário administrador do Keycloak | `admin` |
  | `KEYCLOAK_ADMIN_PASSWORD` | Senha do administrador do Keycloak | `SenhaAdmin789!` |
  | `API_JWT_SECRET` | Chave secreta para tokens JWT (gere uma aleatória) | *(ver instrução abaixo)* |
  | `CERTBOT_EMAIL` | Email para receber alertas de certificado | `ti@suaempresa.com.br` |

- Como gerar uma senha forte e aleatória:
  ```bash
  openssl rand -base64 32
  ```
  - Explicação: este comando gera 32 bytes aleatórios e os converte para texto. Use a saída como senha.
- Como salvar e sair do editor nano: `Ctrl+O` (salvar), `Enter` (confirmar), `Ctrl+X` (sair)

#### 4.3 Iniciando os Serviços pela Primeira Vez

- Explicação do que vai acontecer: "O Docker vai baixar todas as imagens necessárias (como instalar vários programas de uma vez) e iniciá-los. Na primeira vez, pode demorar de 5 a 15 minutos dependendo da velocidade da internet do servidor."
- Subir tudo:
  ```bash
  docker compose up -d
  ```
  - Explicação: `up` = iniciar, `-d` = em segundo plano (sem travar o terminal)
- Verificar se todos os serviços subiram:
  ```bash
  docker compose ps
  ```
  - O que significa cada coluna da saída
  - Como saber se um serviço está com problema (STATUS diferente de "Up")
- Ver os logs em tempo real:
  ```bash
  docker compose logs -f
  ```
  - Como sair: `Ctrl+C`
- Ver logs de um serviço específico:
  ```bash
  docker compose logs -f api
  ```

#### 4.4 Obtendo os Certificados TLS (HTTPS)

- Verificar que o DNS já propagou antes de continuar
- Rodar o Certbot:
  ```bash
  docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email SEU_EMAIL@suaempresa.com.br \
    --agree-tos \
    --no-eff-email \
    -d suporte.suaempresa.com.br \
    -d relay.suaempresa.com.br \
    -d api.suaempresa.com.br \
    -d admin.suaempresa.com.br \
    -d portal.suaempresa.com.br \
    -d auth.suaempresa.com.br \
    -d downloads.suaempresa.com.br
  ```
- O que significa cada linha do comando
- Sinais de sucesso (o que aparece na tela quando dá certo)
- Se der errado: os erros mais comuns e como resolvê-los
  - "Problema: DNS ainda não propagou" — aguardar e tentar novamente
  - "Problema: Porta 80 bloqueada" — verificar o UFW
- Recarregar o Nginx para aplicar os certificados:
  ```bash
  docker compose exec nginx nginx -s reload
  ```

#### 4.5 Verificando que Tudo Funciona

- Teste 1: Acessar a API
  - Abrir o navegador e acessar `https://api.suaempresa.com.br/health`
  - O que deve aparecer: `{"status":"ok"}`
- Teste 2: Acessar o Portal Admin
  - Abrir `https://admin.suaempresa.com.br`
  - Deve aparecer a tela de login do Keycloak
- Teste 3: Verificar o hbbs
  ```bash
  docker compose exec hbbs ls /root/
  ```
  - Deve aparecer os arquivos `id_ed25519` e `id_ed25519.pub`
- `[INSERIR IMAGEM: tela-inicial-portal-admin.png]`
- `[INSERIR IMAGEM: tela-login-keycloak.png]`

#### 4.6 Se Der Errado — Troubleshooting Básico

| Problema | Possível Causa | Como Resolver |
|----------|---------------|---------------|
| Container não sobe (Exit 1) | Erro de configuração no .env | Ver logs: `docker compose logs nome-do-serviço` |
| Site não abre no navegador | DNS não propagou ou porta fechada | Verificar DNS e UFW |
| Certificado não gerou | DNS não propagou | Aguardar e tentar novamente |
| API retorna erro 500 | Banco de dados não inicializou | `docker compose restart api` |

---

### DOCUMENTO 5 — `docs/04-configurando-o-keycloak.md` (Configurando autenticação e usuários)

**Tamanho esperado:** 2.000–3.000 palavras
**Tom:** Guia clínico, muito visual (com indicações de screenshots em cada passo)

**Pré-requisito declarado:** "A plataforma está instalada e rodando. Você consegue acessar `https://auth.suaempresa.com.br`."

**Seções obrigatórias:**

#### 5.1 Primeiro Acesso ao Keycloak

- Acessar `https://auth.suaempresa.com.br`
- Clicar em "Administration Console"
- Entrar com as credenciais definidas no `.env` (`KEYCLOAK_ADMIN` e `KEYCLOAK_ADMIN_PASSWORD`)
- `[INSERIR IMAGEM: tela-login-keycloak-admin.png]`

#### 5.2 Criando o Realm da Plataforma

- O que é um "Realm"?
  - Analogia: "É como um condomínio separado dentro do Keycloak. O condomínio padrão se chama 'master' e é só para o administrador do Keycloak. Vamos criar um novo condomínio chamado 'remote-support' especificamente para a nossa plataforma."
- Passo a passo com imagens indicadas em cada etapa
- Configurações do Realm:
  - Nome: `remote-support`
  - Display Name: `Plataforma de Suporte Remoto`
  - Default Locale: `pt-BR`

#### 5.3 Configurando MFA Obrigatório

- O que vai acontecer: todos os usuários serão obrigados a configurar o Google Authenticator (ou similar) no primeiro login
- Passo a passo no console do Keycloak
- Como testar que o MFA está funcionando

#### 5.4 Criando o Primeiro Administrador da Plataforma

- Diferença entre "admin do Keycloak" e "admin da Plataforma"
  - "O admin do Keycloak é como o zelador do prédio — ele gerencia a infraestrutura. O admin da Plataforma é o gerente de operações — ele gerencia técnicos e dispositivos."
- Passo a passo para criar o usuário admin da plataforma
- Como atribuir o papel (role) de `admin`

#### 5.5 Criando Técnicos

- Passo a passo para criar um usuário técnico
- O técnico vai receber um email com link para definir a senha
- No primeiro login, o Keycloak vai exigir configurar o MFA
- Como atribuir grupos de dispositivos ao técnico

---

### DOCUMENTO 6 — `docs/05-criando-o-instalador-do-cliente.md` (Build do cliente RustDesk personalizado)

**Tamanho esperado:** 1.500–2.500 palavras
**Tom:** Explicativo, com foco em "o que vai acontecer" antes de cada passo

**Pré-requisito declarado:** "A plataforma está rodando. Você tem acesso ao repositório no GitHub."

**Seções obrigatórias:**

#### 6.1 O que é o Cliente RustDesk Personalizado?

- Explique o conceito de "white-label"
  - Analogia: "Assim como um supermercado vende produtos com sua marca própria (que na verdade são feitos por outra fábrica), você vai criar um instalador com o nome e logo da sua empresa — mas que usa o RustDesk por baixo."
- O que o cliente personalizado faz automaticamente:
  - Conecta ao seu servidor (não ao servidor público do RustDesk)
  - Usa sua chave de segurança (não aceita conexões de outros servidores)
  - Exibe o nome da sua empresa na tela

#### 6.2 Obtendo a Chave Pública do Servidor

- O que é uma chave pública?
  - Analogia: "É como o crachá de identificação da sua empresa. O cliente RustDesk precisa do crachá do servidor para saber que está se conectando ao lugar certo e não a um impostor."
- Como obter a chave:
  ```bash
  docker compose exec hbbs cat /root/id_ed25519.pub
  ```
- Copiar o conteúdo exibido (é uma linha de texto longa)
- Guardar em algum lugar seguro — vai ser necessário no próximo passo

#### 6.3 Configurando o Pipeline de Build (GitHub Actions)

- O que é GitHub Actions?
  - Analogia: "É um robô automático que vive dentro do GitHub. Você configura o que ele deve fazer (as 'actions') e ele executa automaticamente quando você mandar."
- Como configurar os segredos no GitHub:
  - Ir em Settings > Secrets and variables > Actions no repositório
  - Criar os secrets necessários (tabela com nome, descrição e valor de cada um)
  - `[INSERIR IMAGEM: tela-github-secrets.png]`
- Como disparar o build:
  - Criar uma tag de versão:
    ```bash
    git tag v1.0.0
    git push origin v1.0.0
    ```
  - O que acontece depois: o GitHub Actions vai compilar o cliente e criar um arquivo `.exe`
- Como acompanhar o progresso:
  - Ir na aba "Actions" do repositório no GitHub
  - `[INSERIR IMAGEM: tela-github-actions-build.png]`
- Quanto tempo demora? (estimativa: 10–20 minutos)

#### 6.4 Disponibilizando o Instalador para Download

- O arquivo `.exe` gerado pelo pipeline é copiado automaticamente para o servidor
- Verificar que está disponível:
  - Acessar `https://downloads.suaempresa.com.br` no navegador
  - Deve aparecer o arquivo para download
- Como enviar o link de download para clientes:
  - URL direta do instalador: `https://downloads.suaempresa.com.br/SuaEmpresa-Setup.exe`

---

### DOCUMENTO 7 — `docs/06-uso-diario.md` (Como usar a plataforma no dia a dia)

**Tamanho esperado:** 2.000–3.000 palavras
**Tom:** Manual de usuário final, muito visual

**Subseções:**

#### 7.1 Guia do Administrador
- Como adicionar um novo dispositivo de cliente
- Como criar um técnico novo
- Como ver o histórico de sessões
- Como exportar relatórios
- Como ver o dashboard de métricas

#### 7.2 Guia do Técnico
- Como fazer login no portal
- Como ver os dispositivos disponíveis
- Como iniciar uma sessão remota
- Como adicionar notas a uma sessão
- Como ver meu histórico de atendimentos

#### 7.3 Guia do Cliente Final (o usuário que vai receber suporte)
- Como instalar o programa (3 passos simples)
- O que fazer quando o técnico pede para conectar
- Como saber se alguém está conectado no seu computador
- Como fechar a conexão

---

### DOCUMENTO 8 — `docs/07-manutencao-e-backups.md` (Mantendo a plataforma funcionando)

**Tamanho esperado:** 1.500–2.500 palavras
**Tom:** Preventivo e prático

**Seções obrigatórias:**

#### 8.1 Verificando a Saúde da Plataforma

- Rotina diária (5 minutos):
  ```bash
  docker compose ps
  ```
  - O que verificar na saída

#### 8.2 Fazendo Backup dos Dados Críticos

- O que deve ser guardado em backup:
  1. Banco de dados PostgreSQL (contém todos os dados)
  2. Chaves do RustDesk (id_ed25519 e id_ed25519.pub)
  3. Configurações do Keycloak
  4. Arquivo `.env` (com suas senhas — guarde com segurança!)
- Script de backup automático (com explicação linha a linha)
- Como configurar o backup para rodar automaticamente todo dia
- Onde guardar o backup:
  - Opção gratuita: Google Drive (com instrução de como configurar)
  - Opção paga: Amazon S3, Backblaze B2

#### 8.3 Atualizando a Plataforma

- Quando atualizar? (quando houver uma nova versão no repositório)
- Passo a passo seguro para atualizar:
  1. Fazer backup antes de atualizar
  2. Baixar as novidades:
     ```bash
     git pull origin main
     ```
  3. Atualizar as imagens Docker:
     ```bash
     docker compose pull
     ```
  4. Reiniciar com as novas versões:
     ```bash
     docker compose up -d
     ```
  5. Verificar se tudo funciona
- O que fazer se algo der errado? (rollback)

#### 8.4 Monitorando com Grafana

- O que é o Grafana?
  - "É como o painel de controle de um carro: mostra velocidade, temperatura, combustível. O Grafana mostra métricas do seu servidor: uso de CPU, memória, quantas sessões ativas, etc."
- Como acessar: `https://admin.suaempresa.com.br/grafana` (ou endereço configurado)
- Quais dashboards estão disponíveis
- `[INSERIR IMAGEM: dashboard-grafana-principal.png]`

---

### DOCUMENTO 9 — `docs/08-seguranca.md` (Mantendo a plataforma segura)

**Tamanho esperado:** 1.000–1.500 palavras
**Tom:** Direto, com alertas visuais para pontos críticos

**Seções obrigatórias:**

#### 9.1 Checklist de Segurança Pós-Instalação

- [ ] Senhas fortes (mínimo 16 caracteres com letras, números e símbolos) em todas as variáveis do `.env`
- [ ] MFA ativo para todos os usuários (verificar no Keycloak)
- [ ] Firewall configurado com apenas as portas necessárias abertas
- [ ] Arquivo `.env` com permissões restritas:
  ```bash
  chmod 600 /opt/remote-support/.env
  ```
- [ ] Certificados TLS válidos (cadeado verde no navegador)
- [ ] Backup configurado e testado

#### 9.2 O que NUNCA Fazer

- Nunca compartilhar o arquivo `.env` com ninguém
- Nunca abrir a porta 5432 (PostgreSQL) ou 6379 (Redis) no firewall
- Nunca usar senhas fracas ou padrão (como `admin123`)
- Nunca desativar o MFA para "facilitar" o acesso dos técnicos

#### 9.3 O que Fazer se Suspeitar de Invasão

- Passos de resposta a incidente explicados de forma simples
- Contatos e recursos de apoio

---

### DOCUMENTO 10 — `docs/09-perguntas-frequentes.md` (FAQ)

**Tamanho esperado:** 1.000–1.500 palavras

**Perguntas obrigatórias:**

1. Posso usar este projeto sem saber programar?
2. Preciso de um servidor dedicado ou VPS serve?
3. Quantos dispositivos posso gerenciar?
4. O RustDesk funciona em Mac e Linux além de Windows?
5. Como faço para ter dois servidores (um de backup)?
6. Posso usar meu próprio certificado TLS em vez do Let's Encrypt?
7. O que acontece se o servidor cair? Os técnicos perdem o acesso?
8. Como migro de outra plataforma (TeamViewer, AnyDesk) para esta?
9. Posso ver a tela do cliente sem pedir permissão a ele?
10. Quanto de banda de internet o servidor vai consumir?
11. Onde posso pedir ajuda se tiver problemas?
12. Como atualizo para uma versão mais nova da plataforma?

---

### DOCUMENTO 11 — `docs/10-glossario.md` (Dicionário de Termos Técnicos)

**Tamanho esperado:** 500–1.000 palavras

Glossário completo de todos os termos técnicos usados na documentação, em ordem alfabética, com:
- Definição em linguagem simples
- Analogia quando aplicável
- Link para onde o termo é usado na documentação

Termos obrigatórios: API, Autenticação, Autorização, Banco de Dados, Cache, CI/CD, Certificado TLS/SSL, Container, Docker, Docker Compose, DNS, Domínio, E2E (criptografia ponta a ponta), Firewall, Git, GitHub, GitHub Actions, hbbs, hbbr, HTTPS, IP, JWT, Keycloak, Let's Encrypt, Linux, MFA, NGINX, OAuth, OIDC, Open Source, PostgreSQL, RAM, RBAC, Redis, Relay, REST API, RustDesk, SSH, SSO, Subdomínio, TypeScript, Ubuntu, VPS, vCPU, WebSocket, White-label.

---

## REGRAS DE FORMATAÇÃO PARA TODOS OS DOCUMENTOS

### Formato de Blocos de Código

Todo bloco de código deve ter:
1. Uma linha explicando **o que** o comando faz (antes do bloco)
2. O bloco de código em si
3. Uma linha explicando **por que** é necessário (após o bloco, quando não for óbvio)

Exemplo correto:
```markdown
Agora vamos verificar se o Docker foi instalado corretamente. Este comando pede para o Docker dizer qual versão está instalada:

```bash
docker --version
```

Se aparecer algo como `Docker version 24.0.5` ou superior, a instalação funcionou!
```

### Alertas Visuais

Use os seguintes blocos de alerta em toda a documentação:

```markdown
> ⚠️ **ATENÇÃO:** Use este bloco para avisos importantes que podem causar problemas se ignorados.

> 🔒 **SEGURANÇA:** Use este bloco para pontos críticos de segurança.

> 💡 **DICA:** Use este bloco para sugestões que facilitam a vida.

> ✅ **VERIFICAÇÃO:** Use este bloco para indicar como confirmar que uma etapa deu certo.

> ❌ **SE DER ERRADO:** Use este bloco para erros comuns e como resolvê-los.
```

### Indicações de Screenshots

Sempre que um passo visual for importante, inclua:
```markdown
`[INSERIR IMAGEM: nome-descritivo-da-imagem.png]`
*Legenda: Descrição do que deve aparecer nesta imagem*
```

### Estimativas de Tempo

Inclua estimativas de tempo no início de cada seção de procedimento:
```markdown
⏱️ **Tempo estimado:** 10–15 minutos
```

---

## CRITÉRIOS DE QUALIDADE DA DOCUMENTAÇÃO

A IA deve verificar os seguintes critérios antes de finalizar cada documento:

- [ ] Todo termo técnico tem sua explicação na primeira ocorrência?
- [ ] Todo comando tem uma explicação do que faz e por que?
- [ ] Existe pelo menos uma analogia por conceito novo introduzido?
- [ ] Os alertas visuais (⚠️ 🔒 💡 ✅ ❌) estão sendo usados adequadamente?
- [ ] Existe uma seção "Se der errado" em cada etapa crítica?
- [ ] O documento pode ser seguido por alguém que nunca usou Linux?
- [ ] As estimativas de tempo estão presentes em todas as seções de procedimento?
- [ ] Existe um "checkpoint" claro de verificação ao final de cada seção importante?

---

## REFERÊNCIAS TÉCNICAS PARA A IA

A IA deve usar as seguintes specs como fonte de verdade técnica ao gerar a documentação:

| Spec | Informações a extrair |
|------|----------------------|
| `specs/vision.md` | Propósito, comparações com concorrentes, proposta de valor |
| `specs/requirements.md` | Funcionalidades implementadas, requisitos de segurança |
| `specs/system/system-overview.md` | Arquitetura, fluxos, decisões técnicas |
| `specs/system/system-components.md` | Portas, configurações, dependências de cada componente |
| `specs/system/data-model.md` | Estrutura dos dados (para explicar o que é armazenado) |
| `specs/system/api-spec.md` | Endpoints disponíveis (para o guia do desenvolvedor) |
| `specs/infra/deployment-architecture.md` | Topologia, DNS, volumes, configurações de VPS |
| `specs/infra/devops-pipeline.md` | Processo de CI/CD, build do cliente |
| `specs/security/auth-model.md` | Fluxos de autenticação, MFA, RBAC |
| `specs/security/security-model.md` | Práticas de segurança, checklist |
| `specs/quality/testing-strategy.md` | Para evidenciar maturidade do projeto |
| `specs/roadmap/technical-roadmap.md` | Próximas funcionalidades planejadas |

---

*Fim da Spec de Documentação — versão 1.0.0*
