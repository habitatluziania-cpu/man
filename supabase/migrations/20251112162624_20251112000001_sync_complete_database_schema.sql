/*
  # Sincronizar e Atualizar Schema Completo do Banco de Dados
  
  1. Tabelas Principais
    - `social_registrations` - Cadastros de pré-inscrição social
      - Dados pessoais: nome completo, CPF, NIS/PIS, título eleitoral, senha
      - Contatos: telefone pessoal, telefones de referência (3)
      - Composição familiar: adultos, menores, pessoas com deficiência
      - Endereço: endereço completo, bairro, CEP
      - Perfil socioeconômico: chefe de família mulher, idosos, vulnerabilidade, etc.
      - Timestamps: created_at, updated_at
    
    - `admin_users` - Usuários administrativos do sistema
      - Autenticação: email, senha (através do auth.users)
      - Dados: nome completo, URL da foto de perfil
      - Timestamps: created_at, updated_at

  2. Segurança (RLS Policies)
    
    Para `social_registrations`:
    - Permitir inserções públicas (qualquer pessoa pode se cadastrar)
    - Permitir visualização apenas para admins autenticados
    - Restringir atualizações e exclusões apenas para admins autenticados

    Para `admin_users`:
    - Apenas admins autenticados podem visualizar outros admins
    - Admins podem atualizar apenas seu próprio perfil

  3. Recursos de Segurança
    - Extensão pgcrypto para hash de senhas com bcrypt
    - Funções automáticas para criptografar senhas
    - Funções para verificar senhas

  4. Índices para Performance
    - CPF único em social_registrations
    - Email único em admin_users
    - Índices para queries por data

  5. Triggers Automáticos
    - Atualização automática de updated_at
    - Hash automático de senhas em INSERT e UPDATE
*/

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Criar tabela de cadastros sociais
CREATE TABLE IF NOT EXISTS social_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text NOT NULL UNIQUE,
  nis_pis text NOT NULL,
  voter_registration text,
  password text NOT NULL,
  personal_phone text NOT NULL,
  reference_phone_1 text NOT NULL,
  reference_phone_2 text,
  reference_phone_3 text,
  adults_count integer NOT NULL DEFAULT 1 CHECK (adults_count >= 1),
  minors_count integer NOT NULL DEFAULT 0 CHECK (minors_count >= 0),
  has_disability boolean NOT NULL DEFAULT false,
  disability_count integer DEFAULT 0,
  address text NOT NULL,
  neighborhood text NOT NULL,
  cep text NOT NULL,
  female_head_of_household boolean NOT NULL DEFAULT false,
  has_elderly boolean NOT NULL DEFAULT false,
  vulnerable_situation boolean NOT NULL DEFAULT false,
  homeless boolean NOT NULL DEFAULT false,
  domestic_violence_victim boolean NOT NULL DEFAULT false,
  cohabitation boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Criar tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  profile_photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_social_registrations_cpf ON social_registrations(cpf);
CREATE INDEX IF NOT EXISTS idx_social_registrations_created_at ON social_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 5. Habilitar RLS em ambas as tabelas
ALTER TABLE social_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 6. Remover políticas antigas se existirem (para evitar duplicatas)
DROP POLICY IF EXISTS "Permitir inserções públicas" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem visualizar todos os cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem atualizar cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem excluir cadastros" ON social_registrations;
DROP POLICY IF EXISTS "Admins podem visualizar outros admins" ON admin_users;
DROP POLICY IF EXISTS "Admins podem atualizar próprio perfil" ON admin_users;

-- 7. Políticas RLS para social_registrations

-- Permitir que qualquer pessoa insira novos cadastros
CREATE POLICY "Permitir inserções públicas"
  ON social_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Permitir que admins autenticados visualizem todos os cadastros
CREATE POLICY "Admins podem visualizar todos os cadastros"
  ON social_registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Permitir que admins autenticados atualizem cadastros
CREATE POLICY "Admins podem atualizar cadastros"
  ON social_registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Permitir que admins autenticados excluam cadastros
CREATE POLICY "Admins podem excluir cadastros"
  ON social_registrations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- 8. Políticas RLS para admin_users

-- Admins autenticados podem visualizar todos os outros admins
CREATE POLICY "Admins podem visualizar outros admins"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins podem atualizar apenas seu próprio perfil
CREATE POLICY "Admins podem atualizar próprio perfil"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 9. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_social_registrations_updated_at ON social_registrations;
CREATE TRIGGER update_social_registrations_updated_at
  BEFORE UPDATE ON social_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. Função para fazer hash de senha em UPDATE
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

-- 12. Função para fazer hash de senha em INSERT
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

-- 13. Função para verificar senha
CREATE OR REPLACE FUNCTION verify_password(input_password text, stored_password text)
RETURNS boolean AS $$
BEGIN
  RETURN stored_password = crypt(input_password, stored_password);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Triggers para hash automático de senhas
DROP TRIGGER IF EXISTS trigger_hash_password_update ON social_registrations;
DROP TRIGGER IF EXISTS trigger_hash_password_insert ON social_registrations;

CREATE TRIGGER trigger_hash_password_update
  BEFORE UPDATE ON social_registrations
  FOR EACH ROW
  WHEN (NEW.password IS DISTINCT FROM OLD.password)
  EXECUTE FUNCTION hash_password();

CREATE TRIGGER trigger_hash_password_insert
  BEFORE INSERT ON social_registrations
  FOR EACH ROW
  EXECUTE FUNCTION hash_password_insert();

-- 15. Adicionar comentários explicativos
COMMENT ON TABLE social_registrations IS 'Cadastros de pré-inscrição para programa social Habitat. Contém dados pessoais, familiares e socioeconômicos dos beneficiários.';
COMMENT ON COLUMN social_registrations.password IS 'Senha hasheada com bcrypt. Para atualizar, basta inserir senha em texto plano que será automaticamente criptografada.';
COMMENT ON TABLE admin_users IS 'Usuários administrativos do sistema. Vinculados à tabela auth.users do Supabase.';
COMMENT ON COLUMN admin_users.profile_photo_url IS 'URL da foto de perfil do administrador. Pode ser null.';
