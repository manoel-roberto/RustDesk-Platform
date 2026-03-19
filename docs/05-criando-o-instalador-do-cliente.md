# 05 — Criando o Seu Instalador Personalizado (White-label) 🎨

⏱️ **Tempo estimado:** 40–60 minutos

Uma das partes mais legais deste projeto é ter um **programa com a sua marca**. Imagine o seu cliente baixando um instalador que já vem com o seu logo e já conecta direto no seu suporte, sem ele precisar configurar nada.

---

## 6.1 O que é o Cliente "White-label"? 🏷️

Sabe quando um supermercado vende um produto com a "marca própria", mas que na verdade foi feito por outra empresa? 

Aqui é a mesma coisa: você vai usar todo o motor potente do **RustDesk**, mas com a "roupagem" da sua empresa. O programa terá o seu nome, o seu logo e só aceitará conexões do **seu servidor**.

---

## 6.2 O Segredo do Seu Servidor (Chave Pública) 🔐

Para que o programa instalado no cliente confie no seu servidor, ele precisa de uma "assinatura digital" ou crachá de identificação.

Rode este comando no terminal do seu servidor para ver o crachá:
```bash
docker compose exec hbbs cat /root/id_ed25519.pub
```
> 💡 **IMPORTANTE**: Vai aparecer uma linha cheia de letras e números. **Copie e guarde ela agora**, você vai precisar dela já já no GitHub.

---

## 6.3 O Robô do GitHub (GitHub Actions) 🤖

Para criar o arquivo `.exe` para Windows ou `.deb` para Linux, não precisamos de um super computador. Usaremos o **GitHub Actions**, que é um robô automático que vive dentro do seu projeto no site do GitHub.

### Passo 1: Configurando os Segredos
No seu projeto no GitHub, vá em **Settings** > **Secrets and variables** > **Actions** e crie os seguintes "Segredos":

| Nome do Segredo | O que colocar? |
|-----------------|----------------|
| `SERVER_HOST` | O endereço do seu hbbs (ex: `suporte.empresa.com.br`) |
| `RELAY_HOST` | O endereço do seu relay (ex: `relay.empresa.com.br`) |
| `RUSTDESK_PUBLIC_KEY` | **Aquela linha de letras e números que você copiou acima.** |

---

## 6.4 Disparando a Construção (O Build) 🏗️

Para mandar o robô trabalhar, basta darmos uma "etiqueta" de versão para o nosso código. Rode estes comandos no terminal do servidor (ou no seu computador, se tiver o Git configurado):

```bash
# Dar um nome para a versão (ex: v1.0.0)
git tag v1.0.0

# Enviar essa etiqueta para o GitHub
git push origin v1.0.0
```

### O que acontece agora?
O robô do GitHub vai ver a etiqueta, acordar e começar a trabalhar! 
- **Onde ver?**: Vá na aba **"Actions"** no seu projeto no GitHub. Lá você verá o progresso em tempo real.
- **Quanto tempo demora?**: Cerca de **30 a 50 minutos**. O robô está baixando muitas peças e montando tudo para você.

---

## 6.5 O Resultado Final: O Instalador! 💎

Assim que o robô terminar, o arquivo oficial estará disponível para download:
1. Acesse `https://downloads.empresa.com.br` no seu navegador.
2. Lá estará o seu instalador (ex: `SuaEmpresa-Setup.exe`).

> ✅ **CHECKPOINT**: Agora você tem o seu próprio instalador! Mande para um cliente de teste e veja a mágica acontecer.
> 
> **Próximo passo: [Documento 6: Uso Diário](06-uso-diario.md)**
