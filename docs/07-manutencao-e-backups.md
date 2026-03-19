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

> ✅ **CHECKPOINT**: Você agora sabe como cuidar do seu sistema e garantir que ele nunca pare. Vamos para o toque final de segurança!
> 
> **Próximo passo: [Documento 8: Segurança](08-seguranca.md)**
