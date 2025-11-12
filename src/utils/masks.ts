/**
 * UTILITÁRIO DE MÁSCARAS
 *
 * Funções para aplicar e remover máscaras de formatação
 * em campos de entrada como CPF, telefone, CEP, etc.
 */

/**
 * Conjunto de funções para aplicar máscaras de formatação
 */
export const masks = {
  /**
   * Aplica máscara de CPF (000.000.000-00)
   * @param value - Valor a ser mascarado
   * @returns String formatada como CPF
   */
  cpf: (value: string): string => {
    return value
      .replace(/\D/g, '') // Remove todos os não-dígitos
      .slice(0, 11) // Limita a 11 dígitos
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Aplica formatação
  },

  /**
   * Aplica máscara de telefone ((00) 00000-0000 ou (00) 0000-0000)
   * @param value - Valor a ser mascarado
   * @returns String formatada como telefone
   */
  phone: (value: string): string => {
    return value
      .replace(/\D/g, '') // Remove todos os não-dígitos
      .slice(0, 11) // Limita a 11 dígitos
      .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') // Formato com 9 dígitos
      .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'); // Formato com 8 dígitos
  },

  /**
   * Aplica máscara de CEP (00000-000)
   * @param value - Valor a ser mascarado
   * @returns String formatada como CEP
   */
  cep: (value: string): string => {
    return value
      .replace(/\D/g, '') // Remove todos os não-dígitos
      .slice(0, 8) // Limita a 8 dígitos
      .replace(/(\d{5})(\d{3})/, '$1-$2'); // Aplica formatação
  },

  /**
   * Limita o tamanho do RG a 20 caracteres
   * @param value - Valor a ser limitado
   * @returns String com no máximo 20 caracteres
   */
  rg: (value: string): string => {
    return value.slice(0, 20);
  },

  /**
   * Aplica formatação de NIS/PIS (somente números, 11 dígitos)
   * @param value - Valor a ser mascarado
   * @returns String com apenas números, limitada a 11 dígitos
   */
  nisPis: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 11);
  },

  /**
   * Aplica formatação de Título Eleitoral (somente números, 12 dígitos)
   * @param value - Valor a ser mascarado
   * @returns String com apenas números, limitada a 12 dígitos
   */
  voterRegistration: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 12);
  },
};

/**
 * Remove toda a formatação de um valor, deixando apenas números
 * @param value - Valor a ter a máscara removida
 * @returns String contendo apenas dígitos numéricos
 */
export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};
