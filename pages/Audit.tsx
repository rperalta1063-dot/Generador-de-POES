
import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/helpers';

const Audit: React.FC = () => {
    const { auditLog } = useApp();

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Registro de Auditoría</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Fecha/Hora</th>
                                <th scope="col" className="px-4 py-3">Usuario</th>
                                <th scope="col" className="px-4 py-3">Acción</th>
                                <th scope="col" className="px-4 py-3">Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditLog.map(log => (
                                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{formatDateTime(log.timestamp)}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{log.user}</td>
                                    <td className="px-4 py-3">{log.action}</td>
                                    <td className="px-4 py-3">{log.details}</td>
                                </tr>
                            ))}
                             {auditLog.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">No hay registros de auditoría.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Audit;
