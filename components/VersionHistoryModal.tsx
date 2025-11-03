
import React from 'react';
import { POE } from '../types';
import { formatDateTime } from '../utils/helpers';
import { XIcon } from './Icons';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    poe: POE;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ isOpen, onClose, poe }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Historial de Versiones: {poe.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {poe.history.map((record, index) => (
                            <div key={index} className="border-b pb-3">
                                <div className="flex justify-between text-sm">
                                    <strong className="text-gray-800">Versión {record.version}</strong>
                                    <small className="text-gray-500">{formatDateTime(record.changeDate)}</small>
                                </div>
                                <p className="text-sm text-gray-600"><strong>Modificado por:</strong> {record.changedBy}</p>
                                <p className="text-sm text-gray-600"><strong>Cambios:</strong> {record.changes}</p>
                            </div>
                        ))}
                         {poe.history.length === 0 && (
                            <div className="text-center py-4">No hay historial de versiones.</div>
                         )}
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default VersionHistoryModal;
