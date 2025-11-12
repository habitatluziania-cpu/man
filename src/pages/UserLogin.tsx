import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { masks, unmask } from '../utils/masks';

export const UserLogin: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanCpf = unmask(cpf);

      const { data: user, error: queryError } = await supabase
        .from('social_registrations')
        .select('*')
        .eq('cpf', cleanCpf)
        .maybeSingle();

      if (queryError) {
        setError('Erro ao fazer login. Tente novamente.');
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError('CPF ou senha incorretos.');
        setIsLoading(false);
        return;
      }

      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_password', {
          input_password: password,
          stored_password: user.password
        });

      if (verifyError || !isValid) {
        setError('CPF ou senha incorretos.');
        setIsLoading(false);
        return;
      }

      setUserData(user);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setCpf('');
    setPassword('');
  };

  if (userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6 px-4">
            <img
              src="/Habitat-login copy.png"
              alt="Logo Habitat"
              className="h-20 sm:h-28 md:h-32 lg:h-36 w-auto max-w-full object-contain"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Meus Dados</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Nome Completo</h3>
                  <p className="text-lg text-gray-900">{userData.full_name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">CPF</h3>
                  <p className="text-lg text-gray-900">{masks.cpf(userData.cpf)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">NIS (PIS)</h3>
                  <p className="text-lg text-gray-900">{masks.nisPis(userData.nis_pis)}</p>
                </div>

                {userData.voter_registration && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Título Eleitoral</h3>
                    <p className="text-lg text-gray-900">{masks.voterRegistration(userData.voter_registration)}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone Pessoal</h3>
                  <p className="text-lg text-gray-900">{masks.phone(userData.personal_phone)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone de Referência 1</h3>
                  <p className="text-lg text-gray-900">{masks.phone(userData.reference_phone_1)}</p>
                </div>

                {userData.reference_phone_2 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone de Referência 2</h3>
                    <p className="text-lg text-gray-900">{masks.phone(userData.reference_phone_2)}</p>
                  </div>
                )}

                {userData.reference_phone_3 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Telefone de Referência 3</h3>
                    <p className="text-lg text-gray-900">{masks.phone(userData.reference_phone_3)}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Endereço</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Endereço</h3>
                    <p className="text-lg text-gray-900">{userData.address}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bairro</h3>
                    <p className="text-lg text-gray-900">{userData.neighborhood}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">CEP</h3>
                    <p className="text-lg text-gray-900">{masks.cep(userData.cep)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Composição Familiar</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Adultos</h3>
                    <p className="text-lg text-gray-900">{userData.adults_count}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Menores</h3>
                    <p className="text-lg text-gray-900">{userData.minors_count}</p>
                  </div>

                  {userData.has_disability && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Pessoas com Deficiência</h3>
                      <p className="text-lg text-gray-900">{userData.disability_count || 0}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Perfil Socioeconômico</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.female_head_of_household && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-900">Mulher chefe de família</p>
                    </div>
                  )}

                  {userData.has_elderly && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-900">Possui idosos</p>
                    </div>
                  )}

                  {userData.vulnerable_situation && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-gray-900">Em situação de vulnerabilidade</p>
                    </div>
                  )}

                  {userData.homeless && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-gray-900">Em situação de rua</p>
                    </div>
                  )}

                  {userData.domestic_violence_victim && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-gray-900">Vítima de violência doméstica</p>
                    </div>
                  )}

                  {userData.cohabitation && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-gray-900">Em coabitação</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Data de inscrição:</strong> {new Date(userData.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <div className="flex justify-center mb-6">
          <img
            src="/Habitat-login copy.png"
            alt="Logo Habitat"
            className="h-20 sm:h-28 md:h-32 w-auto max-w-full object-contain"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Login do Inscrito</h1>

          {error && (
            <div className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(masks.cpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Entrando...'
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem cadastro?{' '}
                <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Faça sua pré-inscrição
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
