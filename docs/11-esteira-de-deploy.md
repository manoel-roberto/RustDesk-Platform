# 11 — A esteira de deploy (Atualização Automática) 🏗️

⏱️ **Tempo estimado:** 30–40 minutos

Você já se perguntou como as grandes empresas (como Netflix ou Instagram) atualizam seus sistemas sem que ninguém precise entrar no servidor e digitar comandos? Eles usam algo chamado **Esteira de Deploy** (ou CI/CD).

---

## 2.1 O que é uma Esteira de Deploy? 🚚

Imagine que você tem uma loja de móveis. 
- **O jeito manual**: Toda vez que você termina um móvel, você mesmo pega o caminhão, dirige até o cliente e faz a entrega.
- **A Esteira**: Você termina o móvel e o coloca em uma esteira rolante. Um caminhão automático já está parado lá, pega o móvel e o leva sozinho para a casa do cliente.

Neste projeto, o **GitHub** é a sua fábrica e o **Servidor VPS** é a casa do cliente. Vamos configurar o GitHub para "entregar o móvel" sozinho toda vez que você mudar algo no código.

---

## 2.2 Por que usar isso? 🌟

1. **Rapidez**: Você faz a mudança no GitHub e, em minutos, ela está no ar.
2. **Segurança**: Você erra menos se não precisar digitar comandos no servidor toda hora.
3. **Histórico**: Você sabe exatamente quando e o que foi atualizado.

---

## 2.3 Como configurar o seu "Caminhão de Entrega" 🛠️

Usaremos o **GitHub Actions**. Para que ele funcione, o GitHub precisa de uma chave para entrar no seu servidor (como se fosse a chave do portão da garagem).

### Passo 1: Configurar os Segredos no GitHub
No seu repositório no GitHub, vá em **Settings** > **Secrets and variables** > **Actions** e adicione estas chaves secretas:

| Nome do Segredo | O que colocar? |
|-----------------|----------------|
| `SSH_HOST` | O IP do seu servidor (ex: `167.23.12.89`) |
| `SSH_USER` | O nome do seu usuário (geralmente `root`) |
| `SSH_PASSWORD` | A senha do seu servidor |

---

### Passo 2: O Robô de Atualização
O projeto já vem com um arquivo chamado `.github/workflows/deploy.yml` (ou similar). Esse arquivo contém as instruções para o robô:
1. "Ei, GitHub, alguém atualizou o código?"
2. "Sim! Então entre no servidor via SSH."
3. "Vá até a pasta `/opt/remote-support`."
4. "Rode `git pull` para baixar as novidades."
5. "Rode `docker compose up -d` para reiniciar os motores."

---

## 2.4 Como testar se está funcionando? ✅

1. Faça uma pequena mudança em qualquer arquivo (ex: mude uma palavra no `README.md`).
2. Envie essa mudança para o GitHub (`git commit` e `git push`).
3. Vá na aba **"Actions"** no seu GitHub.
4. Você verá um processo chamado **"Deploy to Production"** rodando. Se ficar **verde**, a mudança já chegou no seu servidor!

---

## 2.5 E se eu encontrar um problema na atualização? ⏪

Lembra do **Rollback** que ensinei no documento de manutenção? Se a esteira entregar um móvel com defeito, basta você voltar para a versão anterior no GitHub e a esteira entregará a versão antiga para o seu servidor novamente.

---

> ✅ **CHECKPOINT**: Sua fábrica agora é automática! Toda melhoria que você fizer no seu fork será entregue sozinha para o seu servidor.
> 
> **Próximo passo: [Documento 13: Comparativo (Vantagens)](13-comparativo.md)**
