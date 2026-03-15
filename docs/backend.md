# 🖥️ Backend: Arquitetura e Desenvolvimento

O backend da plataforma RustDesk é construído com **NestJS**, focado em performance, tipagem forte e escalabilidade.

## 🏗️ Stack Tecnológica
- **Framework**: NestJS (Node.js)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (TypeORM)
- **Cache & Filas**: Redis
- **Autenticação**: Keycloak (OIDC/JWT)

## 📡 Módulos Principais
1.  **Auth**: Gerencia a validação de tokens JWT emitidos pelo Keycloak e provê o endpoint `/auth/me`.
2.  **Devices**: Responsável pelo CRUD de máquinas e, principalmente, pelo endpoint `/users/peers` (protocolo esperado pelo App RustDesk).
3.  **Groups**: Lógica de agrupamento de dispositivos para permissões e organização.
4.  **Sessions**: Auditagem e registro de conexões ativas e finalizadas.

## 🛠️ Desenvolvimento
### Rodando em Dev
```bash
cd api
npm run start:dev
```
A API estará disponível em `http://localhost:3000`.

### Database Migrations
Utilizamos o TypeORM para gerenciar o esquema. As entidades estão localizadas em `src/database/entities`.

### Integração com Keycloak
A API valida os tokens contra o certificado público do Keycloak configurado via variáveis de ambiente no container.

## 📖 Documentação da API (Swagger)
O Swagger está configurado e pode ser acessado em:
`http://localhost:3000/api` (quando o servidor estiver rodando).
