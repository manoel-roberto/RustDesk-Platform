#!/bin/bash
# scripts/smoke-test.sh

echo "🚀 Iniciando Smoke Tests da Infraestrutura..."

# 1. Verificar se os serviços estão rodando
# Usando grep -E para permitir pequenas variações de hífen/underline se necessário
SERVICES=("hbbs" "hbbr" "load-balancer" "api-server" "postgres-db" "redis-cache" "keycloak" "hbbr-2" "postgres-replica")

for svc in "${SERVICES[@]}"; do
    if docker ps --format '{{.Label "com.docker.compose.service"}}' | grep -q "^$svc$"; then
        echo "✅ Serviço $svc está rodando."
    else
        echo "❌ Serviço $svc NÃO está rodando ou label não encontrada."
        # Debug: listar o que foi encontrado
        echo "   Labels encontradas: $(docker ps --format '{{.Label "com.docker.compose.service"}}' | tr '\n' ' ')"
        exit 1
    fi
done

# 2. Verificar Health Checks (Postgres principal)
if docker inspect pg_db --format='{{.State.Health.Status}}' | grep -q "healthy"; then
    echo "✅ Banco de Dados (Postgres-DB) está saudável."
else
    echo "❌ Banco de Dados (Postgres-DB) NÃO está saudável."
    exit 1
fi

# 3. Verificar conectividade da API (via Load Balancer)
# A API responde na porta 3000 do host via Load Balancer
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/devices || echo "failure")
if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "404" ] || [ "$RESPONSE" == "401" ]; then 
    echo "✅ API está acessível via Load Balancer (HTTP $RESPONSE)."
else
    echo "❌ API INACESSÍVEL via Load Balancer (HTTP $RESPONSE)."
    exit 1
fi

echo "🎉 Todos os testes de infraestrutura passaram!"
