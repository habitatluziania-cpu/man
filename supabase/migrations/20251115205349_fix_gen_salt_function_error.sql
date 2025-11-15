/*
  # Corrigir Erro da Função gen_salt
  
  1. Problema
    - A função gen_salt('bf', 10) está causando erro
    - O segundo parâmetro deve ser especificado de forma diferente para bcrypt
  
  2. Solução
    - Remover o segundo parâmetro de gen_salt
    - Usar apenas gen_salt('bf') que usa o padrão (cost factor 8)
    - Ou ajustar para o formato correto se necessário
  
  3. Funções Afetadas
    - hash_password (trigger para UPDATE)
    - hash_password_insert (trigger para INSERT)
*/

-- ============================================================================
-- RECRIAR FUNÇÕES COM gen_salt CORRETO
-- ============================================================================

-- Função: hash_password_insert (para INSERT)
CREATE OR REPLACE FUNCTION hash_password_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas fazer hash se a senha não parece já estar hasheada
  IF NEW.password IS NOT NULL AND NOT (NEW.password ~ '^\$2[aby]\$') THEN
    NEW.password = crypt(NEW.password, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = pg_catalog, public;

-- Função: hash_password (para UPDATE)
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas fazer hash se a senha foi modificada e não parece já estar hasheada
  -- Senhas bcrypt sempre começam com $2a$, $2b$ ou $2y$
  IF NEW.password IS NOT NULL AND NEW.password != OLD.password AND NOT (NEW.password ~ '^\$2[aby]\$') THEN
    NEW.password = crypt(NEW.password, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = pg_catalog, public;

-- ============================================================================
-- VERIFICAR E RECRIAR TRIGGERS SE NECESSÁRIO
-- ============================================================================

-- Remover triggers existentes se houver
DROP TRIGGER IF EXISTS hash_admin_password_before_insert ON admin_users;
DROP TRIGGER IF EXISTS hash_admin_password_before_update ON admin_users;
DROP TRIGGER IF EXISTS hash_social_password_before_insert ON social_registrations;
DROP TRIGGER IF EXISTS hash_social_password_before_update ON social_registrations;

-- Recriar triggers para admin_users
CREATE TRIGGER hash_admin_password_before_insert
  BEFORE INSERT ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION hash_password_insert();

CREATE TRIGGER hash_admin_password_before_update
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION hash_password();

-- Recriar triggers para social_registrations
CREATE TRIGGER hash_social_password_before_insert
  BEFORE INSERT ON social_registrations
  FOR EACH ROW
  EXECUTE FUNCTION hash_password_insert();

CREATE TRIGGER hash_social_password_before_update
  BEFORE UPDATE ON social_registrations
  FOR EACH ROW
  EXECUTE FUNCTION hash_password();

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON FUNCTION hash_password_insert() IS 
'Faz hash automático da senha usando bcrypt antes de inserir no banco. Usa gen_salt(''bf'') com cost factor padrão (8).';

COMMENT ON FUNCTION hash_password() IS 
'Faz hash automático da senha usando bcrypt antes de atualizar no banco. Usa gen_salt(''bf'') com cost factor padrão (8).';
