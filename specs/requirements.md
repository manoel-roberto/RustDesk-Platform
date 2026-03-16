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
| REQ-F-003 | Organizar dispositivos em grupos hierárquicos | P1 | ✅ Concluído |
| REQ-F-004 | Adicionar tags livres a dispositivos | P1 | ✅ Concluído |
| REQ-F-005 | Registrar timestamp do último acesso | P1 | ✅ Concluído |
| REQ-F-006 | Busca e filtro de dispositivos | P1 | ✅ Concluído |
| REQ-F-007 | Exportar lista de dispositivos em CSV | P2 | ✅ Concluído |
| REQ-F-008 | Importar dispositivos em lote via CSV | P2 | ✅ Concluído |

### 1.2 Gestão de Usuários (Técnicos e Admins)

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-010 | Criar, editar, desativar e excluir técnicos | P0 | ✅ Concluído |
| REQ-F-011 | Suportar papéis: admin, technician, etc. | P0 | ✅ Concluído |
| REQ-F-012 | Atribuir técnicos a grupos de dispositivos | P0 | ✅ Concluído |
| REQ-F-013 | Controle de nível de acesso (full, view_only) | P1 | ✅ Concluído |
| REQ-F-014 | Suportar login com SSO via Keycloak (OIDC) | P0 | ✅ Concluído |
| REQ-F-015 | Exigir MFA para técnicos e admins | P0 | 🏗️ Configuração (Keycloak) |

### 1.3 Sessões de Suporte

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-020 | Registrar início e fim de cada sessão remota | P0 | ✅ Concluído |
| REQ-F-021 | Registrar técnico e dispositivo acessado | P0 | ✅ Concluído |
| REQ-F-022 | Registrar se utilizou relay ou direta | P1 | ✅ Concluído |
| REQ-F-023 | Permitir adicionar notas a uma sessão | P1 | ✅ Concluído |
| REQ-F-024 | Classificar sessões por tipo | P1 | ✅ Concluído |
| REQ-F-025 | Histórico de sessões (dispositivo/técnico) | P1 | ✅ Concluído |
| REQ-F-026 | Calcular tempo total de sessão por período | P2 | ✅ Concluído |

### 1.4 Build e Distribuição do Cliente

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-030 | Cliente RustDesk com servidor embutido | P0 | ✅ Concluído |
| REQ-F-031 | Chave pública do servidor embutida | P0 | ✅ Concluído |
| REQ-F-032 | White-label (Nome e Logo da empresa) | P1 | ✅ Concluído |
| REQ-F-033 | Pipeline CI/CD para Windows (.exe) | P0 | ✅ Concluído |
| REQ-F-034 | Download via URL pública da plataforma | P0 | ✅ Concluído |
| REQ-F-035 | Exibir versão atual para download | P1 | ✅ Concluído |

### 1.5 Administração da Plataforma

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-040 | Dashboards com métricas de uso | P1 | ✅ Concluído |
| REQ-F-041 | Notificação de dispositivos offline | P2 | ✅ Concluído |
| REQ-F-042 | Alertas de saúde hbbs/hbbr | P1 | ✅ Concluído |
| REQ-F-043 | Log de auditoria de ações administrativas | P1 | ✅ Concluído |

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

### 1.6 Interface e Experiência do Usuário (UX) [IMPLEMENTADO]

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REQ-F-050 | O sistema deve suportar localização completa para Português (Brasil) no Frontend e Keycloak | P1 | ✅ Concluído |
| REQ-F-051 | A navegação entre seções dos portais deve ser reativa e indicar o estado ativo | P1 | ✅ Concluído |

---

## 2. Requisitos Não Funcionais (Sugestões Importantes)

| ID | Requisito | Prioridade | Justificativa | Status |
|----|-----------|------------|---------------|--------|
| REQ-NF-040 | Suporte a Dark Mode nativo | P2 | Redução de fadiga ocular para suporte prolongado | ✅ Concluído |
| REQ-NF-041 | PWA (Progressive Web App) | P2 | Permitir instalação como app desktop para acesso rápido | ✅ Concluído |

---

## 3. Requisitos de Segurança (Novas Recomendações)

| ID | Requisito | Prioridade | Justificativa | Status |
|----|-----------|------------|---------------|--------|
| REQ-S-020 | Implementação de Content Security Policy (CSP) | P1 | Proteção contra XSS e injeção de scripts maliciosos | ✅ Concluído |
| REQ-S-021 | Proteção contra Clickjacking (Headers X-Frame) | P1 | Impedir que o portal de login seja emoldurado em sites maliciosos | ✅ Concluído |
| REQ-S-022 | Rotação automática de chaves de assinatura JWT | P2 | Aumentar a segurança de longo prazo dos tokens de acesso | ⏳ Sugerido |

---

## 4. Requisitos de Escalabilidade
| ID | Requisito | Meta | Status |
|----|-----------|------|--------|
| REQ-E-001 | Suporte até 500 dispositivos sem mudança estrutural | P0 | ✅ Concluído |
| REQ-E-002 | Escalar para 1000+ com adição de nós de relay | P1 | ✅ Concluído |
| REQ-E-003 | Adição de novos relays sem mudança no cliente | P1 | ✅ Concluído |
| REQ-E-004 | DB Sharding ou Replicação | P2 | ✅ Concluído (Replica) |
| REQ-E-005 | API Stateless — escalável horizontalmente | P1 | ✅ Concluído |
| REQ-E-006 | Monitoramento escalável independente | P1 | ✅ Concluído |
## 5. Política de Qualidade e Verificação (TDD)

| ID | Requisito | Prioridade | Meta | Status |
|----|-----------|------------|------|--------|
| REQ-Q-001 | Todo novo Requisito Funcional deve ter testes automatizados correspondentes (Unitários e/ou Integração) | Crítico | 100% de cobertura nos novos arquivos | ✅ Concluído |
| REQ-Q-002 | O desenvolvimento deve seguir os princípios de TDD (Test-Driven Development) | Obrigatório | Testes escritos antes ou durante a implementação | ✅ Concluído |
| REQ-Q-003 | Verificação de integridade pós-deploy via Smoke Tests automatizados | P1 | Validar fluxos críticos (Login, Device Connect) | ✅ Concluído |
| REQ-Q-004 | Documentação de Walkthrough deve incluir evidências de testes (logs ou mídia) | Obrigatório | Transparência no processo de validação | ✅ Concluído |

> [!IMPORTANT]
> **Nenhuma implementação será considerada "Concluída" sem a respectiva suíte de testes validando os critérios de aceite definidos no plano de implementação.**
