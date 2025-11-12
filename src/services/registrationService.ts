/**
 * SERVIÇO DE REGISTROS
 *
 * Centraliza todas as operações relacionadas a registros sociais,
 * incluindo criação, leitura, atualização e exclusão (CRUD).
 */

import { supabase } from '../lib/supabase';
import { Registration, FormData } from '../types';
import { unmask } from '../utils/masks';

/**
 * Busca todos os registros ordenados por data de criação
 * @returns Promise com array de registros ou null em caso de erro
 */
export const fetchAllRegistrations = async (): Promise<Registration[] | null> => {
  try {
    const { data, error } = await supabase
      .from('social_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    return null;
  }
};

/**
 * Cria um novo registro no sistema
 * @param formData - Dados do formulário preenchido
 * @returns Promise com sucesso (true) ou erro (false)
 */
export const createRegistration = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.from('social_registrations').insert({
      full_name: formData.fullName,
      cpf: unmask(formData.cpf),
      nis_pis: unmask(formData.nisPis),
      voter_registration: formData.voterRegistration ? unmask(formData.voterRegistration) : null,
      password: formData.password,
      personal_phone: unmask(formData.personalPhone),
      reference_phone_1: unmask(formData.referencePhone1),
      reference_phone_2: formData.referencePhone2 ? unmask(formData.referencePhone2) : null,
      reference_phone_3: formData.referencePhone3 ? unmask(formData.referencePhone3) : null,
      adults_count: formData.adultsCount,
      minors_count: formData.minorsCount,
      has_disability: formData.hasDisability ?? false,
      disability_count: formData.hasDisability ? formData.disabilityCount : null,
      address: formData.address,
      neighborhood: formData.neighborhood,
      cep: unmask(formData.cep),
      female_head_of_household: formData.femaleHeadOfHousehold ?? false,
      has_elderly: formData.hasElderly ?? false,
      vulnerable_situation: formData.vulnerableSituation ?? false,
      homeless: formData.homeless ?? false,
      domestic_violence_victim: formData.domesticViolenceVictim ?? false,
      cohabitation: formData.cohabitation ?? false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    return { success: false, error: 'Erro ao criar registro' };
  }
};

/**
 * Atualiza um registro existente
 * @param id - ID do registro a ser atualizado
 * @param data - Dados atualizados do registro
 * @returns Promise com sucesso (true) ou erro (false)
 */
export const updateRegistration = async (
  id: string,
  data: Partial<Registration>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('social_registrations')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    return { success: false, error: 'Erro ao atualizar registro' };
  }
};

/**
 * Exclui um registro do sistema
 * @param id - ID do registro a ser excluído
 * @returns Promise com sucesso (true) ou erro (false)
 */
export const deleteRegistration = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('social_registrations')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir registro:', error);
    return { success: false, error: 'Erro ao excluir registro' };
  }
};

/**
 * Busca um registro por CPF
 * @param cpf - CPF do usuário (sem máscara)
 * @returns Promise com registro encontrado ou null
 */
export const findRegistrationByCPF = async (cpf: string): Promise<Registration | null> => {
  try {
    const { data, error } = await supabase
      .from('social_registrations')
      .select('*')
      .eq('cpf', cpf)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar registro por CPF:', error);
    return null;
  }
};

/**
 * Verifica a senha de um registro
 * @param inputPassword - Senha digitada pelo usuário
 * @param storedPassword - Senha armazenada no banco
 * @returns Promise com resultado da verificação (true/false)
 */
export const verifyPassword = async (
  inputPassword: string,
  storedPassword: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_password', {
      input_password: inputPassword,
      stored_password: storedPassword,
    });

    if (error) throw error;
    return data ?? false;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
};
