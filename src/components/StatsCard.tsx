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
      ? "bg-gradient-to-br from-zinc-900 to-black rounded-lg shadow-lg p-3 border border-zinc-800 hover:border-cyan-500 transition-all duration-300"
      : "bg-white rounded-lg shadow-lg p-3 border border-gray-200 hover:border-blue-500 transition-all duration-300"
    }>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-14 h-14 ${iconBgColor} rounded-md flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
        <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-gray-600"}>{label}</p>
      </div>
      <p className={isDarkMode ? "text-xl font-bold text-white text-center" : "text-xl font-bold text-gray-900 text-center"}>{value}</p>
    </div>
  );
};
