import React, { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (adminError) throw adminError;

        if (!adminData) {
          await supabase.auth.signOut();
          throw new Error('Usuário não autorizado como administrador');
        }

        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    // MODIFICADO: Adicionada imagem de fundo funco-admin.png
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/funco-admin.png')",
        backgroundAttachment: 'fixed'
      }}
    >
      {/* MODIFICADO: Overlay com 20% de opacidade sobre a imagem de fundo */}
      <div className="absolute inset-0 bg-black/20 -z-10"></div>

      {/* Botão de alternância de tema no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </div>

      {/* MODIFICADO: Adicionado relative z-10 para ficar acima do fundo */}
      <div className={
        isDarkMode
          ? "bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10"
          : "bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10"
      }>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/admin.png"
              alt="Logo Admin"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className={isDarkMode ? "text-2xl font-bold text-white" : "text-2xl font-bold text-gray-900"}>
            Painel Administrativo
          </h1>
          <p className={isDarkMode ? "text-slate-400 mt-2" : "text-gray-600 mt-2"}>
            Faça login para acessar os dados
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
              E-mail
            </label>
            <div className="relative">
              <Mail className={isDarkMode ? "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" : "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={
                  isDarkMode
                    ? "w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    : "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                }
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>
              Senha
            </label>
            <div className="relative">
              <Lock className={isDarkMode ? "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" : "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  isDarkMode
                    ? "w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                    : "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                }
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={
              isDarkMode
                ? "w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                : "w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            }
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
