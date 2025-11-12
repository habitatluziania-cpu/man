import React, { useEffect, useState } from 'react';
import { LogOut, Search, Download, Users, Calendar, Filter, Phone, UserX, Shield, Heart, Edit, Trash2, X, Plus, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DailyRegistrationsChart } from '../components/DailyRegistrationsChart';
import { StatsCard } from '../components/StatsCard';
import { ProfileMenu } from '../components/ProfileMenu';
import { InputWithCopy } from '../components/InputWithCopy';
import { masks, unmask } from '../utils/masks';

interface Registration {
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
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredData, setFilteredData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dailyData, setDailyData] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    homeless: 0,
    violence: 0,
    disability: 0,
    totalPhones: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Registration | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [addForm, setAddForm] = useState({
    full_name: '',
    cpf: '',
    nis_pis: '',
    voter_registration: '',
    password: '',
    personal_phone: '',
    reference_phone_1: '',
    reference_phone_2: '',
    reference_phone_3: '',
    adults_count: 1,
    minors_count: 0,
    has_disability: false,
    disability_count: undefined as number | undefined,
    address: '',
    neighborhood: '',
    cep: '',
    female_head_of_household: false,
    has_elderly: false,
    vulnerable_situation: false,
    homeless: false,
    domestic_violence_victim: false,
    cohabitation: false,
  });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    calculateStats();
    calculateDailyData();
  }, [registrations]);

  useEffect(() => {
    filterRegistrations();
  }, [searchTerm, filterType, registrations]);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('social_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar dados:', error);
        throw error;
      }

      console.log('Dados carregados:', data);
      setRegistrations(data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao carregar cadastros. Verifique se você está logado como administrador.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const homeless = registrations.filter((r) => r.homeless).length;
    const violence = registrations.filter((r) => r.domestic_violence_victim).length;
    const disability = registrations.filter((r) => r.has_disability).length;
    const totalPhones = registrations.reduce((acc, reg) => {
      let count = 1;
      if (reg.reference_phone_1) count++;
      if (reg.reference_phone_2) count++;
      if (reg.reference_phone_3) count++;
      return acc + count;
    }, 0);

    setStats({
      total: registrations.length,
      homeless,
      violence,
      disability,
      totalPhones,
    });
  };

  const calculateDailyData = () => {
    const dailyMap = new Map<string, number>();

    registrations.forEach((reg) => {
      const date = new Date(reg.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    const sortedData = Array.from(dailyMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/');
        const [dayB, monthB] = b.date.split('/');
        const dateA = new Date(2025, parseInt(monthA) - 1, parseInt(dayA));
        const dateB = new Date(2025, parseInt(monthB) - 1, parseInt(dayB));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-30);

    setDailyData(sortedData);
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.cpf.includes(searchTerm) ||
          reg.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleEdit = (registration: Registration) => {
    setEditingId(registration.id);
    setEditForm({ ...registration });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm || !editingId) return;

    try {
      const { error } = await supabase
        .from('social_registrations')
        .update({
          full_name: editForm.full_name,
          cpf: editForm.cpf,
          nis_pis: editForm.nis_pis,
          voter_registration: editForm.voter_registration,
          personal_phone: editForm.personal_phone,
          reference_phone_1: editForm.reference_phone_1,
          reference_phone_2: editForm.reference_phone_2,
          reference_phone_3: editForm.reference_phone_3,
          address: editForm.address,
          neighborhood: editForm.neighborhood,
          cep: editForm.cep,
          adults_count: editForm.adults_count,
          minors_count: editForm.minors_count,
          has_disability: editForm.has_disability,
          disability_count: editForm.disability_count,
          female_head_of_household: editForm.female_head_of_household,
          has_elderly: editForm.has_elderly,
          vulnerable_situation: editForm.vulnerable_situation,
          homeless: editForm.homeless,
          domestic_violence_victim: editForm.domestic_violence_victim,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) throw error;

      await fetchRegistrations();
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      console.error('Erro ao atualizar cadastro:', err);
      alert('Erro ao atualizar cadastro. Tente novamente.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('social_registrations')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      await fetchRegistrations();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Erro ao excluir cadastro:', err);
      alert('Erro ao excluir cadastro. Tente novamente.');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({
      full_name: '',
      cpf: '',
      nis_pis: '',
      voter_registration: '',
      password: '',
      personal_phone: '',
      reference_phone_1: '',
      reference_phone_2: '',
      reference_phone_3: '',
      adults_count: 1,
      minors_count: 0,
      has_disability: false,
      disability_count: undefined,
      address: '',
      neighborhood: '',
      cep: '',
      female_head_of_household: false,
      has_elderly: false,
      vulnerable_situation: false,
      homeless: false,
      domestic_violence_victim: false,
      cohabitation: false,
    });
  };

  const handleSaveAdd = async () => {
    if (!addForm.full_name || !addForm.cpf || !addForm.nis_pis || !addForm.password || !addForm.personal_phone || !addForm.reference_phone_1 || !addForm.address || !addForm.neighborhood || !addForm.cep) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (addForm.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const { error } = await supabase
        .from('social_registrations')
        .insert({
          full_name: addForm.full_name,
          cpf: unmask(addForm.cpf),
          nis_pis: unmask(addForm.nis_pis),
          voter_registration: addForm.voter_registration ? unmask(addForm.voter_registration) : null,
          password: addForm.password,
          personal_phone: unmask(addForm.personal_phone),
          reference_phone_1: unmask(addForm.reference_phone_1),
          reference_phone_2: addForm.reference_phone_2 ? unmask(addForm.reference_phone_2) : null,
          reference_phone_3: addForm.reference_phone_3 ? unmask(addForm.reference_phone_3) : null,
          address: addForm.address,
          neighborhood: addForm.neighborhood,
          cep: unmask(addForm.cep),
          adults_count: addForm.adults_count,
          minors_count: addForm.minors_count,
          has_disability: addForm.has_disability,
          disability_count: addForm.disability_count || null,
          female_head_of_household: addForm.female_head_of_household,
          has_elderly: addForm.has_elderly,
          vulnerable_situation: addForm.vulnerable_situation,
          homeless: addForm.homeless,
          domestic_violence_victim: addForm.domestic_violence_victim,
          cohabitation: addForm.cohabitation,
        });

      if (error) throw error;

      await fetchRegistrations();
      handleCancelAdd();
    } catch (err) {
      console.error('Erro ao adicionar cadastro:', err);
      alert('Erro ao adicionar cadastro. Verifique se o CPF já não está cadastrado.');
    }
  };

  const exportToCSV = () => {
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

    const csvData = filteredData.map((reg) => [
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

    const csv = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `cadastros_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black" : "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"}>
      <header className={isDarkMode ? "bg-gradient-to-r from-black to-zinc-900 border-b border-zinc-800 shadow-xl" : "bg-white border-b border-gray-200 shadow-sm"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/Image_5_.png"
                alt="Logo Habitat"
                className="h-10 w-auto"
              />
              <div>
                <p className={isDarkMode ? "text-slate-400 text-xs" : "text-gray-600 text-xs"}>Sistema de Gestão Social</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={isDarkMode
                  ? "p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-md transition-all border border-zinc-800"
                  : "p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-all border border-gray-300"
                }
                title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
              <ProfileMenu isDarkMode={isDarkMode} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            iconBgColor="bg-cyan-500/20"
            iconColor="text-cyan-400"
            label="Total de Cadastros"
            value={stats.total}
            trend={12}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            icon={UserX}
            iconBgColor="bg-orange-500/20"
            iconColor="text-orange-400"
            label="Moradores de Rua"
            value={stats.homeless}
            trend={-3}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            icon={Heart}
            iconBgColor="bg-rose-500/20"
            iconColor="text-rose-400"
            label="Vítimas de Violência"
            value={stats.violence}
            trend={5}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            icon={Shield}
            iconBgColor="bg-emerald-500/20"
            iconColor="text-emerald-400"
            label="Pessoas com Deficiência"
            value={stats.disability}
            trend={8}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Phone}
            iconBgColor="bg-violet-500/20"
            iconColor="text-violet-400"
            label="Total de Telefones"
            value={stats.totalPhones}
            trend={15}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="mb-8">
          <DailyRegistrationsChart data={dailyData} isDarkMode={isDarkMode} />
        </div>

        <div className={isDarkMode
          ? "bg-gradient-to-br from-zinc-900 to-black rounded-xl shadow-lg border border-zinc-800"
          : "bg-white rounded-xl shadow-lg border border-gray-200"
        }>
          <div className={isDarkMode ? "p-6 border-b border-zinc-800" : "p-6 border-b border-gray-200"}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={isDarkMode ? "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" : "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"} />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF ou bairro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={isDarkMode
                    ? "w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    : "w-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  }
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={isDarkMode
                  ? "px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  : "px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                }
              >
                <option value="all">Todos</option>
                <option value="disability">Com Deficiência</option>
                <option value="elderly">Com Idosos</option>
                <option value="vulnerable">Situação Vulnerável</option>
                <option value="female_head">Mulher Chefe de Família</option>
                <option value="homeless">Situação de Rua</option>
                <option value="violence">Vítima de Violência</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className={isDarkMode
                    ? "flex items-center gap-2 px-4 py-2 bg-zinc-900 text-slate-300 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                    : "flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  }
                  title="Exportar para CSV"
                >
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button
                  onClick={handleAddNew}
                  className={isDarkMode
                    ? "flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/30"
                    : "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  }
                >
                  <Plus className="w-4 h-4" />
                  Novo Cadastro
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? "bg-zinc-950/50 border-b border-zinc-800" : "bg-gray-50 border-b border-gray-200"}>
                <tr>
                  <th className={isDarkMode ? "px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                    Nome
                  </th>
                  <th className={isDarkMode ? "px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                    CPF
                  </th>
                  <th className={isDarkMode ? "px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                    Bairro
                  </th>
                  <th className={isDarkMode ? "px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider" : "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                    Data
                  </th>
                  <th className={isDarkMode ? "px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider" : "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "divide-y divide-zinc-800" : "bg-white divide-y divide-gray-200"}>
                {currentData.map((reg) => (
                  <tr key={reg.id} className={isDarkMode ? "hover:bg-zinc-900/50 transition-colors" : "hover:bg-gray-50 transition-colors"}>
                    <td className={isDarkMode ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-white" : "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"}>
                      {reg.full_name}
                    </td>
                    <td className={isDarkMode ? "px-6 py-4 whitespace-nowrap text-sm text-slate-300" : "px-6 py-4 whitespace-nowrap text-sm text-gray-600"}>
                      {reg.cpf}
                    </td>
                    <td className={isDarkMode ? "px-6 py-4 whitespace-nowrap text-sm text-slate-300" : "px-6 py-4 whitespace-nowrap text-sm text-gray-600"}>
                      {reg.neighborhood}
                    </td>
                    <td className={isDarkMode ? "px-6 py-4 whitespace-nowrap text-sm text-slate-300" : "px-6 py-4 whitespace-nowrap text-sm text-gray-600"}>
                      {new Date(reg.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(reg)}
                          className={isDarkMode
                            ? "p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
                            : "p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          }
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(reg.id)}
                          className={isDarkMode
                            ? "p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors border border-transparent hover:border-rose-500/30"
                            : "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          }
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Nenhum registro encontrado</p>
            </div>
          )}

          {filteredData.length > 0 && (
            <div className={isDarkMode ? "mt-6 flex items-center justify-between px-6 py-4 bg-zinc-950/50 border-t border-zinc-800" : "mt-6 flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200"}>
              <div className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>
                Mostrando <span className={isDarkMode ? "font-semibold text-cyan-400" : "font-semibold text-blue-600"}>{startIndex + 1}</span> a{' '}
                <span className={isDarkMode ? "font-semibold text-cyan-400" : "font-semibold text-blue-600"}>{Math.min(endIndex, filteredData.length)}</span> de{' '}
                <span className={isDarkMode ? "font-semibold text-cyan-400" : "font-semibold text-blue-600"}>{filteredData.length}</span> registros
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={isDarkMode
                    ? "p-2 text-slate-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    : "p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  }
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className={isDarkMode ? "px-1 text-slate-500 text-xs" : "px-1 text-gray-500 text-xs"}>...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={isDarkMode
                            ? `px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                currentPage === page
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                                  : 'text-slate-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                              }`
                            : `px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`
                          }
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={isDarkMode
                    ? "p-2 text-slate-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    : "p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  }
                  title="Próxima"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {editingId && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Editar Cadastro</h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                <InputWithCopy
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.cpf}
                    onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIS (PIS) *</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.nis_pis}
                    onChange={(e) => setEditForm({ ...editForm, nis_pis: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título Eleitoral</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.voter_registration || ''}
                    onChange={(e) => setEditForm({ ...editForm, voter_registration: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Pessoal *</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.personal_phone}
                    onChange={(e) => setEditForm({ ...editForm, personal_phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone para Recado 1 *</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.reference_phone_1}
                    onChange={(e) => setEditForm({ ...editForm, reference_phone_1: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone para Recado 2</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.reference_phone_2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, reference_phone_2: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone para Recado 3</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.reference_phone_3 || ''}
                    onChange={(e) => setEditForm({ ...editForm, reference_phone_3: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
                <InputWithCopy
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.neighborhood}
                    onChange={(e) => setEditForm({ ...editForm, neighborhood: e.target.value })}
                    placeholder="Digite o bairro"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <InputWithCopy
                    type="text"
                    value={editForm.cep}
                    onChange={(e) => setEditForm({ ...editForm, cep: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Adultos *</label>
                  <InputWithCopy
                    type="number"
                    min={1}
                    value={editForm.adults_count}
                    onChange={(e) => setEditForm({ ...editForm, adults_count: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Menores *</label>
                  <InputWithCopy
                    type="number"
                    min={0}
                    value={editForm.minors_count}
                    onChange={(e) => setEditForm({ ...editForm, minors_count: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tem alguma pessoa com deficiência? *</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={editForm.has_disability}
                      onChange={() => setEditForm({ ...editForm, has_disability: true })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!editForm.has_disability}
                      onChange={() => setEditForm({ ...editForm, has_disability: false, disability_count: undefined })}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Não</span>
                  </label>
                </div>
                {editForm.has_disability && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantos:</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.disability_count || ''}
                      onChange={(e) => setEditForm({ ...editForm, disability_count: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.female_head_of_household}
                    onChange={(e) => setEditForm({ ...editForm, female_head_of_household: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Mulher Chefe de Família</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.has_elderly}
                    onChange={(e) => setEditForm({ ...editForm, has_elderly: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Possui Idosos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.vulnerable_situation}
                    onChange={(e) => setEditForm({ ...editForm, vulnerable_situation: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Situação Vulnerável</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.homeless}
                    onChange={(e) => setEditForm({ ...editForm, homeless: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Situação de Rua</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.domestic_violence_victim}
                    onChange={(e) => setEditForm({ ...editForm, domestic_violence_victim: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Vítima de Violência Doméstica</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={isDarkMode
            ? "bg-zinc-900 rounded-lg shadow-xl max-w-xs w-full border border-zinc-800"
            : "bg-white rounded-lg shadow-xl max-w-xs w-full"
          }>
            <div className="p-5">
              <h3 className={isDarkMode
                ? "text-base font-bold text-white text-center mb-4"
                : "text-base font-bold text-gray-900 text-center mb-4"
              }>
                Deseja excluir este cadastro?
              </h3>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelDelete}
                  className={isDarkMode
                    ? "px-6 py-1.5 text-sm border border-zinc-700 text-slate-300 rounded-lg hover:bg-zinc-800 transition-colors font-medium"
                    : "px-6 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  }
                >
                  Não
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className={isDarkMode
                    ? "px-6 py-1.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    : "px-6 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  }
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={isDarkMode
            ? "bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800"
            : "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          }>
            <div className={isDarkMode
              ? "sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between"
              : "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
            }>
              <h2 className={isDarkMode ? "text-xl font-bold text-white" : "text-xl font-bold text-gray-900"}>Novo Cadastro</h2>
              <button
                onClick={handleCancelAdd}
                className={isDarkMode
                  ? "p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  : "p-2 hover:bg-gray-100 rounded-lg transition-colors"
                }
              >
                <X className={isDarkMode ? "w-5 h-5 text-slate-400" : "w-5 h-5 text-gray-500"} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Nome Completo *</label>
                <InputWithCopy
                  type="text"
                  value={addForm.full_name}
                  onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>CPF *</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.cpf}
                    onChange={(e) => setAddForm({ ...addForm, cpf: masks.cpf(e.target.value) })}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>NIS (PIS) *</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.nis_pis}
                    onChange={(e) => setAddForm({ ...addForm, nis_pis: masks.nisPis(e.target.value) })}
                    placeholder="00000000000"
                    maxLength={11}
                    required
                  />
                </div>
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Título Eleitoral</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.voter_registration}
                    onChange={(e) => setAddForm({ ...addForm, voter_registration: masks.voterRegistration(e.target.value) })}
                    placeholder="000000000000"
                    maxLength={12}
                  />
                </div>
              </div>

              <div>
                <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Senha *</label>
                <InputWithCopy
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Telefone Pessoal *</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.personal_phone}
                    onChange={(e) => setAddForm({ ...addForm, personal_phone: masks.phone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                  />
                </div>
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Telefone para Recado 1 *</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.reference_phone_1}
                    onChange={(e) => setAddForm({ ...addForm, reference_phone_1: masks.phone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Telefone para Recado 2</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.reference_phone_2}
                    onChange={(e) => setAddForm({ ...addForm, reference_phone_2: masks.phone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Telefone para Recado 3</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.reference_phone_3}
                    onChange={(e) => setAddForm({ ...addForm, reference_phone_3: masks.phone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>

              <div>
                <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Endereço Completo *</label>
                <InputWithCopy
                  type="text"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Bairro *</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.neighborhood}
                    onChange={(e) => setAddForm({ ...addForm, neighborhood: e.target.value })}
                    placeholder="Digite o bairro"
                    required
                  />
                </div>
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>CEP *</label>
                  <InputWithCopy
                    type="text"
                    value={addForm.cep}
                    onChange={(e) => setAddForm({ ...addForm, cep: masks.cep(e.target.value) })}
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Quantidade de Adultos *</label>
                  <InputWithCopy
                    type="number"
                    min={1}
                    value={addForm.adults_count}
                    onChange={(e) => setAddForm({ ...addForm, adults_count: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div>
                  <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Quantidade de Menores *</label>
                  <InputWithCopy
                    type="number"
                    min={0}
                    value={addForm.minors_count}
                    onChange={(e) => setAddForm({ ...addForm, minors_count: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-2" : "block text-sm font-medium text-gray-700 mb-2"}>Tem alguma pessoa com deficiência? *</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={addForm.has_disability}
                      onChange={() => setAddForm({ ...addForm, has_disability: true })}
                      className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"}
                    />
                    <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Sim</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!addForm.has_disability}
                      onChange={() => setAddForm({ ...addForm, has_disability: false, disability_count: undefined })}
                      className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"}
                    />
                    <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Não</span>
                  </label>
                </div>
                {addForm.has_disability && (
                  <div>
                    <label className={isDarkMode ? "block text-sm font-medium text-slate-300 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>Quantos:</label>
                    <input
                      type="number"
                      min="1"
                      value={addForm.disability_count || ''}
                      onChange={(e) => setAddForm({ ...addForm, disability_count: parseInt(e.target.value) || undefined })}
                      className={isDarkMode
                        ? "w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addForm.female_head_of_household}
                    onChange={(e) => setAddForm({ ...addForm, female_head_of_household: e.target.checked })}
                    className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 rounded focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}
                  />
                  <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Mulher Chefe de Família</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addForm.has_elderly}
                    onChange={(e) => setAddForm({ ...addForm, has_elderly: e.target.checked })}
                    className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 rounded focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}
                  />
                  <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Possui Idosos</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addForm.vulnerable_situation}
                    onChange={(e) => setAddForm({ ...addForm, vulnerable_situation: e.target.checked })}
                    className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 rounded focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}
                  />
                  <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Situação Vulnerável</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addForm.homeless}
                    onChange={(e) => setAddForm({ ...addForm, homeless: e.target.checked })}
                    className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 rounded focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}
                  />
                  <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Situação de Rua</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addForm.domestic_violence_victim}
                    onChange={(e) => setAddForm({ ...addForm, domestic_violence_victim: e.target.checked })}
                    className={isDarkMode ? "w-4 h-4 text-cyan-500 border-zinc-700 rounded focus:ring-cyan-500" : "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"}
                  />
                  <span className={isDarkMode ? "text-sm text-slate-300" : "text-sm text-gray-700"}>Vítima de Violência Doméstica</span>
                </label>
              </div>
            </div>

            <div className={isDarkMode
              ? "sticky bottom-0 bg-zinc-950 px-6 py-4 flex gap-3 justify-end border-t border-zinc-800"
              : "sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200"
            }>
              <button
                onClick={handleCancelAdd}
                className={isDarkMode
                  ? "px-4 py-2 border border-zinc-700 text-slate-300 rounded-lg hover:bg-zinc-800 transition-colors"
                  : "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                }
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAdd}
                className={isDarkMode
                  ? "px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/30"
                  : "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                }
              >
                Adicionar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
