# 🔧 Guia de Configuração do Supabase

## Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Projeto Supabase criado

## 1️⃣ Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - **Project name**: `acessory-store` (ou o nome que desejar)
   - **Database password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

## 2️⃣ Obter Credenciais

Após criar o projeto:

1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL**: Será usado como `SUPABASE_URL`
   - **anon public**: Será usado como `SUPABASE_KEY`
3. Salve em um arquivo seguro

## 3️⃣ Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e atualize:
   ```env
   SUPABASE_URL=https://seu-projeto-id.supabase.co
   SUPABASE_KEY=sua-chave-anon-publica
   PORT=5000
   ```

3. **NÃO commite o arquivo `.env`** (já está no `.gitignore`)

## 4️⃣ Criar Tabelas no Supabase

### Opção A: Usar SQL Editor (Recomendado)

1. No Supabase, acesse **SQL Editor**
2. Clique em **New Query**
3. Cole o seguinte SQL:

```sql
-- ============================================
-- TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA DE PRODUTOS
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA DE IMAGENS DE PRODUTOS
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Políticas para Users (apenas auth)
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can only update themselves" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para Categories (públicas)
CREATE POLICY "Everyone can view categories" ON categories
  FOR SELECT USING (true);

-- Políticas para Products (públicas)
CREATE POLICY "Everyone can view products" ON products
  FOR SELECT USING (true);

-- Políticas para Product Images (públicas)
CREATE POLICY "Everyone can view product images" ON product_images
  FOR SELECT USING (true);
```

4. Clique em **Run**
5. Verifique se todas as tabelas foram criadas em **Table Editor**

## 5️⃣ Configurar Autenticação (Auth)

### Email/Password Auth

1. No Supabase, acesse **Authentication** → **Providers**
2. Encontre "Email" e verifique se está **Enable**
3. Na aba **User**, você poderá ver os usuários que se registram

### (Opcional) Configurar Confirmação de Email

1. Acesse **Authentication** → **Email Templates**
2. Configure o template de confirmação (útil para produção)

## 6️⃣ Testar Conexão

1. No seu projeto Node.js, execute:
   ```bash
   npm run dev
   ```

2. Teste o endpoint de saúde:
   ```bash
   curl http://localhost:5000/
   ```

3. Se receber uma resposta JSON, a conexão está funcionando!

## 7️⃣ Entender Credenciais

### SUPABASE_URL
- URL base do seu projeto
- Exemplo: `https://abcdefg12345.supabase.co`
- Usada para todas as requisições à API

### SUPABASE_KEY (anon public)
- Chave pública para requisições do cliente
- **NÃO é segredo**, pode estar no código frontend
- Respeita as políticas de RLS (Row Level Security)
- Nunca use a chave `service_role` no frontend!

### service_role (Não use!)
- Chave privada que ignora RLS
- Use apenas no backend e guarde com segurança
- No nosso caso, usaremos apenas a chave `anon`

## 8️⃣ Próximos Passos

1. Inicie o servidor: `npm run dev`
2. Registre um usuário como admin
3. Use os exemplos em `EXAMPLES.http` para testar
4. Integre com seu frontend

## 🆘 Troubleshooting

### Erro: "SUPABASE_URL not found"
- Verifique se o arquivo `.env` existe
- Confirme que copiou as credenciais corretamente
- Reinicie o servidor após alterar `.env`

### Erro: "Relation does not exist"
- Verifique se as tabelas foram criadas
- Execute o SQL novamente no SQL Editor
- Aguarde alguns segundos após criar as tabelas

### Erro: "No API key found"
- Revise as credenciais no `.env`
- Acesse **Settings** → **API** para confirmar

### Erro: "Row Level Security"
- Se usar RLS, configure as policies corretamente
- Por enquanto, teste sem RLS para validar a aplicação

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Basics](https://supabase.com/docs/guides/database)

---

**Backend pronto para usar!** 🚀
