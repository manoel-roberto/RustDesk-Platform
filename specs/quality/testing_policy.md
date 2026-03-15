# Política de Testes e Qualidade

> **Arquivo:** `specs/quality/testing_policy.md`  
> **Versão:** 1.0.0  

Este documento estabelece as diretrizes obrigatórias para garantia de qualidade e verificação de implementações no projeto RustDesk Platform.

## 1. Princípios de Desenvolvimento (TDD)
O projeto adota a cultura **Test-Driven Development (TDD)** como pilar fundamental. 
- **Red**: Escreva um teste que falha para a nova funcionalidade.
- **Green**: Escreva o código mínimo necessário para fazer o teste passar.
- **Refactor**: Melhore o código garantindo que os testes continuam passando.

## 2. Pirâmide de Testes
As implementações devem seguir a proporção ideal:
1. **Testes Unitários (Base)**: Testar lógica isolada de funções e componentes (Jest no Backend/Frontend).
2. **Testes de Integração**: Validar a comunicação entre módulos e acesso ao banco de dados.
3. **Testes E2E (Topo)**: Validar fluxos completos do usuário (Playwright/Cypress).

## 3. Critérios de Aceite para Conclusão
Uma tarefa só é marcada como `[x] Concluída` se:
- [ ] O código cumpre todos os Requisitos Funcionais (REQ-F).
- [ ] Existem testes unitários cobrindo todos os novos métodos/componentes.
- [ ] A cobertura de testes (Coverage Report) não diminuiu.
- [ ] Um Walkthrough de verificação foi gerado com evidências reais.

## 4. Ferramentas Utilizadas
- **Backend (NestJS)**: Jest, Supertest.
- **Frontend (React)**: Vitest, React Testing Library.
- **Infraestrutura**: Docker Compose para levantamento de ambientes de teste efêmeros.

---
*Assinado: Equipe de Arquitetura e QA*
