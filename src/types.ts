export type EventType = 'WORKSHOP' | 'SUMMIT' | 'PROGRAM' | 'CLUB';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  product: 'Individual' | 'Duplo' | 'VIP';
  status: 'Approved' | 'Pending' | 'Refunded';
  amount: number;
  platform: 'Kiwify' | 'Eduzz' | 'GoExplosion';
  utmSource?: string;
  campaign?: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Meta' | 'Google';
  spend: number;
  impressions: number;
  clicks: number;
}

export interface DashboardData {
  investment: number;
  revenue: number;
  revenueVip: number;
  participants: number;
  vips: number;
  ticketsIndividual: number;
  ticketsDouble: number;
  averageTicket: number;
  cpa: number;
  cac: number; // For now assuming same logic as CPA
}
