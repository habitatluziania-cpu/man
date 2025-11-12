/*
  # Criar Schema Completo do Sistema Habitat Social

  1. Novas Tabelas
    - `social_registrations` - Cadastros de pré-inscrição social
      - Dados pessoais: nome completo, CPF, RG, NIS/PIS, título eleitoral, senha
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
    - Permitir visualização pública (para admin poder ver)
    - Restringir atualizações e exclusões apenas para admins autenticados

    Para `admin_users`:
    - Apenas admins autenticados podem visualizar outros admins
    - Admins podem atualizar apenas seu próprio perfil
    - Inserções são restritas (apenas através de scripts)

  3. Índices
    - CPF único em social_registrations
    - Email único em admin_users
    - Índices para queries de busca por data

  4. Constraints
    - Validações de quantidade: adultos >= 1, menores >= 0
    - CPF único para evitar duplicatas
    - Campos obrigatórios com NOT NULL
*/

-- 1. Criar tabela de cadastros sociais
CREATE TABLE IF NOT EXISTS social_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text NOT NULL UNIQUE,
  rg text NOT NULL,
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

-- 2. Criar tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  profile_photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_social_registrations_cpf ON social_registrations(cpf);
CREATE INDEX IF NOT EXISTS idx_social_registrations_created_at ON social_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 4. Habilitar RLS em ambas as tabelas
ALTER TABLE social_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para social_registrations

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

-- 6. Políticas RLS para admin_users

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

-- 7. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers para atualizar updated_at
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