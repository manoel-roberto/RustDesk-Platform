# 07 — Mantendo tudo funcionando (Manutenção e Backups) 🛠️

⏱️ **Tempo estimado:** 30–40 minutos

Imagine que a sua plataforma é um carro novo. Para ele durar muitos anos e não te deixar na mão, você precisa trocar o óleo e calibrar os pneus de vez em quando. Este guia ensina como fazer a "revisão" do sistema.

---

## 8.1 Verificando a Saúde (Check-up Diário) 🩺

Uma vez por dia (ou quando achar necessário), dê uma olhadinha para ver se todos os "motores" estão ligados:

```bash
cd /opt/remote-support
docker compose ps
```
> ✅ **O QUE VERIFICAR**: Na coluna **STATUS**, todos os serviços devem dizer "Up" ou "Running". Se algum disser "Exit", algo parou de funcionar e precisa de atenção.

---

## 8.2 Fazendo Backup (Cópia de Segurança) 💾

Este é o passo **MAIS IMPORTANTE** de toda a documentação. Se o seu servidor der problema, você só conseguirá recuperar tudo se tiver um backup.

### O que você DEVE guardar:
1. **Banco de Dados**: Onde estão os seus dispositivos e histórico.
2. **Chaves do RustDesk (id_ed25519)**: São os crachás de segurança. Se você perdê-los, terá que reinstalar o programa em **TODOS** os seus clientes.

### Como fazer o backup manual:
Rode estes comandos para gerar o arquivo de segurança:
```bash
# Backup do banco de dados
docker compose exec postgres pg_dump -U remote_support_user remote_support_db > backup_banco.sql

# Copiar as chaves de segurança para fora do Docker
docker compose cp hbbs:/data/id_ed25519 ./id_ed25519_bkp
```
> 🔒 **SEGURANÇA**: Baixe esses arquivos para o seu próprio computador ou guarde-os em um local seguro (como Google Drive ou Dropbox).

---

## 8.3 Como Atualizar o Sistema 🔄

Novas versões do RustDesk e da plataforma saem com frequência, trazendo correções e novos recursos. Veja como atualizar de forma segura:

1. **Faça um backup** (conforme ensinei acima) antes de começar.
2. Baixe as novidades:
   ```bash
   git pull origin master
   ```
3. Atualize os programas em segundo plano:
   ```bash
   docker compose pull
   docker compose up -d
   ```

---

## 8.4 Painel de Controle (Grafana) 📊

Para uma visão profissional de como está o uso de memória, internet e processador, usamos o **Grafana**. 

Imagine o Grafana como o **painel de instrumentos de um avião**: ele mostra gráficos de tudo o que está acontecendo agora.
- **Como acessar**: `https://admin.empresa.com.br/grafana` (se configurado).

---

## 8.5 Como Restaurar um Backup (Recuperação) 🚑

Se você perdeu o servidor ou os dados sumiram, é hora de usar o seu backup. Imagine que você está **desfazendo uma mudança** ou reformando a casa com as fotos de como ela era antes.

### Passo 1: Restaurar o Banco de Dados
Com o arquivo `backup_banco.sql` no servidor, rode:
```bash
cat backup_banco.sql | docker compose exec -T postgres psql -U empresa_admin -d rustdesk_platform
```

### Passo 2: Restaurar as Chaves de Segurança
Coloque o arquivo `id_ed25519_bkp` na pasta `./data/rustdesk-data/` e rode:
```bash
docker compose restart hbbs
```
> ✅ **IMPORTANTE**: Após restaurar as chaves, os seus clientes voltarão a confiar no servidor automaticamente.

---

## 8.6 Como Voltar para a Versão Anterior (Rollback) ⏪

Atualizou o sistema e algo parou de funcionar? Não entre em pânico. Podemos "voltar no tempo" usando o Git.

1. Identifique a versão anterior de sucesso:
   ```bash
   git log --oneline
   ```
2. Volte para ela (troque `ABC1234` pelo código que aparecer no log):
   ```bash
   git checkout ABC1234
   ```
3. Reinicie os sistemas na versão antiga:
   ```bash
   docker compose up -d
   ```

---

> ✅ **CHECKPOINT**: Agora você sabe como salvar e como recuperar o seu sistema! Você é um administrador completo.
> 
> **Próximo passo: [Documento 11: Esteira de Deploy](11-esteira-de-deploy.md)**

