# User Personas

> **Arquivo:** `specs/product/user-personas.md`  
> **Versão:** 1.0.0

---

## Persona 1 — Carlos, o Técnico de Suporte ERP

**Papel na plataforma:** `technician`

```
┌─────────────────────────────────────────────────────┐
│  Carlos Mendes, 29 anos                             │
│  Técnico de Suporte N2 — Empresa de ERP             │
│  Experiência: 4 anos em suporte técnico             │
└─────────────────────────────────────────────────────┘
```

### Perfil

Carlos realiza entre 8 e 15 atendimentos remotos por dia. Seu trabalho envolve acessar máquinas de clientes para resolver erros do ERP, instalar atualizações, configurar parametrizações e treinar usuários. Ele trabalha tanto do escritório quanto em home office.

### Necessidades

- Acessar rapidamente o dispositivo do cliente sem precisar pedir a senha toda vez
- Ver quais dispositivos estão online antes de tentar conectar
- Registrar o que foi feito em cada atendimento para o histórico
- Ter um instalador simples para enviar ao cliente novo

### Objetivos

- Resolver chamados com o menor tempo possível
- Não perder tempo com ferramentas lentas ou que pedem autenticação repetida
- Ter histórico dos atendimentos para embasar cobranças ou SLAs

### Frustrações (situação atual)

- TeamViewer expira sessão no meio do atendimento quando a licença está no limite
- Não tem como ver quais máquinas estão online antes de tentar conectar
- Instalador do cliente exige configuração manual do servidor a cada instalação

### Comportamento na Plataforma

- Acessa o Portal do Técnico via navegador
- Filtra dispositivos por cliente ou grupo
- Clica em "Conectar" → RustDesk abre automaticamente com as credenciais
- Após a sessão, preenche tipo e notas do atendimento

---

## Persona 2 — Fernanda, a Administradora de TI

**Papel na plataforma:** `admin`

```
┌─────────────────────────────────────────────────────┐
│  Fernanda Lima, 35 anos                             │
│  Coordenadora de TI — Empresa de ERP               │
│  Experiência: 8 anos em infraestrutura e operações │
└─────────────────────────────────────────────────────┘
```

### Perfil

Fernanda é responsável por manter a plataforma funcionando, gerenciar acessos dos técnicos e garantir que a operação esteja em conformidade com as políticas de segurança da empresa. Ela não realiza atendimentos, mas precisa de visibilidade total sobre o que acontece na plataforma.

### Necessidades

- Criar e desativar contas de técnicos com controle fino de permissões
- Monitorar a saúde dos servidores (hbbs, hbbr, banco de dados)
- Auditar quais técnicos acessaram quais máquinas
- Garantir que os backups estão sendo executados
- Gerar relatórios de uso para apresentar à diretoria

### Objetivos

- Manter a plataforma disponível 100% do tempo em horário comercial
- Garantir que nenhum técnico acesse dispositivos não autorizados
- Responder rapidamente a incidentes de segurança

### Comportamento na Plataforma

- Acessa o Portal Admin diariamente
- Monitora o dashboard de saúde dos serviços
- Gerencia grupos de dispositivos e atribui técnicos
- Revisa logs de auditoria quando necessário
- Configura alertas e notificações

---

## Persona 3 — Roberto, o Diretor de Operações

**Papel na plataforma:** `viewer` / `auditor`

```
┌─────────────────────────────────────────────────────┐
│  Roberto Faria, 45 anos                             │
│  Diretor de Operações — Empresa de ERP              │
│  Experiência: 15 anos em gestão de TI              │
└─────────────────────────────────────────────────────┘
```

### Perfil

Roberto não opera a plataforma diretamente, mas precisa de dados consolidados para tomada de decisão. Ele quer saber se a substituição do TeamViewer trouxe economia real, se os técnicos estão produtivos e se há riscos operacionais.

### Necessidades

- Relatórios de uso mensal: número de sessões, tempo total, técnicos mais ativos
- Confirmação de que backups estão ocorrendo e conformidade está em dia
- Alertas proativos sobre problemas críticos via email

### Objetivos

- Justificar o custo da infraestrutura vs. alternativas comerciais
- Ter visibilidade sem precisar operar a plataforma

---

## Persona 4 — Mário, o Cliente do ERP

**Papel na plataforma:** Sem acesso direto

```
┌─────────────────────────────────────────────────────┐
│  Mário Santos, 50 anos                              │
│  Gerente de TI — Empresa cliente do ERP             │
│  Experiência: Usuário final de suporte remoto       │
└─────────────────────────────────────────────────────┘
```

### Perfil

Mário é o responsável pelo TI do cliente que contrata suporte ao ERP. Ele precisa instalar o cliente RustDesk nas máquinas da sua empresa e conceder acesso aos técnicos quando necessário.

### Necessidades

- Instalador simples, com um clique, que já venha configurado
- Saber que o suporte técnico só acessa as máquinas com sua permissão
- Poder remover o cliente facilmente se o contrato for encerrado

### Objetivos

- Facilitar o trabalho dos técnicos sem comprometer a segurança
- Não precisar saber detalhes técnicos do funcionamento

### Comportamento na Plataforma

- Baixa o instalador do cliente pelo link fornecido pelo técnico
- Executa o instalador nas máquinas (pode ser via GPO/script)
- Não acessa portais ou APIs — experiência 100% passiva
