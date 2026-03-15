# Casos de Uso

> **Arquivo:** `specs/product/use-cases.md`  
> **Versão:** 1.0.0

---

## UC-001 — Iniciar Sessão Remota em Dispositivo

**Atores:** Técnico (Carlos)  
**Pré-condição:** Técnico autenticado no portal. Dispositivo online e registrado.  
**Pós-condição:** Sessão remota encerrada e registrada no banco de dados.  
**Relacionado a:** US-010, US-011, REQ-F-020, REQ-F-021

### Fluxo Principal

```
1. Técnico acessa o Portal do Técnico (https://portal.suaempresa.com.br)
2. Sistema exibe lista de dispositivos com status online/offline
3. Técnico localiza o dispositivo (busca ou filtra por grupo/tag)
4. Técnico clica em "Conectar" no dispositivo desejado
5. Sistema verifica se o técnico tem permissão de acesso ao dispositivo (RBAC)
6. Sistema gera deep link com ID RustDesk e credenciais temporárias
7. Navegador abre o app RustDesk via protocolo rustdesk://
8. RustDesk inicia conexão com o hbbs para localizar o dispositivo
9. RustDesk estabelece sessão (direta ou via relay hbbr)
10. Sistema registra início da sessão (dispositivo, técnico, timestamp, tipo de conexão)
11. Técnico realiza o suporte remoto
12. Técnico encerra a sessão no RustDesk
13. Sistema registra encerramento (timestamp, duração)
14. Portal exibe modal para técnico inserir tipo e notas da sessão
15. Técnico preenche e confirma — sistema persiste os dados
```

### Fluxo Alternativo A — Dispositivo Offline

```
4a. Dispositivo está com status offline
4b. Botão "Conectar" está desabilitado
4c. Sistema exibe tooltip: "Dispositivo offline desde <data/hora>"
4d. Técnico pode optar por notificar o responsável pelo dispositivo
```

### Fluxo Alternativo B — Técnico Sem Permissão

```
5a. Sistema identifica que o técnico não tem acesso ao dispositivo
5b. Sistema retorna HTTP 403 com mensagem clara
5c. Portal exibe: "Você não tem permissão para acessar este dispositivo"
5d. Caso de uso encerrado sem registro de sessão
```

### Fluxo Alternativo C — Falha na Conexão RustDesk

```
9a. RustDesk não consegue estabelecer conexão (timeout)
9b. RustDesk exibe mensagem de erro no app
9c. Sistema não registra sessão pois não houve conexão
9d. Técnico pode tentar novamente ou reportar o problema
```

---

## UC-002 — Registrar Novo Dispositivo no Address Book

**Atores:** Administrador (Fernanda)  
**Pré-condição:** Admin autenticado. Cliente já instalou o RustDesk e o dispositivo gerou um ID.  
**Pós-condição:** Dispositivo registrado e disponível para técnicos autorizados.  
**Relacionado a:** US-004, REQ-F-001

### Fluxo Principal

```
1. Admin acessa o Portal Admin
2. Admin navega para "Dispositivos" > "Adicionar Dispositivo"
3. Sistema exibe formulário de cadastro
4. Admin preenche:
   - ID RustDesk (obrigatório)
   - Alias/Nome amigável (obrigatório)
   - Grupo (obrigatório)
   - Tags (opcional)
   - Notas (opcional)
5. Admin clica em "Salvar"
6. Sistema valida se o ID RustDesk não está duplicado
7. Sistema persiste o dispositivo no banco de dados
8. Sistema exibe confirmação e redireciona para a lista de dispositivos
```

### Fluxo Alternativo — ID RustDesk Duplicado

```
6a. Sistema detecta que o ID já existe
6b. Sistema retorna erro 409 Conflict
6c. Portal exibe: "Este ID RustDesk já está cadastrado. Dispositivo: <alias>"
6d. Admin pode navegar para o dispositivo existente ou cancelar
```

---

## UC-003 — Criar Conta de Técnico

**Atores:** Administrador (Fernanda)  
**Pré-condição:** Admin autenticado.  
**Pós-condição:** Técnico criado no Keycloak e na API. Email de boas-vindas enviado.  
**Relacionado a:** US-022, REQ-F-010, REQ-F-014

### Fluxo Principal

```
1. Admin acessa "Usuários" > "Novo Usuário"
2. Admin preenche: nome, email, papel (technician/admin/viewer), grupos de acesso
3. Admin clica em "Criar"
4. Sistema cria usuário no Keycloak via Admin API
5. Sistema cria registro do usuário no banco local (espelho do Keycloak)
6. Sistema atribui o usuário aos grupos selecionados
7. Keycloak envia email de boas-vindas com link de definição de senha
8. Sistema exige que o novo usuário configure MFA no primeiro acesso
```

