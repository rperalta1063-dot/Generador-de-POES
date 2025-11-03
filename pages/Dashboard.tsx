
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, getStatusBadgeClass, getStatusText, formatDateTime } from '../utils/helpers';
import { ClipboardListIcon, Clock, CheckCircle, XCircle } from '../components/Icons';
import { POE, AuditLog } from '../types';

interface DashboardCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => (
    <div className={`p-4 text-white rounded-lg shadow-md ${color}`}>
        <div className="flex justify-between">
            <div>
                <h5 className="text-sm font-medium uppercase">{title}</h5>
                <h2 className="text-3xl font-bold">{value}</h2>
            </div>
            <div className="text-4xl opacity-70">{icon}</div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { poes, auditLog, currentEstablishment } = useApp();

    const establishmentPOEs = useMemo(() => {
        return currentEstablishment ? poes.filter(p => p.establishment === currentEstablishment) : poes;
    }, [poes, currentEstablishment]);

    const stats = useMemo(() => {
        return {
            total: establishmentPOEs.length,
            pending: establishmentPOEs.filter(p => p.status === 'pending').length,
            approved: establishmentPOEs.filter(p => p.status === 'approved').length,
            rejected: establishmentPOEs.filter(p => p.status === 'rejected').length,
        };
    }, [establishmentPOEs]);

    const recentPOEs: POE[] = [...establishmentPOEs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    const recentActivity: AuditLog[] = [...auditLog].slice(0, 10);

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="POEs Totales" value={stats.total} icon={<ClipboardListIcon />} color="bg-blue-500" />
                <DashboardCard title="Pendientes" value={stats.pending} icon={<Clock />} color="bg-yellow-500" />
                <DashboardCard title="Aprobados" value={stats.approved} icon={<CheckCircle />} color="bg-green-500" />
                <DashboardCard title="Rechazados" value={stats.rejected} icon={<XCircle />} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">POEs Recientes</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Título</th>
                                    <th scope="col" className="px-4 py-3">Estado</th>
                                    <th scope="col" className="px-4 py-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPOEs.map(poe => (
                                    <tr key={poe.id} className="bg-white border-b">
                                        <td className="px-4 py-3 font-medium text-gray-900">{poe.title}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(poe.status)}`}>
                                                {getStatusText(poe.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{formatDate(poe.createdAt)}</td>
                                    </tr>
                                ))}
                                {recentPOEs.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4">No hay POEs recientes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Actividad Reciente</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {recentActivity.map(log => (
                            <div key={log.id} className="border-b pb-2">
                                <div className="flex justify-between text-sm">
                                    <strong className="text-gray-800">{log.user}</strong>
                                    <small className="text-gray-500">{formatDateTime(log.timestamp)}</small>
                                </div>
                                <p className="text-sm text-gray-600">{log.action}: {log.details}</p>
                            </div>
                        ))}
                         {recentActivity.length === 0 && (
                            <div className="text-center py-4">No hay actividad reciente.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
