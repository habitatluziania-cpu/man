/*
  # Remover campo RG e adicionar funções de hash para senhas
  
  1. Alterações na tabela social_registrations
    - Remove a coluna `rg` (não mais necessária)
    - Mantém a coluna `password` para armazenar senhas hasheadas
  
  2. Funções de segurança para senhas
    - `hash_password()` - Função para fazer hash de senhas usando crypt do pgcrypto
    - `verify_password()` - Função para verificar senhas
    - Trigger automático para fazer hash de senhas quando inseridas/atualizadas
  
  3. Benefícios
    - Senhas são automaticamente criptografadas com bcrypt
    - Administradores podem atualizar senhas facilmente pelo Supabase
    - Basta inserir a senha em texto simples que ela será hasheada automaticamente
    - As senhas são armazenadas de forma segura no banco
  
  4. Como usar no Supabase Dashboard
    - Para atualizar senha de um beneficiário:
      UPDATE social_registrations 
      SET password = 'nova_senha_aqui' 
      WHERE cpf = '12345678900';
    
    - Para atualizar senha de um admin, use o painel de autenticação do Supabase
*/

-- 1. Habilitar extensão pgcrypto se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Remover a coluna RG da tabela social_registrations
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'social_registrations' AND column_name = 'rg'
  ) THEN
    ALTER TABLE social_registrations DROP COLUMN rg;
  END IF;
END $$;

-- 3. Criar função para fazer hash de senha
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas fazer hash se a senha foi modificada e não parece já estar hasheada
  -- Senhas bcrypt sempre começam com $2a$, $2b$ ou $2y$
  IF NEW.password IS NOT NULL AND NEW.password != OLD.password AND NOT (NEW.password ~ '^\$2[aby]\$') THEN
    NEW.password = crypt(NEW.password, gen_salt('bf', 10));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar função para fazer hash de senha em INSERT
CREATE OR REPLACE FUNCTION hash_password_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas fazer hash se a senha não parece já estar hasheada
  IF NEW.password IS NOT NULL AND NOT (NEW.password ~ '^\$2[aby]\$') THEN
    NEW.password = crypt(NEW.password, gen_salt('bf', 10));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar função para verificar senha
CREATE OR REPLACE FUNCTION verify_password(input_password text, stored_password text)
RETURNS boolean AS $$
BEGIN
  RETURN stored_password = crypt(input_password, stored_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Remover triggers existentes se existirem
DROP TRIGGER IF EXISTS trigger_hash_password_update ON social_registrations;
DROP TRIGGER IF EXISTS trigger_hash_password_insert ON social_registrations;

-- 7. Criar trigger para hash automático em UPDATE
CREATE TRIGGER trigger_hash_password_update
  BEFORE UPDATE ON social_registrations
  FOR EACH ROW
  WHEN (NEW.password IS DISTINCT FROM OLD.password)
  EXECUTE FUNCTION hash_password();

-- 8. Criar trigger para hash automático em INSERT
CREATE TRIGGER trigger_hash_password_insert
  BEFORE INSERT ON social_registrations
  FOR EACH ROW
  EXECUTE FUNCTION hash_password_insert();

-- 9. Fazer hash das senhas existentes que ainda estão em texto plano
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN 
    SELECT id, password 
    FROM social_registrations 
    WHERE password IS NOT NULL AND NOT (password ~ '^\$2[aby]\$')
  LOOP
    UPDATE social_registrations 
    SET password = crypt(rec.password, gen_salt('bf', 10))
    WHERE id = rec.id;
  END LOOP;
END $$;

-- 10. Adicionar comentário explicativo na tabela
COMMENT ON COLUMN social_registrations.password IS 'Senha hasheada com bcrypt. Para atualizar, basta inserir senha em texto plano que será automaticamente criptografada.';