### Fluxo Alternativo — Email Duplicado

```
3a. Sistema detecta email já cadastrado no Keycloak
3b. Portal exibe: "Este email já está em uso"
3c. Admin corrige o email ou cancela
```

---

## UC-004 — Login com MFA

**Atores:** Qualquer usuário autenticado  
**Pré-condição:** Usuário tem conta ativa com MFA configurado.  
**Pós-condição:** Usuário autenticado com token JWT válido.  
**Relacionado a:** US-020, US-021, REQ-S-003, REQ-S-004

### Fluxo Principal

```
1. Usuário acessa o portal web
2. Portal redireciona para Keycloak (OIDC Authorization Code Flow)
3. Keycloak exibe tela de login
4. Usuário insere email e senha
5. Keycloak valida credenciais
6. Keycloak exibe tela de MFA (TOTP)
7. Usuário insere código do aplicativo autenticador
8. Keycloak valida o código TOTP
9. Keycloak emite ID Token + Access Token + Refresh Token
10. Portal recebe tokens e armazena access token em memória
11. Portal exibe interface conforme o papel do usuário
```

### Fluxo Alternativo A — Senha Incorreta

```
5a. Keycloak rejeita as credenciais
5b. Keycloak exibe mensagem genérica (sem indicar se email ou senha)
5c. Após 5 tentativas, Keycloak bloqueia a conta por 30 minutos
```

### Fluxo Alternativo B — MFA Não Configurado (Primeiro Acesso)

```
6a. Usuário ainda não tem MFA configurado
6b. Keycloak exibe QR code para configuração do TOTP
6c. Usuário escaneia com app autenticador
6d. Usuário valida com primeiro código gerado
6e. Fluxo segue a partir do passo 9
```

---

## UC-005 — Build e Publicação de Nova Versão do Cliente

**Atores:** Admin (Fernanda), CI/CD Pipeline  
**Pré-condição:** Repositório de build configurado com secrets. Branding assets disponíveis.  
**Pós-condição:** Instalador .exe disponível na URL pública para download.  
**Relacionado a:** US-030, US-032, REQ-F-033, REQ-F-034

### Fluxo Principal

```
1. Admin (ou desenvolvedor) cria uma tag git no repositório (ex: v1.2.0)
2. GitHub Actions detecta a nova tag e aciona o workflow build-client.yml
3. Pipeline clone o código fonte do RustDesk
4. Pipeline executa inject-config.py com: servidor, chave pública, appname
5. Pipeline copia assets de branding (logo.png, logo.ico)
6. Pipeline compila o binário com Rust + Flutter
7. Pipeline gera instalador .exe com NSIS
8. Pipeline publica o artefato no servidor de distribuição via SCP
9. Pipeline cria Release no GitHub com o .exe anexado
10. Portal Admin exibe a nova versão disponível para download
11. Técnico pode enviar o link de download ao cliente
```

### Fluxo Alternativo — Falha no Build

```
6a. Compilação falha (dependência, código incompatível, etc.)
6b. GitHub Actions marca o workflow como Failed
6c. Admin recebe notificação de falha por email
6d. Pipeline não publica artefatos
6e. Admin investiga os logs do workflow e corrige
```

---

## UC-006 — Responder a Alerta de Servidor Offline

**Atores:** Sistema (Alertmanager), Administrador (Fernanda)  
**Pré-condição:** Prometheus monitorando hbbs. Alertmanager configurado com email.  
**Pós-condição:** Serviço restaurado ou incidente registrado.  
**Relacionado a:** US-040, US-041, REQ-F-042

### Fluxo Principal

```
1. hbbs fica inacessível (container parou, servidor reiniciou, etc.)
2. Prometheus detecta que o target hbbs está down
3. Alerta HbbsDown dispara após 2 minutos de ausência
4. Alertmanager envia email para Fernanda: "CRITICAL: hbbs offline"
5. Fernanda acessa o servidor via SSH
6. Fernanda executa: docker compose logs hbbs --tail=50
7. Fernanda identifica a causa (ex: OOM, disco cheio)
8. Fernanda corrige a causa raiz
9. Fernanda executa: docker compose restart hbbs
10. hbbs responde ao healthcheck do Prometheus
11. Alerta é resolvido automaticamente — Alertmanager envia email "RESOLVED"
12. Fernanda documenta o incidente no canal de operações
```
