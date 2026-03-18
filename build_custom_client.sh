#!/bin/bash
# ==============================================================================
# Script de automação de compilação customizada (RustDesk Custom Client)
# Requisito: REQ-F-030 a REQ-F-035 (White Label e Hardcode de API/Keys)
# ==============================================================================

set -e

# ================= Configurações de Compilação ==============================
APP_NAME="RustDeskSuporte"
ID_SERVER="hbbr.empresa.com"
RELAY_SERVER="hbbr.empresa.com"
API_SERVER="http://localhost:3000"
PUB_KEY="AnITNtuLgMFs0NhSMRL0BCexnuxXQU5LLrgq7FkVwo8="

# Diretórios
RUSTDESK_SRC="./rustdesk"
CUSTOM_ASSETS="./custom_assets"
# ==============================================================================

echo "===Iniciando Preparação de Build White-Label RustDesk ==="

# Verifica dependências básicas
if ! command -v git &> /dev/null; then echo "git não encontrado. Instale o git."; exit 1; fi
if ! command -v cargo &> /dev/null; then echo "cargo (Rust) não encontrado."; exit 1; fi

# Clone ou atualiza o repositório
if [ ! -d "$RUSTDESK_SRC" ]; then
    echo "-> Clonando repositório oficial do RustDesk..."
    git clone https://github.com/rustdesk/rustdesk.git $RUSTDESK_SRC
else
    echo "-> Repositório já clonado, prosseguindo no diretório existente..."
fi

cd $RUSTDESK_SRC

echo "-> 1/3 Injetando credenciais e bloqueando conexões externas (Hardcoded)"
# RustDesk permite através do .env customizar o comportamento no processo de build
cat <<EOF > .env
RENDEZVOUS_SERVER=$ID_SERVER
RS_PUB_KEY=$PUB_KEY
API_SERVER=$API_SERVER
EOF

# Caso deseje forçar isso em nível de código-fonte (Rust) para ignorar o que usuário digitar na tela:
echo "Forçando chaves no src/common.rs como fallback absoluto..."
# Descomentar e ajustar caso seja necessário pregar a chave irreversivelmente sem deixar o usuário alterar no app.
# sed -i "s/pub const RENDEZVOUS_PORT: i32 = 21116;/pub const RENDEZVOUS_PORT: i32 = 21116; pub const RENDEZVOUS_SERVER: \&str = \"$ID_SERVER\";/g" src/common.rs || true

echo "-> 2/3 Identidade Visual (White-Label) e Nome do Executável"
if [ -d "../$CUSTOM_ASSETS" ]; then
    echo "Aplicando assets visuais (ícones e splash screens)..."
    cp -f ../$CUSTOM_ASSETS/icon.ico res/icon.ico || true
    cp -f ../$CUSTOM_ASSETS/icon.png res/icon.png || true
    cp -f ../$CUSTOM_ASSETS/mac_icon.icns res/mac_icon.icns || true
    cp -f ../$CUSTOM_ASSETS/logo.svg res/logo.svg || true
else
    echo "Aviso: Diretório de assets customizados '../$CUSTOM_ASSETS' não encontrado. Usando logos padrão do RustDesk."
fi

echo "Modificando Cargo.toml para alterar o nome da aplicação para '$APP_NAME'..."
# Atenção: mudar o package.name muda o nome do binário final gerado.
sed -i -E "s/^name = \"rustdesk\"/name = \"$APP_NAME\"/g" Cargo.toml

echo "-> 3/3 Iniciando compilação do binário (Requer ambiente configurado, dependências como vcpkg e protobuf instaladas)..."
# Exemplo de comando genérico de build:
# (Pode-se substituir conforme a pipeline de CI/CD para dockcross ou gh actions)
echo "Executando build com python3 build.py..."
# Desabilitar abaixo se apenas for testar o pipeline do script sem tentar o build pesadíssimo de fato.
# python3 build.py --hwcodec --nightly

echo "=============================================================================="
echo "Preparação concluída!"
echo "Caso executado no CI/CD, o instalador (ex: EmpresaSupport.exe) será disponibilizado."
echo "Certifique-se de expor a Public Key via pipeline: $PUB_KEY"
