/**
 * TYPES E INTERFACES CENTRALIZADAS
 *
 * Este arquivo contém todas as definições de tipos e interfaces
 * utilizadas em todo o projeto, facilitando a manutenção e
 * garantindo consistência de tipos.
 */

/**
 * Interface para dados de registro social
 * Representa um cadastro completo no sistema
 */
export interface Registration {
  id: string;
  full_name: string;
  cpf: string;
  nis_pis: string;
  voter_registration?: string;
  personal_phone: string;
  reference_phone_1: string;
  reference_phone_2?: string;
  reference_phone_3?: string;
  adults_count: number;
  minors_count: number;
  has_disability: boolean;
  disability_count?: number;
  address: string;
  neighborhood: string;
  cep: string;
  female_head_of_household: boolean;
  has_elderly: boolean;
  vulnerable_situation: boolean;
  homeless: boolean;
  domestic_violence_victim: boolean;
  cohabitation?: boolean;
  password?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Interface para dados do formulário de inscrição
 * Usado no processo de cadastro multi-etapas
 */
export interface FormData {
  fullName: string;
  cpf: string;
  nisPis: string;
  voterRegistration: string;
  password: string;
  confirmPassword: string;
  personalPhone: string;
  referencePhone1: string;
  referencePhone2: string;
  referencePhone3: string;
  adultsCount: number;
  minorsCount: number;
  hasDisability: boolean | null;
  disabilityCount: number;
  address: string;
  neighborhood: string;
  cep: string;
  femaleHeadOfHousehold: boolean | null;
  hasElderly: boolean | null;
  vulnerableSituation: boolean | null;
  homeless: boolean | null;
  domesticViolenceVictim: boolean | null;
  cohabitation: boolean | null;
}

/**
 * Interface para props de seções do formulário
 * Usada por todas as seções do MultiStepForm
 */
export interface FormSectionProps {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
  onBlur: (field: string) => void;
}

/**
 * Interface para dados de estatísticas do dashboard
 */
export interface DashboardStats {
  total: number;
  homeless: number;
  violence: number;
  disability: number;
  totalPhones: number;
}

/**
 * Interface para dados de gráfico diário
 */
export interface DailyData {
  date: string;
  count: number;
}

/**
 * Interface para dados de usuário admin
 */
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  profile_photo_url?: string;
  created_at: string;
}

/**
 * Tipo para status de submissão de formulários
 */
export type SubmitStatus = 'success' | 'error' | null;

/**
 * Tipo para filtros do dashboard
 */
export type FilterType = 'all' | 'disability' | 'elderly' | 'vulnerable' | 'female_head' | 'homeless' | 'violence';

/**
 * Interface para configuração de etapas do formulário
 */
export interface FormStep {
  title: string;
  component: React.ComponentType<FormSectionProps>;
  fields: string[];
}
