# 🎨 Frontend: UI/UX e Consumo de API

O frontend é uma SPA (Single Page Application) moderna desenvolvida para proporcionar uma experiência fluida tanto para administradores quanto para técnicos de suporte.

## 🚀 Tecnologias
- **Build Tool**: Vite
- **Framework**: React 18
- **Estilização**: CSS Vanilla (Design System proprietário)
- **Ícones**: Lucide React
- **Autenticação**: `react-oidc-context` (Integração Keycloak)

## 🏛️ Arquitetura de Páginas
- **Portal do Técnico (`/technician`)**: Focado em velocidade. Listagem de máquinas online/offline com um clique para conexão via Deep Link (`rustdesk://`).
- **Portal Admin (`/admin`)**: Dashboard gerencial com estatísticas de uso e gestão de grupos/dispositivos.
- **Login**: Tela de redirecionamento SSO.

## 🎨 Design System
Mantemos uma estética **Premium/Dark Mode**:
- **Glassmorphism**: Uso de `backdrop-filter: blur` em cards e menus.
- **Cores**: Tons de cinza escuro, Deep Blue para acentos e cores vibrantes para status (verde=online, cinza=offline).
- **Responsividade**: Layout adaptável para tablets e desktops.

## 🔌 Consumo de API
Utilizamos **Axios** para chamadas. O interceptor de autenticação está em `src/api/axios.ts` e anexa automaticamente o token JWT do Keycloak em todas as chamadas.

## 🛠️ Comandos Úteis
```bash
cd web
npm run dev    # Iniciar servidor de desenvolvimento
npm run build  # Gerar build de produção na pasta /dist
```
