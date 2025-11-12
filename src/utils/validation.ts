/**
 * UTILITÁRIO DE VALIDAÇÃO
 *
 * Funções para validar campos de formulário seguindo
 * as regras de negócio e padrões brasileiros.
 */

/**
 * Conjunto de funções de validação
 */
export const validation = {
  /**
   * Valida um CPF usando o algoritmo oficial da Receita Federal
   * @param cpf - CPF a ser validado (com ou sem máscara)
   * @returns true se o CPF for válido, false caso contrário
   */
  cpf: (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (caso inválido comum)
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    let remainder;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
  },

  /**
   * Valida um número de telefone brasileiro
   * @param phone - Telefone a ser validado (com ou sem máscara)
   * @returns true se tiver 10 ou 11 dígitos, false caso contrário
   */
  phone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },

  /**
   * Valida um CEP brasileiro
   * @param cep - CEP a ser validado (com ou sem máscara)
   * @returns true se tiver 8 dígitos, false caso contrário
   */
  cep: (cep: string): boolean => {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
  },

  /**
   * Valida um nome (mínimo 3 caracteres)
   * @param name - Nome a ser validado
   * @returns true se tiver pelo menos 3 caracteres, false caso contrário
   */
  name: (name: string): boolean => {
    return name.trim().length >= 3;
  },

  /**
   * Valida se um campo obrigatório foi preenchido
   * @param value - Valor a ser validado
   * @returns true se o campo estiver preenchido, false caso contrário
   */
  requiredField: (value: string | number | boolean): boolean => {
    if (typeof value === 'boolean') return true;
    if (typeof value === 'number') return value >= 0;
    return value.toString().trim().length > 0;
  },
};

/**
 * Retorna uma mensagem de erro apropriada para um campo específico
 * @param field - Nome do campo a ser validado
 * @param value - Valor do campo
 * @returns Mensagem de erro ou null se o campo for válido
 */
export const getValidationError = (field: string, value: string): string | null => {
  switch (field) {
    case 'cpf':
      if (!value) return 'CPF é obrigatório';
      if (!validation.cpf(value)) return 'CPF inválido';
      return null;

    case 'phone':
      if (!value) return 'Telefone é obrigatório';
      if (!validation.phone(value)) return 'Telefone deve ter 10 ou 11 dígitos';
      return null;

    case 'cep':
      if (!value) return 'CEP é obrigatório';
      if (!validation.cep(value)) return 'CEP inválido';
      return null;

    case 'name':
      if (!value) return 'Nome é obrigatório';
      if (!validation.name(value)) return 'Nome deve ter pelo menos 3 caracteres';
      return null;

    case 'address':
      if (!value) return 'Endereço é obrigatório';
      return null;

    default:
      return null;
  }
};
