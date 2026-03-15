# Visão do Produto

> **Arquivo:** `specs/vision.md`  
> **Versão:** 1.0.0  
> **Status:** Aprovado

---

## 1. Problema a Ser Resolvido

### 1.1 Contexto

Empresas de suporte técnico a sistemas ERP dependem diariamente de ferramentas de acesso remoto para atender clientes. Soluções comerciais como TeamViewer, AnyDesk e Splashtop dominam o mercado, mas impõem restrições estruturais que afetam diretamente a operação e a rentabilidade dessas empresas.

### 1.2 Problemas Identificados

**Custo crescente e imprevisível**
- Licenças comerciais custam entre R$ 800 e R$ 5.000/mês para equipes de 5–20 técnicos
- Reajustes anuais sem controle do cliente
- Modelo por usuário ou por sessão penaliza crescimento

**Falta de controle sobre dados**
- Sessões de suporte trafegam por servidores de terceiros (EUA/Europa)
- Metadados de dispositivos, IPs e padrões de uso pertencem ao vendor
- Risco de conformidade com LGPD e políticas internas de clientes ERP

**Dependência de vendor (vendor lock-in)**
- Impossibilidade de personalização do cliente
- Risco de descontinuação ou mudança de preço sem alternativa imediata
- Sem acesso aos dados históricos de sessões em caso de cancelamento

**Limitações técnicas para o cenário ERP**
- Address book sem integração com base de clientes interna
- Sem auditoria completa de sessões por cliente/contrato
- Sem personalização de fluxo de acesso por tipo de atendimento

### 1.3 Impacto do Problema

| Dimensão | Impacto |
|----------|---------|
| Financeiro | R$ 10.000–60.000/ano em licenciamento para 20 técnicos |
| Conformidade | Risco LGPD por dados em infraestrutura externa |
| Operacional | Sem rastreabilidade centralizada de sessões |
| Estratégico | Dependência total de vendor para operação crítica |

---

## 2. Solução Proposta

### 2.1 Descrição

Uma plataforma de suporte remoto corporativo, construída sobre RustDesk Open Source, completamente self-hosted e gerenciada pela própria empresa. A plataforma oferece funcionalidades equivalentes às ferramentas comerciais, com controle total sobre dados, infraestrutura e custos.

### 2.2 Como a Solução Resolve o Problema

| Problema | Solução |
|----------|---------|
| Custo de licenciamento | Infraestrutura própria — custo apenas de servidor (~R$ 200–500/mês) |
| Dados em terceiros | 100% self-hosted — nenhum dado sai da infraestrutura da empresa |
| Vendor lock-in | Open source (AGPL) — código auditável e sem dependência de vendor |
| Address book limitado | API customizada com banco de dados próprio e portal de gestão |
| Falta de auditoria | Registro completo de sessões, usuários e ações no banco de dados |
| Sem personalização | Build white-label automatizado com branding, servidor e chave embutidos |

### 2.3 Abordagem Técnica

A solução combina:
- **RustDesk OSS** como protocolo de acesso remoto (comprovado, auditado, E2E encriptado)
- **NestJS API** como camada de gestão (address book, RBAC, auditoria)
- **Keycloak** como servidor de identidade (SSO, MFA, federação com AD)
- **React** como interface web para administradores e técnicos
- **Prometheus + Grafana + Loki** como stack de observabilidade
- **GitHub Actions** como pipeline de build e deploy

---

## 3. Diferenciais do Produto

### 3.1 Diferenciais Competitivos

**vs. TeamViewer / AnyDesk / Splashtop:**

| Diferencial | Descrição |
|-------------|-----------|
| **Custo zero de licença** | Sem mensalidade, sem limite de dispositivos, sem limite de técnicos |
| **Soberania de dados** | Dados 100% na infraestrutura da empresa — conformidade total com LGPD |
| **White-label nativo** | Instalador com nome, logo e servidor da empresa embutidos |
| **Address book extensível** | API REST própria integrável com CRM, ERP ou qualquer sistema |
| **Auditoria completa** | Histórico de todas as sessões com técnico, duração, tipo e notas |
| **RBAC granular** | Controle de qual técnico acessa qual dispositivo com qual nível |
| **Open source auditável** | Código revisável, sem backdoors, sem telemetria oculta |

### 3.2 Posicionamento

```
                     CONTROLE DE DADOS
                           │
                     ALTO  │  ┌─────────────────────────┐
                           │  │  ESTA PLATAFORMA        │
                           │  │  (Open Source +         │
                           │  │   Self-hosted)          │
                           │  └─────────────────────────┘
                           │
                    MÉDIO  │
                           │
                     BAIXO │   TeamViewer  AnyDesk  Splashtop
                           │
                           └──────────────────────────────────
                                BAIXO    MÉDIO      ALTO
                                        CUSTO
```

### 3.3 Proposta de Valor

> **"A única plataforma de suporte remoto que sua empresa realmente possui."**

- Zero dependência de vendor
- Dados 100% sob seu controle
- Custos previsíveis e escaláveis
- Extensível para qualquer fluxo de negócio

---

## 4. Visão de Longo Prazo

A plataforma começa como ferramenta interna e evolui em três fases:

**Fase 1 — Ferramenta Interna (v1.0)**  
Substituir ferramentas comerciais na operação própria de suporte técnico.

**Fase 2 — Plataforma White-Label (v2.0)**  
Permitir que a empresa ofereça a solução a outros parceiros de suporte como produto.

**Fase 3 — SaaS Interno Multi-tenant (v3.0)**  
Oferecer instâncias isoladas por cliente ERP com portal self-service.
