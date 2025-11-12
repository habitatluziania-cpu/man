/**
 * UTILITÁRIO DE COMPARTILHAMENTO
 *
 * Funções para compartilhar links e conteúdo
 * em diferentes plataformas sociais.
 */

/**
 * Conjunto de funções para compartilhamento social
 */
export const shareUtils = {
  /**
   * Compartilha um link via WhatsApp
   * @param url - URL a ser compartilhada
   * @param text - Texto da mensagem
   */
  whatsapp: (url: string, text: string) => {
    const message = encodeURIComponent(`${text}\n\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  },

  /**
   * Compartilha um link via Facebook
   * @param url - URL a ser compartilhada
   */
  facebook: (url: string) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  },

  /**
   * Copia um link para a área de transferência
   * @param url - URL a ser copiada
   * @returns Promise<boolean> indicando sucesso ou falha
   */
  copyLink: async (url: string): Promise<boolean> => {
    try {
      // Tenta usar a API moderna de clipboard (navegadores modernos em HTTPS)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
        // Fallback para navegadores mais antigos ou HTTP
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
      }
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      return false;
    }
  },
};

/**
 * Obtém a URL atual da página para compartilhamento
 * @returns URL completa da página atual
 */
export const getShareableUrl = (): string => {
  return window.location.href;
};

/**
 * Obtém o texto padrão para compartilhamento
 * @returns Texto descritivo para compartilhar o formulário
 */
export const getShareText = (): string => {
  return 'Preencha o formulário de pré-inscrição para o cadastro social';
};
