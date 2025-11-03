import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PoeStatus, POE } from '../types';
import { getStatusBadgeClass, getStatusText, formatDate } from '../utils/helpers';
import { EyeIcon, EditIcon, TrashIcon, History } from '../components/Icons';
import PoeDetailModal from '../components/PoeDetailModal';
import VersionHistoryModal from '../components/VersionHistoryModal';
import ConfirmationModal from '../components/ConfirmationModal';

const PoeList: React.FC = () => {
    const { poes, currentEstablishment, currentUser, deletePoe, addToast } = useApp();
    const [filter, setFilter] = useState<PoeStatus | 'all'>('all');
    const [selectedPoe, setSelectedPoe] = useState<POE | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [poeForAction, setPoeForAction] = useState<POE | null>(null);
    const navigate = useNavigate();

    const filteredPoes = useMemo(() => {
        let establishmentPOEs = currentEstablishment ? poes.filter(p => p.establishment === currentEstablishment) : poes;
        if (filter === 'all') {
            return establishmentPOEs;
        }
        return establishmentPOEs.filter(p => p.status === filter);
    }, [poes, currentEstablishment, filter]);

    const handleView = (poe: POE) => {
        setSelectedPoe(poe);
        setIsDetailModalOpen(true);
    };
    
    const handleHistory = (poe: POE) => {
        setSelectedPoe(poe);
        setIsHistoryModalOpen(true);
    };
    
    const handleEdit = (poeId: number) => {
        navigate(`/edit-poe/${poeId}`);
    }

    const handleDelete = (poeToDelete: POE) => {
        setPoeForAction(poeToDelete);
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        if(poeForAction) {
            deletePoe(poeForAction.id);
            addToast('POE eliminado exitosamente.', 'success');
            setIsDeleteModalOpen(false);
            setPoeForAction(null);
        }
    }

    const filters: { label: string; value: PoeStatus | 'all' }[] = [
        { label: 'Todos', value: 'all' },
        { label: 'Pendientes', value: 'pending' },
        { label: 'Aprobados', value: 'approved' },
        { label: 'Rechazados', value: 'rejected' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Lista de POEs</h1>
                <div className="flex space-x-2 p-1 bg-gray-200 rounded-lg">
                    {filters.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                filter === f.value ? 'bg-white text-gray-800 shadow' : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">ID</th>
                                <th scope="col" className="px-4 py-3">Código</th>
                                <th scope="col" className="px-4 py-3">Título</th>
                                <th scope="col" className="px-4 py-3">Establecimiento</th>
                                <th scope="col" className="px-4 py-3">Versión</th>
                                <th scope="col" className="px-4 py-3">Estado</th>
                                <th scope="col" className="px-4 py-3">Creado por</th>
                                <th scope="col" className="px-4 py-3">Fecha creación</th>
                                <th scope="col" className="px-4 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPoes.map(poe => (
                                <tr key={poe.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{poe.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{poe.code}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{poe.title}</td>
                                    <td className="px-4 py-3">{poe.establishment}</td>
                                    <td className="px-4 py-3">v{poe.version}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(poe.status)}`}>
                                            {getStatusText(poe.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{poe.createdBy}</td>
                                    <td className="px-4 py-3">{formatDate(poe.createdAt)}</td>
                                    <td className="px-4 py-3 flex items-center space-x-2">
                                        <button onClick={() => handleView(poe)} className="text-blue-600 hover:text-blue-800"><EyeIcon /></button>
                                        <button onClick={() => handleHistory(poe)} className="text-purple-600 hover:text-purple-800"><History /></button>
                                        {(currentUser?.role === 'admin' || currentUser?.role === 'verifier') && (
                                            <button onClick={() => handleEdit(poe.id)} className="text-yellow-600 hover:text-yellow-800"><EditIcon /></button>
                                        )}
                                        {currentUser?.role === 'admin' && (
                                            <button onClick={() => handleDelete(poe)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-[18px] h-[18px]" /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredPoes.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-4">No se encontraron POEs.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedPoe && <PoeDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} poe={selectedPoe} />}
            {selectedPoe && <VersionHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} poe={selectedPoe} />}
            
            {poeForAction && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => { setIsDeleteModalOpen(false); setPoeForAction(null); }}
                    onConfirm={confirmDelete}
                    title="Confirmar Eliminación"
                    confirmText="Sí, Eliminar"
                    variant="danger"
                    icon={<TrashIcon className="h-6 w-6 text-red-600" />}
                    iconBgClass="bg-red-100"
                >
                    <p className="text-sm text-gray-600">
                        ¿Está seguro de que desea eliminar el POE "{poeForAction.title}"?
                        <br /><br />
                        <span className="font-semibold text-red-700">Esta acción no se puede deshacer.</span>
                    </p>
                </ConfirmationModal>
            )}
        </div>
    );
};

export default PoeList;