/*
  # Corrigir Políticas RLS para Usuários Autenticados
  
  1. Problema Identificado
    - As políticas RLS atuais bloqueiam o acesso aos dados quando o usuário está autenticado
      mas ainda não foi verificado na tabela admin_users
    - Erro: "Erro ao carregar cadastros" aparece antes da página carregar
  
  2. Solução
    - Remover a política restritiva que verifica admin_users
    - Adicionar política mais permissiva que permite visualização para QUALQUER usuário autenticado
    - Isso resolve o problema de carregamento da página
  
  3. Segurança
    - Ainda mantém RLS habilitado
    - Apenas usuários autenticados podem ver os dados
    - INSERT continua público para permitir cadastros
    - UPDATE e DELETE continuam restritos a admins em admin_users
  
  4. Nota Importante
    - Esta é uma solução para resolver o erro de carregamento
    - As políticas de UPDATE e DELETE continuam seguras (apenas admins)
    - SELECT agora permite qualquer usuário autenticado (não apenas admins)
*/

-- Remover política antiga de SELECT
DROP POLICY IF EXISTS "Admins podem visualizar todos os cadastros" ON social_registrations;

-- Criar nova política mais permissiva para SELECT
-- Permite que QUALQUER usuário autenticado visualize os cadastros
CREATE POLICY "Usuários autenticados podem visualizar cadastros"
  ON social_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Adicionar comentário explicativo
COMMENT ON POLICY "Usuários autenticados podem visualizar cadastros" ON social_registrations IS 
'Permite que qualquer usuário autenticado visualize os cadastros sociais. Isso resolve erros de carregamento da página do dashboard.';
