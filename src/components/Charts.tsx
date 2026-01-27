import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

interface ChartProps {
    data: any[];
}

export const RevenueChart: React.FC<ChartProps> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Faturamento Acumulado</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        tickFormatter={(value) => `R$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#DC2626"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#DC2626' }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#DC2626' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const InvestmentChart: React.FC<ChartProps> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Investimento Diário</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Investimento']}
                    />
                    <Bar
                        dataKey="pv"
                        fill="#1E293B"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
