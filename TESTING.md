# Guia de Testes - RustDesk Platform

Este documento detalha como executar a suíte de testes automatizados para os componentes de Backend (API) e Frontend (Web).

## Pré-requisitos

Certifique-se de ter o **Node.js** (v18+) e o **npm** instalados na sua máquina.

---

## 1. Testes de Backend (API)

A API utiliza o framework **NestJS** com **Jest** para testes unitários e de integração.

### Comandos Principais

Navegue até a pasta `api`:
```bash
cd api
```

| Comando | Descrição |
| :--- | :--- |
| `npm run test` | Executa todos os testes unitários uma vez. |
| `npm run test:watch` | Executa os testes em modo "watch" (re-executa ao salvar arquivos). |
| `npm run test:cov` | Gera um relatório detalhado de cobertura de código (pasta `./coverage`). |
| `npm run test:debug` | Executa os testes em modo de depuração. |

### Dicas
- Se um teste falhar devido a variáveis de ambiente, verifique o arquivo `api/.env.test` ou as configurações no `jest.config.js`.
- Os testes da API não dependem de um banco de dados real (usam mocks/TypeORM in-memory quando configurado).

---

## 2. Testes de Frontend (Web)

O Frontend utiliza **Vite** com **Vitest** e **React Testing Library**.

### Comandos Principais

Navegue até a pasta `web`:
```bash
cd web
```

| Comando | Descrição |
| :--- | :--- |
| `npm run test` | Executa todos os testes uma vez. |
| `npm run test:watch` | Executa os testes em modo interativo. |
| `npm run test:ui` | Abre a interface gráfica do Vitest no navegador (altamente recomendado). |
| `npm run test:cov` | Gera relatório de cobertura (pasta `./coverage`). |

### Dicas
- **toBeInTheDocument**: Se o seu IDE (VS Code/Cursor) mostrar um erro de tipagem nessa função, certifique-se de que o arquivo de teste contém `import '@testing-library/jest-dom';` no topo.
- Os testes rodam em um ambiente simulado (**JSDOM**), portanto não é necessário abrir o navegador para os testes básicos.

---

## Estrutura de Testes

- **API**: Localizados ao lado do código fonte (ex: `src/auth/jwt.strategy.spec.ts`).
- **Web**: Localizados na mesma pasta do componente (ex: `src/pages/AdminPortal.spec.tsx`).

## Resolução de Problemas

1. **Erros de Dependência**: Execute `npm install` na pasta correspondente (`api` ou `web`) antes de rodar os testes.
2. **Crash de Memória**: Em máquinas com pouca RAM, use `npx vitest run --threads=false` para o Web.
3. **Mocks de API**: Os testes do Frontend usam mocks de Axios em `src/api/axios.ts`. Se adicionar um novo endpoint, lembre-se de mocká-lo no respectivo arquivo `.spec.tsx`.
