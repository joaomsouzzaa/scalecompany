import React from 'react';
import { Calendar as CalendarIcon, Filter, RefreshCw } from 'lucide-react';

interface TopFiltersProps {
    lastUpdated?: string;
    onRefresh: () => void;
}

export const TopFilters: React.FC<TopFiltersProps> = ({ lastUpdated, onRefresh }) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">

            {/* Left: Date Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                    <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors">
                        <CalendarIcon size={16} className="mr-2 text-slate-500" />
                        <span>Últimos 30 dias</span>
                    </button>
                </div>

                {/* Quick Presets */}
                <div className="hidden lg:flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-md">Hoje</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-md">7D</button>
                    <button className="px-3 py-1 text-xs font-medium bg-white text-red-600 shadow-sm rounded-md border border-slate-100">30D</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-md">Mês</button>
                </div>
            </div>

            {/* Right: Campaign & Refresh */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <div className="flex items-center px-3 py-2 border border-slate-200 rounded-lg bg-white min-w-[200px]">
                        <Filter size={16} className="text-slate-400 mr-2" />
                        <select className="w-full bg-transparent text-sm text-slate-700 outline-none cursor-pointer appearance-none">
                            <option>Todas as campanhas</option>
                            <option>Imersão Scale - Cold</option>
                            <option>Imersão Scale - Remarketing</option>
                            <option>Lookalike 1%</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={onRefresh}
                    className="flex items-center justify-center p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Atualizar dados"
                >
                    <RefreshCw size={20} />
                </button>

                {lastUpdated && (
                    <span className="text-xs text-slate-400 hidden lg:block">Atz: {lastUpdated}</span>
                )}
            </div>

        </div>
    );
};
