# Acessory Store Backend

Backend API para o ecommerce **Acessory Store** desenvolvido com **Node.js + Express.js + Supabase**.

## 📋 Requisitos

- Node.js (v14+)
- npm ou yarn
- Conta Supabase configurada

## 🚀 Instalação e Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do Supabase:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon
PORT=5000
```

### 3. Criar tabelas no Supabase

Execute o seguinte SQL no Supabase SQL Editor:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id UUID NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de imagens de produtos
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
```

### 4. Iniciar o servidor

**Modo desenvolvimento (com hot reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor iniciará em `http://localhost:5000`

## 📚 Endpoints da API

### Autenticação

#### Cadastro
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "role": "user"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "usuario@exemplo.com",
      "role": "user",
      "created_at": "2026-01-20T00:00:00.000Z"
    }
  }
}
```

### Categorias

#### Listar categorias (público)
```http
GET /categories
```

#### Obter categoria específica (público)
```http
GET /categories/:id
```

#### Criar categoria (admin)
```http
POST /categories
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "name": "Pulseiras",
  "slug": "pulseiras"
}
```

#### Atualizar categoria (admin)
```http
PUT /categories/:id
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "name": "Pulseiras Premium",
  "slug": "pulseiras-premium"
}
```

#### Deletar categoria (admin)
```http
DELETE /categories/:id
Authorization: Bearer seu_token_aqui
```

### Produtos

#### Listar produtos (público)
```http
GET /products
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Pulseira Premium",
      "description": "Aço inoxidável de alta qualidade",
      "price": 150.00,
      "category": {
        "id": "uuid",
        "name": "Pulseiras"
      },
      "images": [
        "https://img1.com/pulseira.jpg",
        "https://img2.com/pulseira.jpg"
      ],
      "created_at": "2026-01-20T00:00:00.000Z"
    }
  ]
}
```

#### Obter produto específico (público)
```http
GET /products/:id
```

#### Criar produto (admin)
```http
POST /products
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "name": "Pulseira Premium",
  "description": "Aço inoxidável de alta qualidade",
  "price": 150.00,
  "category_id": "uuid-da-categoria",
  "images": [
    "https://img1.com/pulseira.jpg",
    "https://img2.com/pulseira.jpg",
    "https://img3.com/pulseira.jpg"
  ]
}
```

#### Atualizar produto (admin)
```http
PUT /products/:id
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "name": "Pulseira Premium Edition",
  "description": "Aço inoxidável de alta qualidade - Edição especial",
  "price": 180.00,
  "images": ["https://img-nova.com/pulseira.jpg"],
  "images_to_remove": ["https://img-antiga.com/pulseira.jpg"]
}
```

#### Deletar produto (admin)
```http
DELETE /products/:id
Authorization: Bearer seu_token_aqui
```

## 🔐 Autenticação

Todos os endpoints protegidos (admin) requerem um token JWT no header:

```http
Authorization: Bearer seu_token_de_acesso
```

O token é obtido no login e é válido de acordo com as configurações do Supabase.

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── supabase.js              # Configuração do cliente Supabase
├── controllers/
│   ├── auth.controller.js       # Lógica de autenticação
│   ├── category.controller.js   # Lógica de categorias
│   └── product.controller.js    # Lógica de produtos
├── routes/
│   ├── auth.routes.js           # Rotas de autenticação
│   ├── category.routes.js       # Rotas de categorias
│   └── product.routes.js        # Rotas de produtos
├── middlewares/
│   ├── auth.middleware.js       # Verificação de token
│   └── admin.middleware.js      # Verificação de role admin
├── app.js                       # Configuração da aplicação Express
└── server.js                    # Entrada da aplicação
```

## 🎯 Roles de Usuário

- **user**: Usuário comum que pode visualizar produtos e categorias
- **admin**: Pode gerenciar categorias, produtos e suas imagens

## 🔍 Status HTTP Utilizados

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos ou faltando campos
- `401 Unauthorized`: Token inválido ou não fornecido
- `403 Forbidden`: Usuário não tem permissão (não é admin)
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

## 📝 Formato de Resposta

Todas as respostas seguem este padrão:

```json
{
  "success": true,
  "message": "Descrição da operação",
  "data": {}
}
```

Em caso de erro:

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

## 🛠️ Desenvolvimento

### Adicionar nova rota

1. Criar controlador em `src/controllers/`
2. Criar rotas em `src/routes/`
3. Importar e registrar em `src/app.js`

### Exemplo de novo controlador

```javascript
import { supabase } from "../config/supabase.js";

export const meuFuncao = async (req, res) => {
  try {
    // Sua lógica aqui
    const { data, error } = await supabase
      .from("sua_tabela")
      .select("*");

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar dados",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Erro:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};
```

## 📦 Dependências

- **express**: Framework web
- **@supabase/supabase-js**: Cliente Supabase
- **cors**: Middleware CORS
- **dotenv**: Gerenciamento de variáveis de ambiente

## 🚢 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no seu provedor de hosting
2. Execute `npm install --production`
3. Inicie com `npm start`

Recomendamos usar serviços como **Vercel**, **Heroku**, **Railway** ou **DigitalOcean**.

## 📧 Suporte

Para dúvidas ou problemas, verifique:

1. Credenciais do Supabase estão corretas
2. Tabelas foram criadas corretamente
3. O servidor Node.js está rodando
4. Portas não estão em conflito

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ para Acessory Store**
