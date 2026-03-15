# User Stories

> **Arquivo:** `specs/product/user-stories.md`  
> **Versão:** 1.0.0

**Formato:** Como `<persona>`, eu quero `<ação>`, para `<resultado esperado>`

**Status:** `Draft` | `Aprovado` | `Implementado` | `Cancelado`

---

## Épico 1 — Gestão de Dispositivos

| ID | História | Persona | Prioridade | Status |
|----|----------|---------|------------|--------|
| US-001 | Como **técnico**, eu quero ver a lista de todos os dispositivos que tenho acesso, para saber quais estão disponíveis antes de iniciar um atendimento | Carlos | P0 | Aprovado |
| US-002 | Como **técnico**, eu quero ver o status online/offline de cada dispositivo em tempo real, para não perder tempo tentando conectar em máquinas offline | Carlos | P0 | Aprovado |
| US-003 | Como **técnico**, eu quero buscar dispositivos por nome do cliente ou alias, para encontrar rapidamente a máquina que preciso acessar | Carlos | P0 | Aprovado |
| US-004 | Como **admin**, eu quero registrar um novo dispositivo com ID RustDesk, alias e grupo, para que ele apareça no address book da plataforma | Fernanda | P0 | Aprovado |
| US-005 | Como **admin**, eu quero organizar dispositivos em grupos por cliente, para facilitar a gestão e o controle de acesso | Fernanda | P1 | Aprovado |
| US-006 | Como **admin**, eu quero adicionar tags personalizadas a dispositivos (ex: "servidor", "filial-sp"), para facilitar filtros e relatórios | Fernanda | P1 | Aprovado |
| US-007 | Como **admin**, eu quero importar uma lista de dispositivos via CSV, para cadastrar grandes volumes sem precisar inserir um a um | Fernanda | P2 | Draft |
| US-008 | Como **técnico**, eu quero adicionar notas a um dispositivo, para registrar informações persistentes como "senha do admin local: ..." | Carlos | P2 | Draft |

---

## Épico 2 — Sessões Remotas

| ID | História | Persona | Prioridade | Status |
|----|----------|---------|------------|--------|
| US-010 | Como **técnico**, eu quero clicar em "Conectar" em um dispositivo do portal e o RustDesk abrir automaticamente, para iniciar o atendimento sem digitar o ID manualmente | Carlos | P0 | Aprovado |
| US-011 | Como **técnico**, eu quero que a sessão remota seja registrada automaticamente no sistema, para que eu não precise preencher início/fim manualmente | Carlos | P0 | Aprovado |
| US-012 | Como **técnico**, eu quero adicionar notas e classificar o tipo de atendimento após encerrar uma sessão, para manter o histórico do atendimento | Carlos | P1 | Aprovado |
| US-013 | Como **técnico**, eu quero ver o histórico de sessões de um dispositivo, para entender o contexto antes de iniciar um novo atendimento | Carlos | P1 | Aprovado |
| US-014 | Como **admin**, eu quero ver todas as sessões ativas em tempo real, para monitorar a carga operacional do time | Fernanda | P1 | Aprovado |
| US-015 | Como **auditor**, eu quero exportar o histórico de sessões de um período, para análise de conformidade e faturamento | Roberto | P2 | Draft |

---

## Épico 3 — Autenticação e Acesso

| ID | História | Persona | Prioridade | Status |
|----|----------|---------|------------|--------|
| US-020 | Como **técnico**, eu quero fazer login no portal com meu email corporativo via SSO, para não precisar gerenciar uma senha separada | Carlos | P0 | Aprovado |
| US-021 | Como **técnico**, eu quero configurar MFA com um aplicativo autenticador, para proteger meu acesso mesmo se minha senha for comprometida | Carlos | P0 | Aprovado |
| US-022 | Como **admin**, eu quero criar uma conta de técnico e definir quais grupos de dispositivos ele pode acessar, para controlar o escopo de cada profissional | Fernanda | P0 | Aprovado |
| US-023 | Como **admin**, eu quero desativar imediatamente a conta de um técnico que saiu da empresa, para evitar acessos não autorizados | Fernanda | P0 | Aprovado |
| US-024 | Como **admin**, eu quero definir o nível de acesso por dispositivo (acesso completo vs. somente visualização), para atender requisitos de segurança de clientes específicos | Fernanda | P1 | Aprovado |

---

## Épico 4 — Build e Distribuição do Cliente

| ID | História | Persona | Prioridade | Status |
|----|----------|---------|------------|--------|
| US-030 | Como **admin**, eu quero que o instalador do cliente já venha com o servidor da empresa configurado, para que o cliente não precise configurar nada | Fernanda | P0 | Aprovado |
| US-031 | Como **admin**, eu quero que o cliente exiba o nome e logo da empresa em vez de "RustDesk", para passar profissionalismo ao cliente final | Fernanda | P1 | Aprovado |
| US-032 | Como **admin**, eu quero acionar um novo build do cliente com um clique (ou merge no repositório), para distribuir atualizações sem processo manual | Fernanda | P1 | Aprovado |
| US-033 | Como **técnico**, eu quero enviar um link simples de download do instalador ao cliente, para facilitar a instalação sem explicações técnicas | Carlos | P0 | Aprovado |

---

## Épico 5 — Administração e Observabilidade

| ID | História | Persona | Prioridade | Status |
|----|----------|---------|------------|--------|
| US-040 | Como **admin**, eu quero ver um dashboard com status dos serviços (hbbs, hbbr, API, banco), para saber imediatamente se algo está fora do ar | Fernanda | P0 | Aprovado |
| US-041 | Como **admin**, eu quero receber um alerta por email se o hbbs ficar offline, para agir proativamente antes que técnicos reportem problemas | Fernanda | P1 | Aprovado |
| US-042 | Como **admin**, eu quero ver logs de auditoria de quem fez o quê na plataforma, para investigar incidentes de segurança | Fernanda | P1 | Aprovado |
| US-043 | Como **diretor**, eu quero ver um relatório mensal de uso (sessões, técnicos, tempo), para acompanhar a produtividade e justificar o investimento | Roberto | P2 | Draft |
| US-044 | Como **admin**, eu quero que o backup do banco seja executado automaticamente toda madrugada, para garantir recuperação em caso de falha | Fernanda | P0 | Aprovado |
