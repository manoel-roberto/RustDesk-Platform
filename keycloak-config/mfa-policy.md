# Guia de Configuração: MFA Obrigatório no Keycloak

> **Requisitos:** REQ-F-015 | REQ-S-004  
> **Dificuldade:** Baixa — apenas configuração via Admin Console

---

## 1. Habilitar MFA no realm `rustdesk`

1. Acesse o **Keycloak Admin Console**: `https://seu-keycloak/admin`
2. Selecione o realm **`rustdesk`**
3. Vá em **Authentication → Policies → OTP Policy**
4. Configure:
   - **OTP Type**: `TOTP` (Time-based One-Time Password)
   - **OTP Hash Algorithm**: `SHA1`
   - **Number of Digits**: `6`
   - **Look Around Window**: `1`
   - **OTP Token Period**: `30`

---

## 2. Tornar MFA obrigatório para todos os usuários

1. Vá em **Authentication → Required Actions**
2. Habilite **Configure OTP** como **Default Action**
3. Marque como **Required** para novos usuários

Para usuários existentes:
1. Vá em **Users** → selecione o usuário
2. Aba **Required User Actions**
3. Adicione **Configure OTP**

---

## 3. Configurar Authentication Flow com MFA

1. Vá em **Authentication → Flows**
2. Selecione **Browser** → **Copy** (crie uma cópia chamada `Browser MFA`)
3. No flow copiado, adicione ao sub-flow `Browser Forms`:
   - Adicione **OTP Form** com **Required**
4. Vá em **Authentication → Bindings**
5. Altere **Browser Flow** para `Browser MFA`

---

## 4. Configurar a API para exigir MFA

No arquivo `.env` da API, adicione:

```env
REQUIRE_MFA=true
```

Com esta configuração, a `JwtStrategy` irá verificar o claim `acr` do token JWT emitido pelo Keycloak. Tokens sem `acr: "mfa"` serão rejeitados com erro **401 Unauthorized**.

---

## 5. Validar o claim ACR

O Keycloak emite o campo `acr` (Authentication Class Reference) no JWT após autenticação com MFA. Você pode inspecionar o token em [jwt.io](https://jwt.io) e verificar se contém:

```json
{
  "acr": "mfa",
  "realm_access": { "roles": ["admin"] }
}
```

---

## 6. Configurar Rotação de Chaves JWT (REQ-S-022)

O Keycloak gerencia automaticamente as chaves de assinatura JWT. Para visualizar e rotacionar:

1. Vá em **Realm Settings → Keys**
2. As chaves ativas ficam disponíveis via JWKS endpoint:
   ```
   GET https://seu-keycloak/realms/rustdesk/protocol/openid-connect/certs
   ```
3. Para rotacionar manualmente: clique em **Provider → rsa-generated → Action → Disable** na chave atual — o Keycloak gerará automaticamente uma nova.

> **Importante:** A API já está configurada para buscar as chaves dinâmicamente via JWKS endpoint (com cache de 1 hora). A rotação de chaves é completamente transparente para a aplicação.

---

## Verificação

Após configurar, teste o fluxo:

```bash
# Login sem MFA - deve ser rejeitado com 401
curl -H "Authorization: Bearer <token-sem-mfa>" https://api/v1/devices

# Login com MFA - deve funcionar
curl -H "Authorization: Bearer <token-com-mfa>" https://api/v1/devices
```
