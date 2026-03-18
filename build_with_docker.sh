#!/bin/bash
# ==============================================================================
# Script de Compilação via Docker (RustDesk Custom Client)
# Requisito: Gerar o executável sem instalar dependências no host.
# ==============================================================================

set -e

# Configurações (Mesmas do build_custom_client.sh)
APP_NAME="RustDeskSuporte"
ID_SERVER="hbbr.empresa.com"
PUB_KEY="AnITNtuLgMFs0NhSMRL0BCexnuxXQU5LLrgq7FkVwo8="
API_SERVER="http://localhost:3000"

RUSTDESK_SRC="./rustdesk"

echo "=== Iniciando Build do RustDesk via Docker ==="

# 1. Preparar código-fonte
if [ ! -d "$RUSTDESK_SRC" ]; then
    echo "-> Clonando repositório oficial do RustDesk..."
    git clone --recursive https://github.com/rustdesk/rustdesk.git $RUSTDESK_SRC
fi

# 2. Injetar configurações customizadas
echo "-> Preparando .env e configurações..."
cat <<EOF > $RUSTDESK_SRC/.env
RENDEZVOUS_SERVER=$ID_SERVER
RS_PUB_KEY=$PUB_KEY
API_SERVER=$API_SERVER
EOF

# 3. Rodar o Builder via Docker
echo "-> Executando compilação dentro do container (rustdesk/rustdesk-builder)..."
echo "Aguarde, isso pode demorar bastante (vcpkg e cargo build)..."

# Usamos o comando oficial do rustdesk builder
docker run --privileged --rm -it \
    -v "$(pwd)/$RUSTDESK_SRC":/home/user/rustdesk \
    -w /home/user/rustdesk \
    rustdesk/rustdesk-builder \
    python3 build.py --hwcodec --nightly

echo "=============================================================================="
echo "Build concluído via Docker!"
echo "O executável deverá estar na pasta: $RUSTDESK_SRC/target/release/"
echo "=============================================================================="
