# Guia de Compilação: Cliente RustDesk Customizado

Este guia orienta como gerar sua própria versão do executável RustDesk para técnicos, com servidor e chave pré-configurados.

## 1. Requisitos do Ambiente

O RustDesk é construído com **Rust** (backend) e **Flutter** (UI).

### Linux (Ubuntu/Debian)
```bash
# Dependências de sistema
sudo apt install -y g++ gcc git curl wget nasm yasm libgtk-3-dev libxcb-randr0-dev \
libxdo-dev libxfixes-dev libxcb-shape0-dev libxcb-xfixes0-dev libasound2-dev \
libpulse-dev clang cmake ninja-build python3-pip

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Instalar Flutter
# Recomendamos seguir o guia oficial: https://docs.flutter.dev/get-started/install/linux
```

## 2. Configuração do Script

Já atualizamos o arquivo `build_custom_client.sh` na raiz do projeto com os seguintes dados:
- **ID/Relay Server**: `hbbr.empresa.com`
- **Public Key**: `AnITNtuLgMFs0NhSMRL0BCexnuxXQU5LLrgq7FkVwo8=`
- **App Name**: `RustDeskSuporte`

> [!TIP]
> Se o seu servidor tiver um IP público ou domínio diferente de `empresa.com`, altere essas variáveis no script antes de rodar.

## 3. Personalização (Branding)

Para trocar os logos e ícones:
1. Crie uma pasta chamada `custom_assets` na raiz do projeto.
2. Coloque nela os arquivos:
   - `icon.ico` (Windows)
   - `icon.png` (Linux/General)
   - `logo.svg` (Interface)

O script `build_custom_client.sh` copiará esses arquivos para dentro do código do RustDesk automaticamente.

## 4. Executando o Build

1. Dê permissão de execução:
   ```bash
   chmod +x build_custom_client.sh
   ```
2. Execute o script:
   ```bash
   ./build_custom_client.sh
   ```

O script irá clonar o repositório oficial, aplicar suas configurações e preparar o ambiente. 

## 5. Próximos Passos (CI/CD)

Para empresas, recomendamos usar **GitHub Actions** para gerar os executáveis (`.exe`, `.deb`, `.dmg`) automaticamente sempre que houver uma mudança nos assets. 

O arquivo `.github/workflows/build-client.yml` (se disponível) pode ser configurado para usar o script acima.
