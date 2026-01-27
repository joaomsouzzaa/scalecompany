import React from 'react';
import { Order } from '../types.ts';
import { CheckCircle, Clock, XCircle, MoreHorizontal } from 'lucide-react';

interface OrdersTableProps {
    orders: Order[];
}

const StatusBadge = ({ status }: { status: Order['status'] }) => {
    const styles = {
        Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        Pending: 'bg-amber-50 text-amber-700 border-amber-100',
        Refunded: 'bg-slate-50 text-slate-600 border-slate-100',
    };

    const Icons = {
        Approved: CheckCircle,
        Pending: Clock,
        Refunded: XCircle,
    };

    const Icon = Icons[status];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            <Icon size={12} className="mr-1.5" />
            {status === 'Approved' ? 'Aprovado' : status === 'Pending' ? 'Pendente' : 'Reembolsado'}
        </span>
    );
};

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Vendas Recentes</h3>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">Ver todas</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Data</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4">Plataforma</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Valor</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(order.date).toLocaleDateString('pt-BR')}
                                    <span className="text-slate-400 ml-2 text-xs">
                                        {new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{order.customerName}</div>
                                    <div className="text-xs text-slate-400">{order.customerEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`
                    inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${order.product === 'VIP' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}
                  `}>
                                        {order.product}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{order.platform}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    R$ {order.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Mostrando <strong>{orders.length}</strong> de <strong>128</strong> resultados</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-slate-200 rounded bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
                    <button className="px-3 py-1 border border-slate-200 rounded bg-white text-xs font-medium text-slate-600 hover:bg-slate-50">Próximo</button>
                </div>
            </div>
        </div>
    );
};
