# 01 — O que você precisa saber antes de começar? 🧠

Antes de "colocarmos a mão na massa", é muito importante entender o que são as peças desse quebra-cabeça. Se você nunca ouviu falar de **Docker**, **VPS** ou **Domínio**, não se preocupe! Vamos explicar cada um deles usando coisas do seu dia a dia.

---

## 2.1 O que é um Servidor VPS? 🏢

Imagine que você precisa de um escritório para a sua empresa, mas não quer gastar milhões comprando um prédio inteiro. Em vez disso, você **aluga uma sala** em um prédio comercial compartilhado.

Um **VPS** (Servidor Virtual Privado — uma parte de um computador potente) é exatamente isso no mundo digital: você aluga um espaço em um computador gigante que fica ligado 24 horas por dia em um lugar muito seguro (chamado **Datacenter**). Esse espaço se comporta como se fosse um computador inteiro só seu, mas custando muito menos.

### Onde alugar um servidor?
Existem várias empresas confiáveis. Aqui estão algumas recomendadas para iniciantes:
- **DigitalOcean** & **Vultr**: Muito fáceis de configurar e populares.
- **Hetzner**: Excelente custo-benefício (empresa alemã).
- **Hostinger**: Ótima opção com painel em português.

### Qual configuração escolher?
Para a maioria das pequenas e médias empresas, recomendamos:
- **Mínimo**: 2 Processadores (vCPUs) e 4 GB de Memória RAM.
- **Ideal**: 4 Processadores (vCPUs) e 8 GB de Memória RAM (para até 500 computadores).
- **Sistema Operacional**: Sempre escolha o **Ubuntu 22.04 LTS**.

---

## 2.2 O que é um Domínio de Internet? 📍

Um **Domínio** é o endereço da sua empresa na internet. Assim como um cliente precisa do seu endereço físico para te visitar, os computadores precisam de um domínio para encontrar o seu servidor.

> 💡 **DICA**: Em vez de decorar números difíceis (como `167.234.12.89`), as pessoas usam nomes amigáveis como `suporte.suaempresa.com.br`.

Você pode comprar um domínio em sites como **Registro.br** (para domínios .com.br) ou **GoDaddy** e **Cloudflare** (para domínios .com).

---

## 2.3 O que é Docker? 📦

Imagine que você precisa levar 10 especialistas para uma obra: um eletricista, um encanador, um pintor... Cada um tem suas próprias ferramentas, uniformes e jeitos de trabalhar. 

O **Docker** é como se fosse um sistema de **caixas padronizadas**. Cada programa (especialista) fica dentro de sua própria caixa, com tudo o que precisa lá dentro, sem se misturar com os outros. 

> ✅ **VANTAGEM**: Isso garante que o programa funcione exatamente igual no seu computador, no meu, ou no servidor alugado, sem "conflitos de vizinhança" entre eles.

---

## 2.4 O que é HTTPS e Certificado SSL? 🔒

Sabe aquele ícone de **cadeado** que aparece do lado do endereço nos sites de banco? Aquilo significa que a conversa entre seu computador e o servidor é secreta (criptografada). 

O **Certificado SSL** (ou TLS) é o documento que prova que o site é seguro. Neste projeto, usaremos o **Let’s Encrypt**, que fornece esses certificados de forma gratuita e automática para você.

---

## 2.5 Como o sistema se organiza? 🗺️

Veja abaixo como as peças se comunicam de forma simplificada:

```text
O COMPUTADOR DO SEU CLIENTE
      └── Conecta ao SEU SERVIDOR através do link (Domínio)
               │
               ├── hbbs → A "Lista Telefônica" (conhece o endereço de todos).
               ├── hbbr → O "Operador" (liga os dois computadores).
               ├── API  → O "Gerente" (controla as senhas e anota tudo).
               └── Site Admin → Sua mesa de trabalho para ver os relatórios.
```

---

## 2.6 Segurança Reforçada (Keycloak e MFA) 🛡️

Para garantir que apenas as pessoas certas acessem o sistema, usamos o **Keycloak**. Imagine ele como o **porteiro** do seu prédio:
- Ele pede a senha (**Login**).
- Ele pede um código secreto no seu celular (**MFA — Autenticação de Dois Fatores**).

Isso garante que, mesmo que alguém descubra sua senha, não consiga entrar sem o seu celular físico em mãos.

---

> ✅ **CHECKPOINT**: Agora que você já entende os nomes das peças, vamos começar a configurar o servidor!
> 
> **Próximo passo: [Documento 2: Preparando o Servidor](02-preparando-o-servidor.md)**
