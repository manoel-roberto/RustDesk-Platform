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
```

### Windows
1. **Visual Studio 2022**: Instalar com a carga de trabalho "Desenvolvimento para Desktop com C++".
2. **Rust**: Instalar via [rustup.rs](https://rustup.rs/).
3. **vcpkg**: 
   ```powershell
   git clone https://github.com/microsoft/vcpkg
   .\vcpkg\bootstrap-vcpkg.bat
   $env:VCPKG_ROOT = "C:\caminho\para\vcpkg"
   ```
4. **LLVM/Clang**: Necessário para bindgen no Rust.
5. **Flutter SDK**: Configurado e adicionado ao PATH.

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

## 5. Build Facilitado via Docker (Recomendado)

Se você não quer instalar Rust, Flutter e vcpkg na sua máquina, utilize o script de Docker que criamos:

1. **Pré-requisito**: Apenas o **Docker** instalado.
2. **Executar o Build**:
   ```bash
   chmod +x build_with_docker.sh
   ./build_with_docker.sh
   ```
   
> [!NOTE]
> O Docker irá baixar a imagem `rustdesk/rustdesk-builder`, que possui todas as dependências isoladas. Esta imagem tem cerca de 4GB, mas garante que o build funcione em qualquer sistema Linux de forma idêntica.

## 6. Próximos Passos (CI/CD)

Para empresas, recomendamos usar **GitHub Actions** para gerar os executáveis (`.exe`, `.deb`, `.dmg`) automaticamente sempre que houver uma mudança nos assets. 

O arquivo `.github/workflows/build-client.yml` (se disponível) pode ser configurado para usar o script acima.

## 6. Registro de Protocolo (Acesso via Browser)

Se o botão **"Acessar"** não abrir o RustDesk no Windows, você pode registrar o protocolo manualmente usando o PowerShell (como administrador):

```powershell
# Definir o caminho do executável (ajuste se necessário)
$RustDeskPath = "C:\Program Files\RustDesk\rustdesk.exe"

# Criar chaves no registro
New-Item -Path "HKCR:\rustdesk" -Force
Set-ItemProperty -Path "HKCR:\rustdesk" -Name "(Default)" -Value "URL:RustDesk Protocol"
Set-ItemProperty -Path "HKCR:\rustdesk" -Name "URL Protocol" -Value ""

New-Item -Path "HKCR:\rustdesk\shell\open\command" -Force
Set-ItemProperty -Path "HKCR:\rustdesk\shell\open\command" -Name "(Default)" -Value "`"$RustDeskPath`" `"%1`""
```
