
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ClipboardListIcon, LayoutDashboard, CheckCircle, PlusCircle, History, Users } from './Icons';

const Sidebar: React.FC = () => {
    const { currentUser } = useApp();

    const allNavItems = [
        { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', roles: ['admin', 'verifier', 'operator', 'auditor'] },
        { to: '/poe-list', icon: <ClipboardListIcon className="w-5 h-5" />, label: 'Lista de POEs', roles: ['admin', 'verifier', 'operator', 'auditor'] },
        { to: '/create-poe', icon: <PlusCircle className="w-5 h-5" />, label: 'Crear POE', roles: ['admin', 'verifier', 'operator'] },
        { to: '/approvals', icon: <CheckCircle className="w-5 h-5" />, label: 'Aprobaciones', roles: ['admin'] },
        { to: '/audit', icon: <History className="w-5 h-5" />, label: 'Auditoría', roles: ['admin', 'verifier', 'operator', 'auditor'] },
        { to: '/user-management', icon: <Users className="w-5 h-5" />, label: 'Gestión de Usuarios', roles: ['admin'] }
    ];

    const visibleNavItems = allNavItems.filter(item =>
        currentUser && item.roles.includes(currentUser.role)
    );

    const navLinkClasses = "flex items-center px-4 py-2 text-gray-200 rounded-md hover:bg-gray-700 transition-colors";
    const activeNavLinkClasses = "bg-sky-600 text-white";

    return (
        <div className="hidden md:flex flex-col w-64 bg-gray-800">
            <div className="flex items-center justify-center h-16 bg-gray-900">
                 <ClipboardListIcon className="w-8 h-8 text-sky-500"/>
                <span className="text-white font-bold uppercase ml-2">Sistema POEs</span>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-2 py-4">
                    {visibleNavItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
                            }
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
