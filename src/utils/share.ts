export const shareUtils = {
  whatsapp: (url: string, text: string) => {
    const message = encodeURIComponent(`${text}\n\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  },

  facebook: (url: string) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  },

  copyLink: async (url: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
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
      return false;
    }
  },
};

export const getShareableUrl = (): string => {
  return window.location.href;
};

export const getShareText = (): string => {
  return 'Preencha o formulário de pré-inscrição para o cadastro social';
};
