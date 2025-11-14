/*
  # Corrigir Problemas de Segurança e Performance
  
  1. Otimizações de Performance
    - Substituir auth.uid() por (select auth.uid()) nas políticas RLS
    - Isso evita re-avaliação da função para cada linha, melhorando performance
  
  2. Segurança de Funções
    - Adicionar SET search_path = pg_catalog, public em todas as funções
    - Previne ataques de injeção através de search_path mutable
  
  3. Índices
    - Manter índices CPF e email (são úteis para queries de autenticação e busca)
    - CPF é usado em login de usuários
    - Email é usado em login de admins
  
  4. Políticas RLS Atualizadas
    - social_registrations: UPDATE e DELETE
    - admin_users: SELECT e UPDATE
  
  5. Nota sobre Password Protection
    - A proteção contra senhas comprometidas (HaveIBeenPwned) deve ser habilitada
      manualmente no painel do Supabase em: Authentication > Settings > Security
    - Não pode ser habilitada via SQL migration
*/

-- ============================================================================
-- 1. OTIMIZAR POLÍTICAS RLS - SOCIAL_REGISTRATIONS
-- ============================================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem atualizar cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem excluir cadastros" ON social_registrations;

-- Recriar políticas otimizadas com (select auth.uid())
CREATE POLICY "Admins podem atualizar cadastros"
  ON social_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins podem excluir cadastros"
  ON social_registrations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ============================================================================
-- 2. OTIMIZAR POLÍTICAS RLS - ADMIN_USERS
-- ============================================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Admins podem visualizar outros admins" ON admin_users;
DROP POLICY IF EXISTS "Admins podem atualizar próprio perfil" ON admin_users;

-- Recriar políticas otimizadas
CREATE POLICY "Admins podem visualizar outros admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins podem atualizar próprio perfil"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ============================================================================
-- 3. ADICIONAR SEARCH_PATH SEGURO NAS FUNÇÕES
-- ============================================================================

-- Função: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
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
    NEW.password = crypt(NEW.password, gen_salt('bf', 10));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = pg_catalog, public;

-- Função: hash_password_insert (para INSERT)
CREATE OR REPLACE FUNCTION hash_password_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Apenas fazer hash se a senha não parece já estar hasheada
  IF NEW.password IS NOT NULL AND NOT (NEW.password ~ '^\$2[aby]\$') THEN
    NEW.password = crypt(NEW.password, gen_salt('bf', 10));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = pg_catalog, public;

-- Função: verify_password
CREATE OR REPLACE FUNCTION verify_password(input_password text, stored_password text)
RETURNS boolean AS $$
BEGIN
  RETURN stored_password = crypt(input_password, stored_password);
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = pg_catalog, public;

-- ============================================================================
-- 4. COMENTÁRIOS EXPLICATIVOS
-- ============================================================================

COMMENT ON POLICY "Admins podem atualizar cadastros" ON social_registrations IS 
'Permite que admins autenticados atualizem cadastros. Usa (select auth.uid()) para melhor performance.';

COMMENT ON POLICY "Admins podem excluir cadastros" ON social_registrations IS 
'Permite que admins autenticados excluam cadastros. Usa (select auth.uid()) para melhor performance.';

COMMENT ON POLICY "Admins podem visualizar outros admins" ON admin_users IS 
'Permite que admins visualizem outros admins. Usa (select auth.uid()) para melhor performance.';

COMMENT ON POLICY "Admins podem atualizar próprio perfil" ON admin_users IS 
'Permite que admins atualizem apenas seu próprio perfil. Usa (select auth.uid()) para melhor performance.';

-- ============================================================================
-- 5. NOTA IMPORTANTE SOBRE PROTEÇÃO DE SENHAS
-- ============================================================================

/*
  AÇÃO MANUAL NECESSÁRIA:
  
  Para habilitar a proteção contra senhas comprometidas (HaveIBeenPwned):
  
  1. Acesse o painel do Supabase: https://supabase.com/dashboard
  2. Navegue até: Authentication > Settings > Security
  3. Ative: "Enable leaked password protection"
  
  Esta configuração não pode ser aplicada via SQL migration e deve ser
  configurada manualmente no dashboard do Supabase.
*/
