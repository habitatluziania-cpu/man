/*
  # Adicionar Usuário Admin Existente
  
  1. Objetivo
    - Adicionar o usuário autenticado existente (1@1.com) à tabela admin_users
    - Garantir que este usuário possa visualizar os registros sociais
  
  2. Alterações
    - Insere o usuário existente em auth.users na tabela admin_users
    - Define nome completo e email
  
  3. Segurança
    - Mantém todas as políticas RLS existentes
    - Apenas adiciona o usuário à lista de administradores autorizados
  
  4. Notas
    - Esta migração é idempotente (pode ser executada múltiplas vezes sem erro)
    - Se o usuário já existir na tabela, ele não será duplicado
*/

-- Adicionar usuário existente à tabela admin_users
INSERT INTO admin_users (id, email, full_name, profile_photo_url)
SELECT 
  id,
  email,
  'Administrador' as full_name,
  '/admin.png' as profile_photo_url
FROM auth.users
WHERE email = '1@1.com'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE admin_users.id = auth.users.id
);

-- Adicionar comentário explicativo
COMMENT ON TABLE admin_users IS 'Usuários administrativos do sistema. Para adicionar novos admins: 1) Criar usuário em auth.users, 2) Inserir registro correspondente nesta tabela.';
