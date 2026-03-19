#!/bin/bash
# scripts/rustdesk-uri-handler.sh
# Este script intercepta a URL rustdesk:// e chama o binário oficial.

URI="$1"
echo "Processando URI: $URI"

# Extrair o ID (remove rustdesk:// e barra final se houver)
ID=$(echo "$URI" | sed 's/rustdesk:\/\///' | sed 's/\///g')

if [ -z "$ID" ]; then
    echo "Erro: ID não encontrado na URI."
    exit 1
fi

echo "Conectando ao dispositivo: $ID"

# Chamar o binário oficial do RustDesk instalado no sistema
if command -v rustdesk &> /dev/null; then
    rustdesk --connect "$ID"
else
    echo "Erro: Binário 'rustdesk' não encontrado no PATH."
    exit 1
fi
