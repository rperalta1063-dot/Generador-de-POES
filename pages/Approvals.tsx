import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { POE } from '../types';
import { formatDate } from '../utils/helpers';
import { EyeIcon, CheckIcon, XIcon, CheckCircle } from '../components/Icons';
import PoeDetailModal from '../components/PoeDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';
import RejectionModal from '../components/RejectionModal';

const Approvals: React.FC = () => {
    const { poes, currentEstablishment, updatePoe, addAuditLog, currentUser, addToast } = useApp();
    const [selectedPoe, setSelectedPoe] = useState<POE | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [poeForAction, setPoeForAction] = useState<POE | null>(null);

    const pendingPOEs = useMemo(() => {
        return (currentEstablishment ? poes.filter(p => p.establishment === currentEstablishment) : poes)
            .filter(p => p.status === 'pending');
    }, [poes, currentEstablishment]);

    const openApproveModal = (poe: POE) => {
        setPoeForAction(poe);
        setIsApproveModalOpen(true);
    };

    const openRejectModal = (poe: POE) => {
        setPoeForAction(poe);
        setIsRejectModalOpen(true);
    };

    const confirmApprove = () => {
        if (!currentUser || !poeForAction) {
            addToast("Error: No se pudo realizar la acción. Usuario o POE no encontrado.", 'error');
            setIsApproveModalOpen(false);
            return;
        }

        const updatedPoe: POE = {
            ...poeForAction,
            status: 'approved',
            approvedBy: currentUser.username,
            approvedAt: new Date().toISOString(),
            history: [
                ...poeForAction.history,
                {
                    version: poeForAction.version,
                    changedBy: currentUser.username,
                    changeDate: new Date().toISOString(),
                    changes: 'POE aprobado',
                },
            ],
        };
        updatePoe(updatedPoe);
        addAuditLog(currentUser.username, 'Aprobar POE', `POE ID: ${updatedPoe.id} - ${updatedPoe.title}`);
        addToast('POE aprobado exitosamente.', 'success');

        setIsApproveModalOpen(false);
        setPoeForAction(null);
    };

    const confirmReject = (reason: string) => {
         if (!currentUser || !poeForAction) {
            addToast("Error: No se pudo realizar la acción. Usuario o POE no encontrado.", 'error');
            setIsRejectModalOpen(false);
            return;
        }

        const updatedPoe: POE = {
            ...poeForAction,
            status: 'rejected',
            approvedBy: null,
            approvedAt: null,
            history: [
                ...poeForAction.history,
                {
                    version: poeForAction.version,
                    changedBy: currentUser.username,
                    changeDate: new Date().toISOString(),
                    changes: `POE rechazado. Motivo: ${reason.trim()}`,
                },
            ],
        };
        updatePoe(updatedPoe);
        addAuditLog(currentUser.username, 'Rechazar POE', `POE ID: ${updatedPoe.id} - ${updatedPoe.title}. Motivo: ${reason.trim()}`);
        addToast('POE rechazado exitosamente.', 'info');

        setIsRejectModalOpen(false);
        setPoeForAction(null);
    };


    const handleView = (poe: POE) => {
        setSelectedPoe(poe);
        setIsDetailModalOpen(true);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Aprobaciones Pendientes</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">ID</th>
                                <th scope="col" className="px-4 py-3">Título</th>
                                <th scope="col" className="px-4 py-3">Establecimiento</th>
                                <th scope="col" className="px-4 py-3">Versión</th>
                                <th scope="col" className="px-4 py-3">Creado por</th>
                                <th scope="col" className="px-4 py-3">Fecha creación</th>
                                <th scope="col" className="px-4 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPOEs.map(poe => (
                                <tr key={poe.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{poe.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{poe.title}</td>
                                    <td className="px-4 py-3">{poe.establishment}</td>
                                    <td className="px-4 py-3">v{poe.version}</td>
                                    <td className="px-4 py-3">{poe.createdBy}</td>
                                    <td className="px-4 py-3">{formatDate(poe.createdAt)}</td>
                                    <td className="px-4 py-3 flex items-center space-x-2">
                                        <button onClick={() => openApproveModal(poe)} className="flex items-center text-sm text-green-600 bg-green-100 hover:bg-green-200 px-2 py-1 rounded-md">
                                            <CheckIcon className="w-4 h-4 mr-1"/> Aprobar
                                        </button>
                                        <button onClick={() => openRejectModal(poe)} className="flex items-center text-sm text-red-600 bg-red-100 hover:bg-red-200 px-2 py-1 rounded-md">
                                            <XIcon className="w-4 h-4 mr-1"/> Rechazar
                                        </button>
                                        <button onClick={() => handleView(poe)} className="text-blue-600 hover:text-blue-800"><EyeIcon /></button>
                                    </td>
                                </tr>
                            ))}
                            {pendingPOEs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">No hay POEs pendientes de aprobación.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedPoe && <PoeDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} poe={selectedPoe} />}
            
            <ConfirmationModal
                isOpen={isApproveModalOpen}
                onClose={() => { setIsApproveModalOpen(false); setPoeForAction(null); }}
                onConfirm={confirmApprove}
                title="Confirmar Aprobación"
                confirmText="Sí, Aprobar"
                icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                iconBgClass="bg-green-100"
            >
                <p className="text-sm text-gray-600">
                    ¿Está seguro de que desea aprobar el POE "{poeForAction?.title}"?
                </p>
            </ConfirmationModal>

            {poeForAction && (
                <RejectionModal
                    isOpen={isRejectModalOpen}
                    onClose={() => { setIsRejectModalOpen(false); setPoeForAction(null); }}
                    onConfirm={confirmReject}
                    title="Confirmar Rechazo"
                >
                    <p className="text-sm text-gray-600">
                        Está a punto de rechazar el POE "{poeForAction.title}".
                    </p>
                </RejectionModal>
            )}
        </div>
    );
};

export default Approvals;