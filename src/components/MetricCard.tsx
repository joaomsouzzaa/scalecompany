import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
    };
    highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, trend, highlight }) => {
    return (
        <div className={`
      relative overflow-hidden rounded-xl p-6 shadow-sm border
      ${highlight
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-white border-slate-100 text-slate-800'}
    `}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${highlight ? 'bg-red-500/50' : 'bg-slate-50'}`}>
                    <Icon size={20} className={highlight ? 'text-white' : 'text-slate-500'} />
                </div>
                {trend && (
                    <div className={`
            flex items-center text-xs font-medium px-2 py-1 rounded-full
            ${highlight
                            ? 'bg-white/20 text-white'
                            : trend.direction === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
          `}>
                        {trend.direction === 'up' ? '+' : '-'}{Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <div>
                <h3 className={`text-sm font-medium mb-1 ${highlight ? 'text-red-100' : 'text-slate-500'}`}>
                    {label}
                </h3>
                <div className="text-2xl font-bold tracking-tight">
                    {value}
                </div>
            </div>
        </div>
    );
};
