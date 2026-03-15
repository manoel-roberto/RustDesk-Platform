# 🛠️ Guia de Compilação de Clientes Customizados

Este documento detalha como compilar e customizar o RustDesk para criar o **Cliente do Técnico** (quem acessa) e o **Agente de Suporte** (máquina acessada).

## 📋 Requisitos de Ambiente (Windows/Linux)

Para realizar o build, sua máquina de desenvolvimento deve ter:
- **Rust**: Versão estável mais recente (`rustup`).
- **Python 3**: Para rodar o script de build oficial do RustDesk.
- **Git**: Para clonar o código fonte.
- **VCPKG**: Gerenciador de dependências C++ (necessário para bibliotecas gráficas/rede).
- **Protobuf Compiler**: Essencial para comunicação entre os componentes.

---

## 🏗️ 1. Configuração do Script de Build

O projeto possui um script centralizador: `build_custom_client.sh`. Antes de executar, configure suas credenciais no topo do arquivo:

```bash
APP_NAME="SeuSuporte"
ID_SERVER="hbbs.seu-dominio.com"
RELAY_SERVER="hbbr.seu-dominio.com"
API_SERVER="https://api.seu-dominio.com"
PUB_KEY="SuaChavePublicaBase64"
```

O script injeta essas informações diretamente no binário para que o usuário final não precise configurar nada manualmente.

---

## 👨‍💻 2. Cliente do Técnico (Technician Client)

Este é o executável completo utilizado pela sua equipe de suporte.

- **Diferencial**: Possui interface completa para login (SSO/Keycloak), Address Book e histórico de sessões.
- **Como Compilar**:
  1. Execute o script `build_custom_client.sh`.
  2. O binário gerado incluirá todas as funcionalidades habilitadas.
  3. **White Label**: Certifique-se de colocar seus ícones na pasta `./custom_assets` antes do build.

---

## 🤖 3. Agente de Suporte (Host Agent)

Este executável é o que será enviado aos clientes que precisam de assistência.

### Configurações Específicas:
Diferente do cliente do técnico, o agente remoto deve ser otimizado para ser leve e seguro:
- **Hardcoded Settings**: O script de build força o uso do seu servidor ID/Relay.
- **Permissões**: Para melhor performance, o agente deve ser instalado como **Serviço do Windows**, permitindo controle de tela em janelas de administrador (UAC).

### Instalador Silencioso:
Ao compilar o instalador (.exe), você pode usar parâmetros de linha de comando para instalação em massa via GPO ou scripts:
```powershell
.\EmpresaSupport.exe --install --silent-install
```

---

## 🔄 4. Processo de Customização (White Label)

O script realiza as seguintes trocas automatizadas:
1. **Ícones**: Substitui `res/icon.ico` e `res/icon.png`.
2. **Nome**: Altera o `package.name` no `Cargo.toml`.
3. **Bloqueio de Configuração**: Opcionalmente, desabilita menus de configuração de rede para o usuário final, garantindo que ele sempre use a sua infraestrutura.

---

## 🚀 Próximos Passos
Para automação total, utilize o **GitHub Actions** (configurado em `.github/workflows`) para gerar os instaladores automaticamente a cada nova versão (Release) no repositório.
