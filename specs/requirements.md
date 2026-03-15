# Requisitos do Sistema

> **Arquivo:** `specs/requirements.md`  
> **Versão:** 1.0.0  
> **Status:** Aprovado

---

## Convenção de Identificadores

| Prefixo | Tipo |
|---------|------|
| `REQ-F-XXX` | Requisito Funcional |
| `REQ-NF-XXX` | Requisito Não Funcional |
| `REQ-S-XXX` | Requisito de Segurança |
| `REQ-E-XXX` | Requisito de Escalabilidade |

**Prioridade:** `P0` = Crítico (MVP) | `P1` = Alta | `P2` = Média | `P3` = Baixa

---

## 1. Requisitos Funcionais

### 1.1 Gestão de Dispositivos

| ID | Requisito | Prioridade |
|----|-----------|------------|
| REQ-F-001 | O sistema deve permitir registrar dispositivos com ID RustDesk, alias, hostname, OS e grupo | P0 |
| REQ-F-002 | O sistema deve exibir o status online/offline de cada dispositivo em tempo real | P0 |
| REQ-F-003 | O sistema deve permitir organizar dispositivos em grupos hierárquicos | P1 |
| REQ-F-004 | O sistema deve permitir adicionar tags livres a dispositivos | P1 |
| REQ-F-005 | O sistema deve registrar o timestamp do último acesso de cada dispositivo | P1 |
| REQ-F-006 | O sistema deve permitir busca e filtro de dispositivos por alias, hostname, grupo e tag | P1 |
| REQ-F-007 | O sistema deve permitir exportar a lista de dispositivos em CSV | P2 |
| REQ-F-008 | O sistema deve permitir importar dispositivos em lote via CSV | P2 |

### 1.2 Gestão de Usuários (Técnicos e Admins)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| REQ-F-010 | O sistema deve permitir criar, editar, desativar e excluir usuários técnicos | P0 |
| REQ-F-011 | O sistema deve suportar os papéis: admin, technician, viewer, auditor | P0 |
| REQ-F-012 | O sistema deve permitir atribuir técnicos a grupos de dispositivos | P0 |
| REQ-F-013 | O sistema deve permitir controlar o nível de acesso por dispositivo (full, view_only) | P1 |
| REQ-F-014 | O sistema deve suportar login com SSO via Keycloak (OIDC) | P0 |
| REQ-F-015 | O sistema deve exigir MFA para todos os usuários com papel técnico ou admin | P0 |

### 1.3 Sessões de Suporte

| ID | Requisito | Prioridade |
|----|-----------|------------|
| REQ-F-020 | O sistema deve registrar o início e fim de cada sessão remota | P0 |
| REQ-F-021 | O sistema deve registrar qual técnico iniciou a sessão e qual dispositivo foi acessado | P0 |
| REQ-F-022 | O sistema deve registrar se a sessão utilizou relay ou conexão direta | P1 |
| REQ-F-023 | O sistema deve permitir que técnicos adicionem notas a uma sessão encerrada | P1 |
| REQ-F-024 | O sistema deve classificar sessões por tipo: suporte, implantação, treinamento, manutenção | P1 |
| REQ-F-025 | O sistema deve exibir histórico de sessões por dispositivo e por técnico | P1 |
| REQ-F-026 | O sistema deve calcular e exibir tempo total de sessão por período | P2 |

### 1.4 Build e Distribuição do Cliente

| ID | Requisito | Prioridade |
|----|-----------|------------|
| REQ-F-030 | O sistema deve fornecer um cliente RustDesk com servidor da empresa embutido | P0 |
| REQ-F-031 | O cliente deve conter a chave pública do servidor embutida para verificação | P0 |
| REQ-F-032 | O cliente deve exibir nome e logo da empresa (white-label) | P1 |
| REQ-F-033 | O pipeline CI/CD deve gerar instalador .exe para Windows automaticamente | P0 |
| REQ-F-034 | O instalador deve estar disponível para download via URL pública da plataforma | P0 |
| REQ-F-035 | O sistema deve exibir a versão atual do cliente disponível para download | P1 |

### 1.5 Administração da Plataforma

| ID | Requisito | Prioridade |
|----|-----------|------------|
| REQ-F-040 | O portal admin deve exibir dashboard com métricas de uso da plataforma | P1 |
| REQ-F-041 | O sistema deve enviar notificação (email/webhook) quando um dispositivo ficar offline por período configurável | P2 |
| REQ-F-042 | O sistema deve permitir configurar alertas de saúde dos servidores hbbs/hbbr | P1 |
| REQ-F-043 | O sistema deve registrar log de auditoria de todas as ações administrativas | P1 |

---

## 2. Requisitos Não Funcionais

### 2.1 Performance

