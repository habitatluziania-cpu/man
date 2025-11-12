import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar o tema da aplicação
 * Persiste a preferência do usuário no localStorage
 * Retorna o estado do tema e função para alterná-lo
 */
export const useTheme = () => {
  // Verifica se existe preferência salva no localStorage, caso contrário usa o modo claro como padrão
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Sempre que o tema mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Função para alternar entre claro e escuro
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return { isDarkMode, toggleTheme };
};
