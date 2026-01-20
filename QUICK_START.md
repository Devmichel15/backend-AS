# ⚡ Quick Start - Acessory Store Backend

## 1️⃣ Configurar em 2 minutos

```bash
# 1. Copie as variáveis de ambiente
cp .env.example .env

# 2. Edite .env com suas credenciais do Supabase
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_KEY=sua-chave-anon

# 3. No Supabase, copie e execute o SQL em SQL Editor
# (veja SUPABASE_SETUP.md para o SQL completo)

# 4. Inicie o servidor
npm run dev
```

## 2️⃣ Testar Endpoints

Use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) no VS Code ou Postman.

### Registrar Usuário
```http
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "email": "admin@teste.com",
  "password": "senha123",
  "role": "admin"
}
```

### Fazer Login
```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "password": "senha123"
}
```

Copie o token da resposta. Você vai usar assim:

```http
Authorization: Bearer seu_token_aqui
```

### Criar Categoria
```http
POST http://localhost:5000/categories
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "name": "Pulseiras",
  "slug": "pulseiras"
}
```

### Criar Produto
```http
POST http://localhost:5000/products
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "name": "Pulseira Premium",
  "description": "Aço inoxidável",
  "price": 150.00,
  "category_id": "uuid-da-categoria",
  "images": [
    "https://imagem1.com/pulseira.jpg",
    "https://imagem2.com/pulseira.jpg"
  ]
}
```

## 3️⃣ Arquivos Principais

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/config/supabase.js` | Conexão com Supabase |
| `src/controllers/auth.controller.js` | Login/Registro |
| `src/controllers/category.controller.js` | CRUD Categorias |
| `src/controllers/product.controller.js` | CRUD Produtos |
| `src/middlewares/auth.middleware.js` | Validar Token |
| `src/middlewares/admin.middleware.js` | Validar Admin |
| `src/routes/*.routes.js` | Rotas da API |

## 4️⃣ Comandos Úteis

```bash
# Modo desenvolvimento (reinicia automaticamente)
npm run dev

# Modo produção
npm start

# Ver dependências
npm list
```

## 5️⃣ Estrutura de Resposta

Todas as respostas seguem este padrão:

**Sucesso:**
```json
{
  "success": true,
  "message": "Operação bem-sucedida",
  "data": { }
}
```

**Erro:**
```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

## 6️⃣ Status HTTP

- `200` → OK
- `201` → Criado
- `400` → Dados inválidos
- `401` → Token inválido/não autenticado
- `403` → Sem permissão (não é admin)
- `404` → Não encontrado
- `500` → Erro no servidor

## 7️⃣ Documentação Completa

- **README.md** → Todos os endpoints com exemplos
- **SUPABASE_SETUP.md** → Configurar Supabase passo-a-passo
- **EXAMPLES.http** → Requisições prontas para copiar/colar
- **PROJECT_STRUCTURE.md** → Estrutura do projeto

## 🆘 Problemas Comuns

### "Erro: SUPABASE_URL not found"
- Verifique se `.env` existe na raiz do projeto
- Confirme que copiou as credenciais corretamente

### "Erro: Relation does not exist"
- Execute o SQL em Supabase → SQL Editor
- Aguarde alguns segundos e recarregue

### "Erro: Token inválido"
- Token expirou? Faça login novamente
- Verifique se está usando `Bearer seu_token` no header

## ✅ Checklist de Setup

- [ ] Criar projeto no Supabase
- [ ] Copiar URL e Chave para `.env`
- [ ] Executar SQL para criar tabelas
- [ ] Rodar `npm run dev`
- [ ] Registrar um usuário admin
- [ ] Fazer login e pegar token
- [ ] Testar criar categoria
- [ ] Testar criar produto com imagens

## 📞 Stack Utilizado

- **Node.js** + **Express.js** → Framework web
- **Supabase** → Banco de dados + Auth
- **JavaScript ES6** → Código moderno
- **API REST** → Padrão HTTP

---

**Backend pronto para integração com o frontend!** 🎉

Dúvidas? Veja a documentação completa em **README.md**
