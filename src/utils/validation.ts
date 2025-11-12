export const validation = {
  cpf: (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
  },

  phone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },

  cep: (cep: string): boolean => {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
  },

  name: (name: string): boolean => {
    return name.trim().length >= 3;
  },

  requiredField: (value: string | number | boolean): boolean => {
    if (typeof value === 'boolean') return true;
    if (typeof value === 'number') return value >= 0;
    return value.toString().trim().length > 0;
  },
};

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
