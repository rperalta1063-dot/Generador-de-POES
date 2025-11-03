
import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, InfoIcon } from './Icons';

export const ToastContainer: React.FC = () => {
    const { toastNotifications } = useApp();

    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-xs space-y-3">
            {toastNotifications.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} />
            ))}
        </div>
    );
};

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
    const baseClasses = 'flex items-center w-full max-w-xs p-4 text-gray-600 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5';

    const typeDetails = {
        success: {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            style: 'border-l-4 border-green-500'
        },
        error: {
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            style: 'border-l-4 border-red-500'
        },
        info: {
            icon: <InfoIcon className="w-6 h-6 text-blue-500" />,
            style: 'border-l-4 border-blue-500'
        },
    };

    return (
        <div className={`${baseClasses} ${typeDetails[type].style}`} role="alert">
            <div className="flex-shrink-0">
                {typeDetails[type].icon}
            </div>
            <div className="ml-3 text-sm font-medium text-gray-800">{message}</div>
        </div>
    );
};
