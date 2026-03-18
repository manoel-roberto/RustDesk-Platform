# 🔑 Credenciais de Teste (Ambiente de Desenvolvimento)

Este arquivo contém as credenciais para testes rápidos na API via Swagger ou ferramentas como Postman/Insomnia.

> [!WARNING]
> **NUNCA** use estas credenciais em ambientes de produção.

## 👤 Usuário Padrão
- **Username:** `teste`
- **Password:** `123456`
- **Realm:** `rustdesk`

## 🛠️ Como obter um novo token
Caso o token abaixo expire, você pode gerar um novo executando este comando no terminal:

```bash
curl -X POST 'http://localhost:8080/realms/rustdesk/protocol/openid-connect/token' \
 -H 'Content-Type: application/x-www-form-urlencoded' \
 -d 'grant_type=password' \
 -d 'client_id=admin-cli' \
 -d 'username=teste' \
 -d 'password=123456'
```

---

---

## 🔑 Token JWT Atual (Válido por 5 minutos)
Copie o código abaixo e cole no campo **Value** do Swagger:

```text
eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZa2Y3QjNNZEtNUk9WMVBjcFZBd2tFYWdZM1pTbVcwQ3JueTR6OWlkZlNjIn0.eyJleHAiOjE3NzM3OTMyNjUsImlhdCI6MTc3Mzc5Mjk2NSwianRpIjoiNDFmMjEzZTMtNzlkYy00YTE5LWIxZWMtNGQyYmM3YzE3YmUxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9ydXN0ZGVzayIsInN1YiI6ImQwOTM2MDcwLTM1MGUtNDYyYS05YzA2LTUzNDRmMDg0NjZlYiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFkbWluLWNsaSIsInNlc3Npb25fc3RhdGUiOiJhNmE0NmQzNy0wZGM4LTQ0Y2EtOWY3NC05NTBiY2Y2YmRiMzYiLCJhY3IiOiIxIiwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiYTZhNDZkMzctMGRjOC00NGNhLTlmNzQtOTUwYmNmNmJkYjM2IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiVGVzdGUgVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3RlIiwiZ2l2ZW5fbmFtZSI6IlRlc3RlIiwiZmFtaWx5X25hbWUiOiJVc2VyIiwiZW1haWwiOiJ0ZXN0ZUBleGVtcGxvLmNvbSJ9.f91lI5FrrAFbarY8-4QqQ4ett1smAd_CWqK8CrMnXWieX1JcGr8EpMd3URGmsPQMRwkf8VTefB5y6wOJp1Mrs7FcxJkv5mlS0C2_LvQ8zsIwQp2SFY0BHzhIuzNYNFTgCOLzfd3kUKQJzCGYNX_Q4hrleooOey2u5ZThYlbz0FvFX3PLH1I_ZSlFV0sZ2ffjjMSNfJkrrIWNSgr2OcSJKdo_pac4BoGdX88qCLEBQxcFPYsLpBySmq9ge_lCYYmoz1B_d0AX-jF2vatNNVH4FIZ85a1mQgcvHqRkupNyZsgTKUhra-jxmL36vOAUwuglQr7rpi34Ux-DcU9p56uuoQ
```

> [!NOTE]
> Os tokens JWT expiram rapidamente por segurança. Use o comando `curl` acima para gerar um novo sempre que necessário.

*Última atualização: 2026-03-17*
