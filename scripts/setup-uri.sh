#!/bin/bash
# scripts/setup-uri.sh

SCRIPT_PATH="/home/manoel/Projects/Rustdesk/scripts/rustdesk-uri-handler.sh"
DESKTOP_PATH="/home/manoel/Projects/Rustdesk/scripts/rustdesk-custom.desktop"

chmod +x "$SCRIPT_PATH"

echo "Registrando o handler de URI RustDesk..."

# Copiar arquivo desktop para o local de aplicativos do usuário
mkdir -p ~/.local/share/applications/
cp "$DESKTOP_PATH" ~/.local/share/applications/

# Atualizar o banco de dados de MimeTypes e definir como padrão
update-desktop-database ~/.local/share/applications/
xdg-mime default rustdesk-custom.desktop x-scheme-handler/rustdesk

echo "Configuração concluída! Agora links rustdesk:// abrirão via o handler customizado."
