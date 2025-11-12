/**
 * SERVIÇO DE ESTATÍSTICAS
 *
 * Responsável por calcular e gerenciar todas as estatísticas
 * exibidas no dashboard administrativo.
 */

import { Registration, DashboardStats, DailyData } from '../types';

/**
 * Calcula estatísticas gerais dos registros
 * @param registrations - Array de todos os registros
 * @returns Objeto com estatísticas calculadas
 */
export const calculateStats = (registrations: Registration[]): DashboardStats => {
  const homeless = registrations.filter((r) => r.homeless).length;
  const violence = registrations.filter((r) => r.domestic_violence_victim).length;
  const disability = registrations.filter((r) => r.has_disability).length;

  // Calcula o total de telefones (pessoal + referências)
  const totalPhones = registrations.reduce((acc, reg) => {
    let count = 1; // Telefone pessoal
    if (reg.reference_phone_1) count++;
    if (reg.reference_phone_2) count++;
    if (reg.reference_phone_3) count++;
    return acc + count;
  }, 0);

  return {
    total: registrations.length,
    homeless,
    violence,
    disability,
    totalPhones,
  };
};

/**
 * Calcula dados para o gráfico de registros diários
 * @param registrations - Array de todos os registros
 * @returns Array com dados diários dos últimos 30 dias
 */
export const calculateDailyData = (registrations: Registration[]): DailyData[] => {
  const dailyMap = new Map<string, number>();

  // Agrupa registros por data
  registrations.forEach((reg) => {
    const date = new Date(reg.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  });

  // Converte o Map em array e ordena por data
  const sortedData = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split('/');
      const [dayB, monthB] = b.date.split('/');
      const dateA = new Date(2025, parseInt(monthA) - 1, parseInt(dayA));
      const dateB = new Date(2025, parseInt(monthB) - 1, parseInt(dayB));
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-30); // Últimos 30 dias

  return sortedData;
};

/**
 * Filtra registros com base no critério selecionado
 * @param registrations - Array de todos os registros
 * @param filterType - Tipo de filtro a ser aplicado
 * @param searchTerm - Termo de busca (opcional)
 * @returns Array de registros filtrados
 */
export const filterRegistrations = (
  registrations: Registration[],
  filterType: string,
  searchTerm?: string
): Registration[] => {
  let filtered = [...registrations];

  // Aplica filtro de busca por texto
  if (searchTerm) {
    filtered = filtered.filter(
      (reg) =>
        reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.cpf.includes(searchTerm) ||
        reg.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Aplica filtro por categoria
  if (filterType !== 'all') {
    filtered = filtered.filter((reg) => {
      switch (filterType) {
        case 'disability':
          return reg.has_disability;
        case 'elderly':
          return reg.has_elderly;
        case 'vulnerable':
          return reg.vulnerable_situation;
        case 'female_head':
          return reg.female_head_of_household;
        case 'homeless':
          return reg.homeless;
        case 'violence':
          return reg.domestic_violence_victim;
        default:
          return true;
      }
    });
  }

  return filtered;
};

/**
 * Exporta registros para formato CSV
 * @param registrations - Array de registros a serem exportados
 * @returns String no formato CSV
 */
export const exportToCSV = (registrations: Registration[]): string => {
  const headers = [
    'Nome Completo',
    'CPF',
    'Endereço',
    'Bairro',
    'Adultos',
    'Menores',
    'Deficiência',
    'Mulher Chefe',
    'Idosos',
    'Vulnerável',
    'Situação de Rua',
    'Violência Doméstica',
    'Data de Cadastro',
  ];

  const csvData = registrations.map((reg) => [
    reg.full_name,
    reg.cpf,
    reg.address,
    reg.neighborhood,
    reg.adults_count,
    reg.minors_count,
    reg.has_disability ? 'Sim' : 'Não',
    reg.female_head_of_household ? 'Sim' : 'Não',
    reg.has_elderly ? 'Sim' : 'Não',
    reg.vulnerable_situation ? 'Sim' : 'Não',
    reg.homeless ? 'Sim' : 'Não',
    reg.domestic_violence_victim ? 'Sim' : 'Não',
    new Date(reg.created_at).toLocaleString('pt-BR'),
  ]);

  return [headers, ...csvData].map((row) => row.join(',')).join('\n');
};

/**
 * Baixa o CSV gerado
 * @param csvContent - Conteúdo CSV a ser baixado
 * @param filename - Nome do arquivo (opcional)
 */
export const downloadCSV = (csvContent: string, filename?: string): void => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || `cadastros_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
