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

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-001 | O sistema deve permitir registrar dispositivos | P0 | ✅ Concluído |
| REQ-F-002 | Exibir o status online/offline em tempo real | P0 | ✅ Concluído |
| REQ-F-003 | Organizar dispositivos em grupos hierárquicos | P1 | 🏗️ Parcial |
| REQ-F-004 | Adicionar tags livres a dispositivos | P1 | ✅ Concluído |
| REQ-F-005 | Registrar timestamp do último acesso | P1 | ✅ Concluído |
| REQ-F-006 | Busca e filtro de dispositivos | P1 | ✅ Concluído |
| REQ-F-007 | Exportar lista de dispositivos em CSV | P2 | ⏳ Pendente |
| REQ-F-008 | Importar dispositivos em lote via CSV | P2 | ⏳ Pendente |

### 1.2 Gestão de Usuários (Técnicos e Admins)

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-010 | Criar, editar, desativar e excluir técnicos | P0 | ✅ Concluído |
| REQ-F-011 | Suportar papéis: admin, technician, etc. | P0 | ✅ Concluído |
| REQ-F-012 | Atribuir técnicos a grupos de dispositivos | P0 | ✅ Concluído |
| REQ-F-013 | Controle de nível de acesso (full, view_only) | P1 | 🏗️ Em progresso |
| REQ-F-014 | Suportar login com SSO via Keycloak (OIDC) | P0 | ✅ Concluído |
| REQ-F-015 | Exigir MFA para técnicos e admins | P0 | 🏗️ Configuração (Keycloak) |

### 1.3 Sessões de Suporte

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-020 | Registrar início e fim de cada sessão remota | P0 | ✅ Concluído |
| REQ-F-021 | Registrar técnico e dispositivo acessado | P0 | ✅ Concluído |
| REQ-F-022 | Registrar se utilizou relay ou direta | P1 | ✅ Concluído |
| REQ-F-023 | Permitir adicionar notas a uma sessão | P1 | ⏳ Pendente |
| REQ-F-024 | Classificar sessões por tipo | P1 | ⏳ Pendente |
| REQ-F-025 | Histórico de sessões (dispositivo/técnico) | P1 | ✅ Concluído |
| REQ-F-026 | Calcular tempo total de sessão por período | P2 | ⏳ Pendente |

### 1.4 Build e Distribuição do Cliente

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-030 | Cliente RustDesk com servidor embutido | P0 | ✅ Concluído |
| REQ-F-031 | Chave pública do servidor embutida | P0 | ✅ Concluído |
| REQ-F-032 | White-label (Nome e Logo da empresa) | P1 | 🏗️ Em progresso |
| REQ-F-033 | Pipeline CI/CD para Windows (.exe) | P0 | ⏳ Pendente |
| REQ-F-034 | Download via URL pública da plataforma | P0 | 🏗️ Em progresso |
| REQ-F-035 | Exibir versão atual para download | P1 | 🏗️ Em progresso |

### 1.5 Administração da Plataforma

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-040 | Dashboards com métricas de uso | P1 | ✅ Concluído |
| REQ-F-041 | Notificação de dispositivos offline | P2 | ⏳ Pendente |
| REQ-F-042 | Alertas de saúde hbbs/hbbr | P1 | ⏳ Pendente |
| REQ-F-043 | Log de auditoria de ações administrativas | P1 | 🏗️ Em progresso |

---

## 2. Requisitos Não Funcionais

### 2.4 Manutenibilidade

| ID | Requisito | Meta | Status |
|----|-----------|------|--------|
| REQ-NF-030 | Cobertura de testes da API ≥ 80% | Obrigatório | ✅ Concluído (100%) |
| REQ-NF-031 | Migrations versionadas | Obrigatório | ✅ Concluído |
| REQ-NF-032 | Documentação Swagger atualizada | Obrigatório | ✅ Concluído |
| REQ-NF-033 | Deploy sem downtime | P1 | ⏳ Pendente |

---

## 3. Requisitos de Segurança

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-S-001 | TLS 1.2+ (Certificado válido) | P0 | 🏗️ Em progresso |
| REQ-S-004 | MFA Obrigatório (Keycloak) | P0 | 🏗️ Configuração (Keycloak) |
| REQ-S-008 | DB Isolation (Apenas rede interna) | P0 | ✅ Concluído |
| REQ-S-010 | Sessões E2E Encriptadas | P0 | ✅ Concluído |
| REQ-S-013 | Segredos fora do repositório | P0 | ✅ Concluído |

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
