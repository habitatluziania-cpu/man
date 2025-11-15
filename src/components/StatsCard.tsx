import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: number | string;
  trend?: number;
  isDarkMode?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  trend,
  isDarkMode = true,
}) => {
  return (
    <div className={isDarkMode
      ? "bg-gradient-to-br from-zinc-900 to-black rounded-lg shadow-lg p-6 border border-zinc-800 hover:border-cyan-500 transition-all duration-300"
      : "bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:border-blue-500 transition-all duration-300"
    }>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`w-16 h-16 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        <p className={isDarkMode ? "text-sm font-medium text-slate-300" : "text-sm font-medium text-gray-600"}>{label}</p>
        <p className={isDarkMode ? "text-3xl font-bold text-white" : "text-3xl font-bold text-gray-900"}>{value}</p>
      </div>
    </div>
  );
};
