# 12 — Como contribuir? (O Guia Amigo do Iniciante) 🤝🌍✨

Olá! Se este é o seu primeiro contato com um projeto de código aberto, **seja muito bem-vindo!** 

Sabemos que dar o primeiro passo pode dar um frio na barriga. "E se eu quebrar algo?", "E se meu código for ruim?", "E se eu não entender nada?". Tire essas dúvidas da cabeça: **este projeto foi feito para você aprender.** Aqui, pegamos na sua mão e vamos juntos!

---

## 🏗️ 1. Preparando sua Bancada de Trabalho

Antes de mexer no motor do carro, precisamos das ferramentas certas. Não se apresse, faça um de cada vez:

### Passo A: O "Quadro Negro" (VS Code)
Instale o **Visual Studio Code**. Ele é onde você vai ler e escrever o código. É gratuito e o favorito de 99% dos programadores.
- [Baixar VS Code aqui](https://code.visualstudio.com/)

### Passo B: O "Garagem Mágica" (Docker)
O Docker permite que o projeto rode no seu computador sem que você precise instalar mil coisas "soltas". Ele cria um ambiente limpo e seguro.
- [Baixar Docker Desktop aqui](https://www.docker.com/products/docker-desktop/)

### Passo C: O "Passaporte" (Git)
O Git é o que permite você baixar o código e enviar suas melhorias de volta.
- [Instalar Git aqui](https://git-scm.com/)

---

## 📥 2. Pegando o Código (O seu "Fork")

Imagine que este projeto é um livro em uma biblioteca. Você não pode riscar o original, mas pode tirar uma **xerox** e fazer suas anotações nela. Essa xerox se chama **Fork**.

1. Vá no topo desta página no GitHub e clique no botão **Fork**.
2. Agora você tem uma cópia sua! Baixe-a para o seu computador:
   ```bash
   git clone https://github.com/SEU_USUARIO/RustDesk-Platform.git
   cd RustDesk-Platform
   ```

---

## 🔥 3. Ligando os Motores (Pela primeira vez)

Com o Docker aberto, rode este comando na pasta do projeto:
```bash
docker compose up -d
```
Espere uns minutos. Quando terminar, abra seu navegador e digite `http://localhost:3000`. Se você vir a tela da plataforma, **PARABÉNS!** Você acaba de rodar um sistema complexo no seu próprio computador.

---

## 🛠️ 4. Sua Primeira Contribuição (Prática!)

Vamos "pegar na mão" mesmo. Escolha um desses desafios para começar:

### 🏆 Nível 1: O "Corretor" (Mudar um Texto)
Acha que um botão poderia ter um nome melhor?
1. Procure o arquivo onde o texto está (geralmente em `web/src/...`).
2. Mude o texto de "Login" para "Entrar na Plataforma".
3. Salve e veja a mudança no navegador na hora!

### 🎨 Nível 2: O "Designer" (Mudar uma Cor)
Quer deixar o sistema com a cara da sua empresa?
1. Vá na pasta `web/` e procure pelos arquivos `.css`.
2. Mude uma cor de fundo (ex: `#007bff` para o seu azul favorito).
3. Sinta o orgulho de ver o sistema mudando de cor por causa de você!

### 🔍 Nível 3: O "Investigador" (Adicionar um Log)
Quer saber o que o servidor está pensando?
1. Vá na pasta `api/src/` e encontre um arquivo de serviço.
2. Adicione esta linha: `console.log("Olá, eu sou um novo colaborador!");`
3. Olhe os logs do Docker e veja sua mensagem aparecendo lá!

---

## 🚀 5. Enviando sua Obra para o Mundo

Terminou sua mudança? Vamos devolver para a biblioteca (Pull Request):

1. **Salve seu trabalho localmente**:
   ```bash
   git add .
   git commit -m "Explique aqui o que você fez"
   git push origin master
   ```
2. Vá no seu GitHub e você verá um botão verde escrito **"Compare & pull request"**.
3. Clique nele, escreva uma mensagem simpática contando o que você aprendeu e pronto! **Nós vamos analisar e aceitar com o maior prazer.**

---

## 🤖 6. O Segredo dos Agentes (Antigravity)

Lembra que falamos que este projeto foi feito com IA? Se você travar em alguma parte, **não tenha vergonha de pedir ajuda para uma IA** (como ChatGPT ou Claude). 

Mostre o erro para ela e diga: *"Estou contribuindo para o projeto RustDesk Platform e meu Docker deu esse erro, pode me ajudar?"*. A IA já conhece este projeto e vai saber te guiar!

---

## ❤️ 7. Por que você deve continuar?

Cada pequena vírgula que você corrige ajuda centenas de outras pessoas a terem uma ferramenta de suporte remoto melhor e mais barata. **Você agora é um Desenvolvedor de Software.** O caminho é longo, mas o primeiro passo já foi dado.

> 🌟 **"A jornada de mil milhas começa com um único passo."** 
> Estamos te esperando nos Pull Requests! Vamos construir o futuro juntos. 🚀
