/**
 * SERVIÇO DE AUTENTICAÇÃO
 *
 * Gerencia todas as operações relacionadas à autenticação
 * de administradores no sistema.
 */

import { supabase } from '../lib/supabase';

/**
 * Realiza login de administrador
 * @param email - Email do administrador
 * @param password - Senha do administrador
 * @returns Promise com sucesso (true) ou erro (false) e mensagem
 */
export const adminLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Autentica o usuário com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Verifica se o usuário é um administrador
    if (authData.user) {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!adminData) {
        await supabase.auth.signOut();
        return { success: false, error: 'Usuário não autorizado como administrador' };
      }

      return { success: true };
    }

    return { success: false, error: 'Erro ao fazer login' };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { success: false, error: error.message || 'Erro ao fazer login' };
  }
};

/**
 * Realiza logout do administrador
 * @returns Promise com sucesso ou erro
 */
export const adminLogout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

/**
 * Verifica se há uma sessão ativa
 * @returns Promise com boolean indicando se está autenticado
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

/**
 * Obtém informações do usuário administrador logado
 * @returns Promise com dados do admin ou null
 */
export const getCurrentAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: adminData, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return adminData;
  } catch (error) {
    console.error('Erro ao obter dados do admin:', error);
    return null;
  }
};
