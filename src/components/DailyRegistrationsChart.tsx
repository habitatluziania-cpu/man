import React from 'react';

interface DailyData {
  date: string;
  count: number;
}

interface DailyRegistrationsChartProps {
  data: DailyData[];
  isDarkMode?: boolean;
}

export const DailyRegistrationsChart: React.FC<DailyRegistrationsChartProps> = ({ data, isDarkMode = true }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const chartHeight = 60;
  const chartWidth = 100;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * chartWidth;
    const y = chartHeight - (item.count / maxCount) * chartHeight;
    return { x, y, count: item.count, date: item.date };
  });

  const pathData = points.length > 0
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const areaData = points.length > 0
    ? `M 0,${chartHeight} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${chartWidth},${chartHeight} Z`
    : '';

  return (
    <div className={isDarkMode
      ? "bg-gradient-to-br from-zinc-900 to-black rounded-xl shadow-lg p-4 border border-zinc-800"
      : "bg-white rounded-xl shadow-lg p-4 border border-gray-200"
    }>
      <h3 className={isDarkMode ? "text-sm font-semibold text-white mb-3" : "text-sm font-semibold text-gray-900 mb-3"}>Cadastros por Dia</h3>

      {data.length === 0 ? (
        <div className={isDarkMode ? "flex items-center justify-center h-16 text-slate-400 text-sm" : "flex items-center justify-center h-16 text-gray-500 text-sm"}>
          Nenhum dado disponível
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
            className="w-full"
            style={{ height: '90px' }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <path
              d={areaData}
              fill="url(#lineGradient)"
              className="transition-all duration-300"
            />

            <path
              d={pathData}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
              style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))' }}
            />

            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#06b6d4"
                  className="hover:r-4 transition-all cursor-pointer"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.8))' }}
                >
                  <title>{point.count} cadastro{point.count !== 1 ? 's' : ''} - {point.date}</title>
                </circle>

                <text
                  x={point.x}
                  y={chartHeight + 10}
                  textAnchor="middle"
                  className={isDarkMode ? "text-xs fill-slate-400" : "text-xs fill-gray-600"}
                  style={{ fontSize: '8px' }}
                >
                  {point.date}
                </text>

                {point.count > 0 && (
                  <text
                    x={point.x}
                    y={point.y - 6}
                    textAnchor="middle"
                    className="text-xs fill-cyan-400 font-semibold"
                    style={{ fontSize: '9px' }}
                  >
                    {point.count}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};
