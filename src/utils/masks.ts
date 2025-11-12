export const masks = {
  cpf: (value: string): string => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  phone: (value: string): string => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      .replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  },

  cep: (value: string): string => {
    return value
      .replace(/\D/g, '')
      .slice(0, 8)
      .replace(/(\d{5})(\d{3})/, '$1-$2');
  },

  rg: (value: string): string => {
    return value.slice(0, 20);
  },

  nisPis: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 11);
  },

  voterRegistration: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 12);
  },
};

export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};
