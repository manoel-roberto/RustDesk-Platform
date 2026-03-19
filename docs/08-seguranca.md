# 08 — Mantendo o Sistema Seguro (Checklist) 🛡️

⏱️ **Tempo estimado:** 15–20 minutos (leitura)

A segurança não é algo que você faz uma vez e esquece. É um hábito. Como você agora é o dono da sua própria plataforma de suporte, a responsabilidade de manter as portas trancadas é sua. Siga este checklist:

---

## 9.1 Checklist de Segurança Pós-Instalação ✅

Revise os itens abaixo para ter certeza de que sua "casa digital" está protegida:

- [ ] **Senhas Fortes**: Você usou senhas com mais de 16 caracteres, misturando letras, números e símbolos no arquivo `.env`?
- [ ] **MFA Ativo**: Todos os seus técnicos configuraram o código no celular (Google Authenticator)?
- [ ] **Firewall Ligado**: Você rodou os comandos do **Documento 2** para fechar as portas desnecessárias?
- [ ] **Permissões de Arquivo**: Rode o comando abaixo no terminal do servidor para esconder suas senhas de curiosos:
  ```bash
  chmod 600 /opt/remote-support/.env
  ```
  *(Isso diz ao Linux que apenas você pode ler este arquivo secreto).*
- [ ] **Cadeado Verde**: Todos os sites (`admin.`, `auth.`, etc.) mostram o cadeado no navegador?

---

## 9.2 O que NUNCA Fazer ❌

Para evitar 99% dos problemas de invasão, siga estas regras de ouro:

1. **Nunca compartilhe o arquivo `.env`**: Ele contém todas as suas senhas mestras. Se alguém tiver esse arquivo, terá o controle total.
2. **Nunca use senhas padrão**: Fuja de `admin123`, `senha123` ou o nome da sua empresa. Use um gerador de senhas.
3. **Nunca abra portas extras no Firewall**: Se o sistema não pediu para abrir, mantenha fechada. Portas abertas são como janelas sem grade.
4. **Nunca desative o MFA**: Mesmo que pareça "chato" digitar o código do celular toda vez, é isso que impede um hacker de entrar se ele descobrir sua senha.

---

## 9.3 O que fazer se suspeitar de algo errado? 🚨

Se você notar logins estranhos ou sessões de suporte que ninguém da sua equipe iniciou:

1. **Troque as senhas imediatamente**: Altere o seu arquivo `.env` com novas senhas e reinicie o sistema (`docker compose up -d`).
2. **Revise os Logs**: No painel administrativo, veja quem acessou o sistema e de qual cidade/IP veio o acesso.
3. **Derrube tudo se necessário**: Em caso de emergência total, desligue o sistema temporariamente:
   ```bash
   cd /opt/remote-support
   docker compose down
   ```

---

> ✅ **CHECKPOINT**: Você agora é um administrador consciente e seguro! Estamos quase no fim.
> 
> **Próximo passo: [Documento 9: Perguntas Frequentes (FAQ)](09-perguntas-frequentes.md)**