| ID | Requisito | Meta |
|----|-----------|------|
| REQ-NF-001 | Tempo de resposta da API (P95) | < 300ms |
| REQ-NF-002 | Tempo de carregamento do portal web (LCP) | < 2 segundos |
| REQ-NF-003 | Tempo de registro de um novo dispositivo no hbbs | < 500ms |
| REQ-NF-004 | Latência de início de sessão remota (dispositivo online) | < 5 segundos |
| REQ-NF-005 | Número máximo de requisições simultâneas à API | 100 req/s |

### 2.2 Disponibilidade

| ID | Requisito | Meta |
|----|-----------|------|
| REQ-NF-010 | Disponibilidade do hbbs (ID Server) | ≥ 99.9% / mês |
| REQ-NF-011 | Disponibilidade do hbbr (Relay) | ≥ 99.5% / mês |
| REQ-NF-012 | Disponibilidade da API | ≥ 99.5% / mês |
| REQ-NF-013 | Janela de manutenção máxima sem aviso | 30 minutos |
| REQ-NF-014 | RTO (Recovery Time Objective) | < 2 horas |
| REQ-NF-015 | RPO (Recovery Point Objective) | < 24 horas |

### 2.3 Usabilidade

| ID | Requisito | Meta |
|----|-----------|------|
| REQ-NF-020 | O portal web deve ser responsivo (desktop e tablet) | Obrigatório |
| REQ-NF-021 | Um técnico deve conseguir iniciar sessão remota em até 3 cliques no portal | P0 |
| REQ-NF-022 | A interface deve funcionar nos navegadores Chrome, Firefox e Edge (últimas 2 versões) | P0 |
| REQ-NF-023 | Mensagens de erro devem ser claras e sugerir ação corretiva | P1 |

### 2.4 Manutenibilidade

| ID | Requisito | Meta |
|----|-----------|------|
| REQ-NF-030 | Cobertura de testes da API | ≥ 80% |
| REQ-NF-031 | Toda mudança de schema de banco deve ter migration versionada | Obrigatório |
| REQ-NF-032 | Toda mudança de API deve ter documentação Swagger atualizada | Obrigatório |
| REQ-NF-033 | Deploy de novas versões sem downtime (rolling deploy) | P1 |

---

## 3. Requisitos de Segurança

| ID | Requisito | Prioridade |
|----|-----------|------------|
| REQ-S-001 | Todo tráfego externo deve usar TLS 1.2+ (certificado válido) | P0 |
| REQ-S-002 | Senhas de usuário jamais devem ser armazenadas em texto plano | P0 |
| REQ-S-003 | Tokens JWT devem expirar em no máximo 1 hora | P0 |
| REQ-S-004 | MFA (TOTP) deve ser obrigatório para todos os técnicos e admins | P0 |
| REQ-S-005 | O sistema deve implementar rate limiting por IP na API de autenticação | P0 |
| REQ-S-006 | O sistema deve bloquear IPs após 5 tentativas de login falhas em 10 minutos | P0 |
| REQ-S-007 | Chaves privadas RustDesk jamais devem ser expostas via API ou logs | P0 |
| REQ-S-008 | O banco de dados não deve ser acessível externamente (apenas via rede interna Docker) | P0 |
| REQ-S-009 | Todas as ações de admin devem ser auditadas (quem, o quê, quando, de onde) | P1 |
| REQ-S-010 | Sessões de tela remota devem ser E2E encriptadas (RSA + AES — RustDesk nativo) | P0 |
| REQ-S-011 | O sistema deve implementar RBAC — técnicos só acessam dispositivos autorizados | P0 |
| REQ-S-012 | Backups devem ser criptografados com AES-256 antes do armazenamento | P0 |
| REQ-S-013 | Variáveis de ambiente com credenciais jamais devem ser commitadas no repositório | P0 |
| REQ-S-014 | Imagens Docker devem rodar como usuário não-root | P1 |
| REQ-S-015 | Dependências devem ser auditadas por vulnerabilidades (npm audit / cargo audit) no CI | P1 |

---

## 4. Requisitos de Escalabilidade

| ID | Requisito | Meta |
|----|-----------|------|
| REQ-E-001 | A arquitetura deve suportar até 500 dispositivos sem mudança estrutural | P0 |
| REQ-E-002 | A arquitetura deve suportar escalar para 1000+ dispositivos com adição de nós de relay | P1 |
| REQ-E-003 | A adição de novos servidores hbbr não deve exigir mudança no cliente instalado | P1 |
| REQ-E-004 | O banco de dados deve suportar sharding ou replicação se necessário | P2 |
| REQ-E-005 | A API deve ser stateless — escalável horizontalmente com múltiplas instâncias | P1 |
| REQ-E-006 | O sistema de monitoramento deve escalar independentemente da aplicação | P1 |
