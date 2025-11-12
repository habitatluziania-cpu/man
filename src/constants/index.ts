/**
 * CONSTANTES E CONFIGURAÇÕES GLOBAIS
 *
 * Este arquivo centraliza todas as constantes e configurações
 * utilizadas em todo o projeto, facilitando manutenção e alterações.
 */

import { FormData } from '../types';

/**
 * Valores iniciais para o formulário de inscrição
 * Usado para resetar o formulário após submissão
 */
export const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  cpf: '',
  nisPis: '',
  voterRegistration: '',
  password: '',
  confirmPassword: '',
  personalPhone: '',
  referencePhone1: '',
  referencePhone2: '',
  referencePhone3: '',
  adultsCount: 1,
  minorsCount: 0,
  hasDisability: null,
  disabilityCount: 0,
  address: '',
  neighborhood: '',
  cep: '',
  femaleHeadOfHousehold: null,
  hasElderly: null,
  vulnerableSituation: null,
  homeless: null,
  domesticViolenceVictim: null,
  cohabitation: null,
};

/**
 * Configuração de paginação do dashboard
 */
export const PAGINATION = {
  ITEMS_PER_PAGE: 30,
  MAX_DAILY_DATA_POINTS: 30,
} as const;

/**
 * Configuração de validação
 */
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  CPF_LENGTH: 11,
  NIS_PIS_LENGTH: 11,
  VOTER_REGISTRATION_LENGTH: 12,
  CEP_LENGTH: 8,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 11,
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_CPF: 'CPF inválido',
  INVALID_EMAIL: 'E-mail inválido',
  INVALID_PHONE: 'Telefone inválido',
  INVALID_CEP: 'CEP inválido',
  PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 6 caracteres',
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  GENERIC_ERROR: 'Erro ao processar solicitação',
  LOGIN_ERROR: 'CPF ou senha incorretos',
  SUBMIT_SUCCESS: 'Pré-inscrição realizada com sucesso!',
  SUBMIT_ERROR: 'Erro ao enviar o formulário. Tente novamente.',
} as const;

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  LOGIN: '/login',
} as const;

/**
 * Chaves de armazenamento local
 */
export const STORAGE_KEYS = {
  THEME: 'theme',
} as const;

/**
 * Configuração de temas
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
