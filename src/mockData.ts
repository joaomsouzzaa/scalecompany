import { Campaign, DashboardData, Order } from './types.ts';

export const CAMPAIGNS: Campaign[] = [
    { id: '1', name: 'Imersão Scale - Cold Traffic', platform: 'Meta', spend: 12500.50, impressions: 50000, clicks: 1200 },
    { id: '2', name: 'Imersão Scale - Remarketing', platform: 'Meta', spend: 4300.20, impressions: 15000, clicks: 800 },
    { id: '3', name: 'Lookalike 1% Compradores', platform: 'Meta', spend: 8900.00, impressions: 35000, clicks: 950 },
];

export const ORDERS: Order[] = [
    { id: 'ORD-001', date: '2025-01-24T10:30:00', customerName: 'João Silva', customerEmail: 'joao@example.com', product: 'VIP', status: 'Approved', amount: 2997.00, platform: 'Kiwify', utmSource: 'instagram_ads', campaign: 'Imersão Scale - Cold Traffic' },
    { id: 'ORD-002', date: '2025-01-24T11:15:00', customerName: 'Maria Oliveira', customerEmail: 'maria@example.com', product: 'Individual', status: 'Approved', amount: 997.00, platform: 'Kiwify', utmSource: 'email_mkt', campaign: 'Lançamento Base' },
    { id: 'ORD-003', date: '2025-01-24T11:45:00', customerName: 'Carlos Souza', customerEmail: 'carlos@tech.com', product: 'Duplo', status: 'Approved', amount: 1597.00, platform: 'Eduzz', utmSource: 'facebook_ads', campaign: 'Imersão Scale - Remarketing' },
    { id: 'ORD-004', date: '2025-01-23T14:20:00', customerName: 'Ana Pereira', customerEmail: 'ana@design.com', product: 'Individual', status: 'Pending', amount: 997.00, platform: 'GoExplosion', utmSource: 'direct' },
    { id: 'ORD-005', date: '2025-01-23T16:00:00', customerName: 'Lucas Mendes', customerEmail: 'lucas@agencia.com', product: 'VIP', status: 'Refunded', amount: 2997.00, platform: 'Kiwify', utmSource: 'instagram_stories' },
    // ... more mock data could be generated here
];

// Mock aggregated metrics for "Last 30 Days"
export const MOCK_METRICS: DashboardData = {
    investment: 25700.70,
    revenue: 145850.00,
    revenueVip: 45000.00,
    participants: 112,
    vips: 15,
    ticketsIndividual: 70,
    ticketsDouble: 27, // 27 * 2 pax logic elsewhere? or just 27 sales
    averageTicket: 1302.23,
    cpa: 229.47,
    cac: 229.47,
};

export const REVENUE_DATA = [
    { name: 'Jan 18', value: 4500 },
    { name: 'Jan 19', value: 3200 },
    { name: 'Jan 20', value: 7800 },
    { name: 'Jan 21', value: 5400 },
    { name: 'Jan 22', value: 9100 },
    { name: 'Jan 23', value: 12500 },
    { name: 'Jan 24', value: 10200 },
];

export const INVESTMENT_DATA = [
    { name: 'Jan 18', pv: 1200 },
    { name: 'Jan 19', pv: 1100 },
    { name: 'Jan 20', pv: 1500 },
    { name: 'Jan 21', pv: 1300 },
    { name: 'Jan 22', pv: 1800 },
    { name: 'Jan 23', pv: 2100 },
    { name: 'Jan 24', pv: 1900 },
];
