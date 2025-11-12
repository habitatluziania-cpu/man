/**
 * CONFIGURAÇÃO DO SUPABASE
 *
 * Este arquivo inicializa e exporta o cliente Supabase
 * para ser usado em toda a aplicação.
 */

import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente necessárias
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Valida se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
