import React, { useState } from 'react';
import {
    CreditCard,
    Users,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    User,
    BarChart3
} from 'lucide-react';

interface SidebarProps {
    currentEvent: string;
    onEventChange: (event: string) => void;
}

const EVENTS = [
    { id: 'workshop', label: 'Workshop Scale', icon: Users },
    { id: 'summit', label: 'Scale Summit', icon: Calendar },
    { id: 'program', label: 'Program Scale', icon: BarChart3 },
    { id: 'club', label: 'Scale Club', icon: CreditCard },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentEvent, onEventChange }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <div
            className={`h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} border-r border-slate-800`}
        >
            {/* Brand / Logo Area */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                {!collapsed && (
                    <span className="font-bold text-xl tracking-tight text-white">
                        Scale<span className="text-red-600">Dashboard</span>
                    </span>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-6 space-y-2 px-2">
                {EVENTS.map((event) => {
                    const Icon = event.icon;
                    const isActive = currentEvent === event.id;
                    return (
                        <button
                            key={event.id}
                            onClick={() => onEventChange(event.id)}
                            className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors group relative
                ${isActive ? 'bg-red-600/10 text-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
                        >
                            <Icon size={20} className={isActive ? 'text-red-500' : 'text-slate-400 group-hover:text-white'} />

                            {!collapsed && (
                                <span className="ml-3 font-medium text-sm">{event.label}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 w-max px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                    {event.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-slate-800 relative">
                <button
                    className="flex items-center w-full"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                        <span className="text-sm font-bold text-white">US</span>
                    </div>
                    {!collapsed && (
                        <div className="ml-3 text-left">
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-slate-500">admin@scale.com</p>
                        </div>
                    )}
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                    <div className="absolute bottom-full left-4 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-48 mb-2 overflow-hidden z-50">
                        <button className="w-full text-left px-4 py-3 hover:bg-slate-700 text-sm text-slate-200 flex items-center">
                            <User size={16} className="mr-2" /> Editar Perfil
                        </button>
                        <button className="w-full text-left px-4 py-3 hover:bg-slate-700 text-sm text-slate-200 flex items-center">
                            <Settings size={16} className="mr-2" /> Configurações
                        </button>
                        <div className="border-t border-slate-700 my-0"></div>
                        <button className="w-full text-left px-4 py-3 hover:bg-slate-700 text-sm text-red-400 flex items-center">
                            <LogOut size={16} className="mr-2" /> Sair
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
