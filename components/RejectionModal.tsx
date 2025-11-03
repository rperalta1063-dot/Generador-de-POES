import React, { useState, ReactNode } from 'react';
import { XCircle } from './Icons';

interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title: string;
    children: ReactNode;
    confirmText?: string;
    cancelText?: string;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    children, 
    confirmText = 'Confirmar Rechazo', 
    cancelText = 'Cancelar' 
}) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;
    
    const handleConfirm = () => {
        if (!reason.trim()) {
            setError('El motivo del rechazo es obligatorio.');
            return;
        }
        onConfirm(reason);
        setReason('');
        setError('');
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
                <div className="p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                {children}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700">
                                    Motivo del Rechazo
                                </label>
                                <textarea
                                    id="rejection-reason"
                                    rows={3}
                                    className={`mt-1 block w-full rounded-md shadow-sm ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}
                                    value={reason}
                                    onChange={(e) => {
                                        setReason(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={handleClose}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;