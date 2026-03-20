# 12 — Como contribuir? (O Guia Mestre do Desenvolvedor Moderno) 🤝🌍🚀

Olá! Este não é apenas um guia de contribuição comum. Este projeto foi concebido sob uma nova filosofia de desenvolvimento: a **Parceria entre Humanos e Agentes de IA**. 

Se você sempre quis criar algo grande, mas achava que "não levava jeito para código", este guia vai mudar sua perspectiva. Aqui, o foco é **como usar as ferramentas para tirar suas ideias do papel.**

---

## 🏗️ 1. Preparando sua Bancada de Trabalho

Diferente de outros projetos, aqui recomendamos ferramentas que aumentam o seu poder de criação:

### Passo A: O seu novo Assistente (Antigravity)
Em vez de usar um editor simples, recomendamos o **Antigravity**. Ele é a ferramenta que estamos usando para construir este projeto. O Antigravity permite que você converse com o código e peça ajuda a Agentes de IA que entendem todo o sistema.
- **Como usar**: Siga as instruções de instalação do Antigravity para integrá-lo ao seu ambiente de desenvolvimento. Ele será o seu "parceiro de programação".

### Passo B: A "Garagem Mágica" (Docker)
O Docker rodará o sistema para você. Onde você estiver:
- **No Windows**: Baixe o [Docker Desktop](https://www.docker.com/products/docker-desktop/). Ative o uso do **WSL2** nas configurações para melhor performance.
- **No Linux**: Instale o `docker` e o `docker-compose` via terminal (ex: `sudo apt install docker-compose`).

### Passo C: O "Passaporte" (Git)
- **Windows**: Instale o [Git for Windows](https://gitforwindows.org/).
- **Linux**: Já costuma vir instalado (ou `sudo apt install git`).

---

## 📥 2. O Passo a Passo do Fork (Sua Cópia Pessoal)

O **Fork** é fundamental. Sem ele, você não consegue propor mudanças. Veja como fazer:

1.  **No site do GitHub**: Vá até a página principal deste repositório: [manoel-roberto/RustDesk-Platform](https://github.com/manoel-roberto/RustDesk-Platform).
2.  **O Botão Mágico**: No canto superior direito, clique em **"Fork"**.
3.  **Escolha o Destino**: Selecione sua conta pessoal. 
4.  **Pronto!**: Agora o endereço será `https://github.com/SEU_USUARIO/RustDesk-Platform`.
5.  **Baixe para sua máquina**:
    ```bash
    git clone https://github.com/SEU_USUARIO/RustDesk-Platform.git
    cd RustDesk-Platform
    ```

---

## 🤖 3. O Segredo dos Agentes (Antigravity na Prática)

Este projeto foi construído "conversando" com a máquina. O Antigravity não apenas completa seu código; ele **resolve problemas**.

### Como configurar para contribuir:
1. Abra o projeto no Antigravity.
2. Peça para o Agente analisar a pasta `/specs`. 
3. **Exemplo Prático**: Digite para o Agente: *"Analise a spec de documentação e crie um novo arquivo de guia para usuários de Mac"*.
4. O Agente vai ler as regras, entender o estilo e escrever o arquivo para você revisar.

> 💡 **DESBLOQUEIO MENTAL**: A barreira não é mais saber programar cada caractere, mas sim **saber o que pedir e como estruturar a ideia**. O Antigravity é o seu braço direito nessa jornada.

---

## 📝 4. Desenvolvimento Baseado em Specs (Especificações)

Nós não programamos "de cabeça". Usamos **Especificações**. Veja a pasta `specs/`.

### O Fluxo "Mestre":
1.  **Defina a Ideia**: Escreva o que você quer fazer em um arquivo `.md` (ex: `specs/nova-funcao.md`).
2.  **Peça a Implementação**: Peça para o Agente da IA ler essa spec e implementar o código.
3.  **Valide**: Use o Agente para testar se o que foi escrito bate com o que foi planejado.

**Você pode usar esse mesmo padrão para criar SEUS próprios projetos do zero!** Basta criar uma pasta `specs/`, definir o que quer e deixar a IA te ajudar na construção.

---

## 🛠️ 5. Desafios para Começar (Mão na Massa!)

Escolha um caminho e sinta o poder de contribuir:

- **Windows + PowerShell**: Rode `docker-compose up -d` e veja os containers subindo. Se der erro de porta, peça ajuda ao seu Agente de IA para resolver.
- **Linux + Terminal**: Rode `sudo docker-compose up -d`. Tente mudar o nome de um serviço no arquivo `docker-compose.yml` e veja o que acontece.

---

## 🚀 6. Enviando suas Melhorias

Uma vez que você testou e funcionou:

1.  `git add .`
2.  `git commit -m "Minha primeira contribuição guiada por IA"`
3.  `git push origin master`
4.  Vá no GitHub original e clique em **"Open Pull Request"**.

---

## ❤️ 7. Conclusão: Você é o Arquiteto

Este projeto prova que a tecnologia agora está nas mãos de quem tem **vontade**. Não importa se você é um iniciante total. Com o **Antigravity**, as **Specs** e este guia, você tem o mapa da mina.

> 🌟 **"A ideia é o tijolo, a IA é o pedreiro, e você é o Arquiteto."** 
> Te esperamos no próximo Pull Request! 🏁🚀
