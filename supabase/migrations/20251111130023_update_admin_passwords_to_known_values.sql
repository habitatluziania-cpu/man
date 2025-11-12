/*
  # Atualizar Senhas dos Administradores Existentes
  
  1. Objetivo
    - Redefinir as senhas de todos os 5 administradores para uma senha conhecida
    - Facilitar o acesso ao painel administrativo
  
  2. Senhas atualizadas
    - admin1@habitat.com - Senha: Admin123!
    - admin2@habitat.com - Senha: Admin123!
    - admin3@habitat.com - Senha: Admin123!
    - admin4@habitat.com - Senha: Admin123!
    - admin5@habitat.com - Senha: Admin123!
  
  3. Como usar
    - Faça login com qualquer email acima usando a senha: Admin123!
    - A senha deve ser alterada após o primeiro acesso por segurança
  
  4. Segurança
    - As senhas são hasheadas com bcrypt pelo Supabase
    - Recomenda-se alterar para senhas mais seguras após o acesso inicial
*/

-- Atualizar senha de todos os administradores
DO $$
DECLARE
  admin_email text;
  new_password text := 'Admin123!';
  encrypted_pw text;
BEGIN
  -- Criptografar a nova senha
  encrypted_pw := crypt(new_password, gen_salt('bf'));
  
  -- Atualizar senha para todos os usuários admin
  FOR admin_email IN 
    SELECT email FROM admin_users
  LOOP
    UPDATE auth.users
    SET 
      encrypted_password = encrypted_pw,
      updated_at = NOW()
    WHERE email = admin_email;
    
    RAISE NOTICE 'Senha atualizada para: %', admin_email;
  END LOOP;
END $$;

-- Adicionar comentário na tabela
COMMENT ON TABLE admin_users IS 'Usuários administrativos - Emails: admin1@habitat.com até admin5@habitat.com | Senha atual de todos: Admin123!';
