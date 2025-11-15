/**
 * UTILITÁRIO DE ESTILOS DO CARD
 *
 * Este arquivo centraliza a configuração de estilos do card principal do formulário.
 * Facilita a manutenção e personalização dos efeitos visuais.
 */

import { THEME_COLORS } from '../constants';

/**
 * Configuração de transparência e efeitos visuais do card
 */
export const CARD_EFFECTS = {
  // Nível de transparência do card (0-100)
  // 25 = 25% transparente (75% opaco)
  // MODIFICADO: Alterado de 20 para 25
  TRANSPARENCY_PERCENT: 25,

  // Classe Tailwind para o desfoque de fundo
  // backdrop-blur-sm = desfoque leve
  // backdrop-blur-md = desfoque médio
  // backdrop-blur-lg = desfoque forte
  BACKDROP_BLUR: 'backdrop-blur-md',

  // Intensidade da sombra
  SHADOW: 'shadow-xl',

  // Arredondamento dos cantos
  ROUNDED: 'rounded-lg',
} as const;

/**
 * Retorna as classes CSS completas para o card principal
 *
 * @returns String com todas as classes Tailwind necessárias
 */
export const getCardClasses = (): string => {
  return [
    THEME_COLORS.CARD_BACKGROUND,  // Fundo branco com transparência
    CARD_EFFECTS.BACKDROP_BLUR,     // Desfoque do fundo atrás do card
    CARD_EFFECTS.ROUNDED,            // Cantos arredondados
    CARD_EFFECTS.SHADOW,             // Sombra para destaque
    'p-6 sm:p-8',                    // Padding responsivo
  ].join(' ');
};

/**
 * Configuração do overlay de fundo da página
 */
export const OVERLAY_CONFIG = {
  // Opacidade do overlay escuro sobre a imagem de fundo
  OPACITY_PERCENT: 40,

  // Classe Tailwind para o overlay
  CLASS: THEME_COLORS.OVERLAY_BACKGROUND,
} as const;

/**
 * Retorna informações sobre a configuração atual de transparência
 * Útil para documentação e debug
 */
export const getTransparencyInfo = () => {
  return {
    cardOpacity: 100 - CARD_EFFECTS.TRANSPARENCY_PERCENT,
    cardTransparency: CARD_EFFECTS.TRANSPARENCY_PERCENT,
    overlayOpacity: OVERLAY_CONFIG.OPACITY_PERCENT,
    backdropBlur: CARD_EFFECTS.BACKDROP_BLUR,
  };
};
