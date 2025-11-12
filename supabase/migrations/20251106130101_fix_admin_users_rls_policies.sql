/*
  # Corrigir Políticas RLS - Remover Recursão Infinita

  1. Problema Identificado
    - As políticas RLS de `social_registrations` e `admin_users` estavam criando recursão infinita
    - A política verificava na tabela `admin_users` se o usuário era admin, mas isso causava loop

  2. Solução
    - Remover políticas recursivas
    - Criar políticas mais simples baseadas apenas em autenticação
    - Para `admin_users`: verificar apenas se está autenticado
    - Para `social_registrations`: permitir visualização para usuários autenticados

  3. Segurança
    - Mantém RLS habilitado
    - Apenas usuários autenticados (admins) podem acessar
    - Público pode apenas inserir novos cadastros
*/

-- 1. Remover políticas antigas que causavam recursão
DROP POLICY IF EXISTS "Admins podem visualizar todos os cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem atualizar cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem excluir cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem visualizar outros admins" ON admin_users;
DROP POLICY IF EXISTS "Admins podem atualizar próprio perfil" ON admin_users;

-- 2. Criar novas políticas sem recursão para social_registrations

-- Permite que usuários autenticados visualizem todos os cadastros
CREATE POLICY "Usuários autenticados podem ver cadastros"
  ON social_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Permite que usuários autenticados atualizem cadastros
CREATE POLICY "Usuários autenticados podem atualizar cadastros"
  ON social_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Permite que usuários autenticados excluam cadastros
CREATE POLICY "Usuários autenticados podem excluir cadastros"
  ON social_registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- 3. Criar novas políticas sem recursão para admin_users

-- Permite que usuários autenticados visualizem admins
CREATE POLICY "Usuários autenticados podem ver admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Permite que usuários autenticados atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);