# ♾️ DevOps: Infraestrutura e Automação

O foco da nossa equipe de DevOps é garantir a estabilidade dos servidores RustDesk e a automação do processo de compilação dos clientes.

## 🐳 Containerização
Toda a aplicação é orquestrada via **Docker Compose**:
- `hbbs`/`hbbr`: Servidores core do RustDesk.
- `keycloak`: Gerenciamento de identidade.
- `postgres`/`redis`: Persistência e cache.
- `api-server`: Nossa lógica de backend.

## 🛠️ Automação de Build (RustDesk Customizado)
Mantemos o script `build_custom_client.sh` na raiz.
Ele é responsável por:
1.  Injetar as chaves públicas e IPs dos nossos servidores no código fonte do RustDesk.
2.  Substituir as logomarcas e ícones originais pelos da empresa.
3.  Gerar o binário pronto para distribuição.

## 🚀 Pipeline CI/CD (Planejado)
- **GitHub Actions**: Automatizar o build dos clientes para cada release.
- **Docker Hub/Registry**: Armazenamento de imagens da API e Frontend.

Para instruções de instalação em servidores, veja o [Manual de Deploy VPS](vps-deployment.md).

## 🛡️ Segurança de Infra
Conforme requisitos, o banco de dados e o redis não possuem exposição de porta externa (apenas via rede interna do Docker). O acesso é garantido apenas via túnel ou aplicação.
