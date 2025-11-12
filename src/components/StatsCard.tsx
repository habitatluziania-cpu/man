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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-14 h-14 ${iconBgColor} rounded-md flex items-center justify-center`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
          <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-gray-600"}>{label}</p>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${trend >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className={isDarkMode ? "text-xl font-bold text-white mb-1.5" : "text-xl font-bold text-gray-900 mb-1.5"}>{value}</p>
      <div className={isDarkMode ? "h-0.5 bg-zinc-800 rounded-full overflow-hidden" : "h-0.5 bg-gray-200 rounded-full overflow-hidden"}>
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '70%' }}></div>
      </div>
    </div>
  );
};
