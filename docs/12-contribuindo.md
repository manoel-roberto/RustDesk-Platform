# 12 — Como contribuir com o projeto? 🤝

⏱️ **Tempo estimado:** 15–20 minutos (leitura)

Este projeto não é apenas um conjunto de códigos; ele é o resultado de uma colaboração entre humanos e **Agentes de Inteligência Artificial**. Ele foi construído utilizando a ferramenta **Antigravity**, o que significa que o desenvolvimento foi rápido, documentado e pensado para ser fácil de manter.

Se você quer ajudar a tornar a **RustDesk Platform** ainda melhor, este guia é para você!

---

## 1. O Jeito "Agente" de Desenvolver 🤖

Diferente de projetos tradicionais onde você precisa saber cada linha de código, este projeto foi desenhado para que **Agentes de IA** (como o que está conversando com você agora) ajudem na construção.

### O que é o Antigravity?
O **Antigravity** é a interface que permite que IAs potentes explorem o código, criem testes e implementem funcionalidades de forma segura. Se você tiver acesso a ferramentas de codificação baseadas em agentes, você pode simplesmente dizer: *"Estude o projeto e adicione um novo relatório de acesso"*, e a IA fará o trabalho pesado para você.

---

## 2. Configurando sua Máquina 💻

Seja você um programador experiente ou alguém que está começando agora, aqui está o que você precisa para rodar o projeto no seu computador:

### Requisitos Básicos:
1.  **Git**: Para baixar o código.
2.  **Node.js (v20+)**: O motor que roda o site e a API.
3.  **Docker & Docker Compose**: Para rodar o banco de dados e o RustDesk localmente.

### Passo a Passo:
```bash
# 1. Clone o seu Fork
git clone https://github.com/SEU_USUARIO/RustDesk-Platform.git
cd RustDesk-Platform

# 2. Instale as dependências da API
cd api && npm install

# 3. Instale as dependências do Web
cd ../web && npm install

# 4. Inicie o banco de dados e o cache
cd ..
docker compose up -d postgres-db redis-cache
```

---

## 3. Como Propor Melhorias? 💡

Não precisa ser um gênio da programação para ajudar. Existem várias formas de contribuir:

### Para Usuários (Não-programadores):
-   **Abrir Tarefas (Issues)**: Encontrou um erro ou tem uma ideia legal? Vá na aba **"Issues"** no GitHub e descreva o que você gostaria de ver. Use o título: `[Sugestão] Nome da Ideia`.
-   **Melhorar Textos**: Viu um erro de português ou uma explicação difícil na documentação? Você pode editar o arquivo direto no GitHub e enviar uma sugestão.

### Para Desenvolvedores:
1.  **Crie uma Branch**: `git checkout -b minha-melhoria`.
2.  **Faça sua mágica**: Implemente a função ou corrija o erro.
3.  **Rode os testes**: Garanta que nada quebrou com `npm test`.
4.  **Envie um Pull Request (PR)**: Explique o que você fez e por que isso ajuda o projeto.

---

## 4. Onde podemos melhorar? 🚀

Estamos sempre buscando evoluir. Algumas áreas onde precisamos de ajuda:
-   **Traduções**: Levar este guia para outros idiomas.
-   **Novos Relatórios**: Criar gráficos mais detalhados no painel administrativo.
-   **Segurança**: Testar e reforçar as camadas de proteção do Keycloak.
-   **Mobile**: Melhorar a experiência do portal em celulares.

---

## 5. Queremos te ouvir! 🗣️

O projeto RustDesk Platform é comunitário. Se você usou o projeto e ele te ajudou, conte para a gente! Se ele foi difícil de instalar, conte também para que possamos melhorar este guia.

> ✅ **Agradecimento**: Obrigado por fazer parte desta jornada de construção inteligente!
