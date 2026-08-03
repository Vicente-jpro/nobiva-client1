# Integração com a API Nobiva

- Desenvolvimento: `environment.ts` usa `http://localhost:8080/api`.
- Produção: `environment.prod.ts` usa `/api`, assumindo frontend e API no mesmo domínio (ou um proxy reverso para `/api`).
- O interceptor JWT só adiciona o token em chamadas destinadas à API configurada.
- A criação de uma casa recebe o objeto criado, incluindo `id`, e usa esse identificador no upload de imagens.
- O formulário envia o campo obrigatório `property_type` aceito pelo backend.

Para instalar e validar:

```bash
npm ci
npm run build
```

