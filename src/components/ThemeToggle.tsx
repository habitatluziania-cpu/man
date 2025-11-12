import React from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Componente de alternância entre modo claro e escuro
 * Responsável por exibir o botão de troca de tema e gerenciar o estado visual
 */
interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={
        isDarkMode
          ? "p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all border border-slate-600 shadow-lg"
          : "p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all border border-gray-300 shadow-sm"
      }
      title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" />
      )}
    </button>
  );
};
