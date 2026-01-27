import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar.tsx';
import { TopFilters } from '../components/TopFilters.tsx';
import { MetricCard } from '../components/MetricCard.tsx';
import { RevenueChart, InvestmentChart } from '../components/Charts.tsx';
import { OrdersTable } from '../components/OrdersTable.tsx';
import { MOCK_METRICS, REVENUE_DATA, INVESTMENT_DATA, ORDERS } from '../mockData.ts';
import {
    DollarSign,
    Users,
    Ticket,
    TrendingUp,
    Briefcase,
    CreditCard
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const [currentEvent, setCurrentEvent] = useState('workshop');
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState(MOCK_METRICS);

    // Mock refresh effect
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // In a real app, we would re-fetch data here
        }, 1000);
    };

    const formattedDate = new Date().toLocaleString('pt-BR');

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar Navigation */}
            <Sidebar currentEvent={currentEvent} onEventChange={setCurrentEvent} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                                Dashboard de Vendas
                            </h1>
                        </div>

                        {/* Filters */}
                        <TopFilters
                            lastUpdated={formattedDate}
                            onRefresh={handleRefresh}
                        />

                        {/* Loading Overlay Mock */}
                        {loading && (
                            <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            </div>
                        )}

                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                label="Investimento Total"
                                value={`R$ ${metrics.investment.toLocaleString('pt-BR')}`}
                                icon={DollarSign}
                                trend={{ value: 12, direction: 'up' }}
                            />
                            <MetricCard
                                label="Faturamento Total"
                                value={`R$ ${metrics.revenue.toLocaleString('pt-BR')}`}
                                icon={TrendingUp}
                                highlight={true}
                                trend={{ value: 24, direction: 'up' }}
                            />
                            <MetricCard
                                label="CPA Médio"
                                value={`R$ ${metrics.cpa.toLocaleString('pt-BR')}`}
                                icon={Briefcase}
                                trend={{ value: 5, direction: 'down' }}
                            />
                            <MetricCard
                                label="Ticket Médio"
                                value={`R$ ${metrics.averageTicket.toLocaleString('pt-BR')}`}
                                icon={CreditCard}
                            />
                        </div>

                        {/* Secondary KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                label="Participantes"
                                value={metrics.participants}
                                icon={Users}
                            />
                            <MetricCard
                                label="VIPs"
                                value={metrics.vips}
                                icon={Users}
                            />
                            <MetricCard
                                label="Ingressos Individuais"
                                value={metrics.ticketsIndividual}
                                icon={Ticket}
                            />
                            <MetricCard
                                label="Ingressos Duplos"
                                value={metrics.ticketsDouble}
                                icon={Ticket}
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RevenueChart data={REVENUE_DATA} />
                            <InvestmentChart data={INVESTMENT_DATA} />
                        </div>

                        {/* Data Table */}
                        <OrdersTable orders={ORDERS} />

                    </div>
                </main>
            </div>
        </div>
    );
};
