
import { PoeStatus, Role } from '../types';

export const getRoleName = (role: Role): string => {
    const roles: { [key in Role]: string } = {
        'operator': 'Operador',
        'verifier': 'Verificador',
        'auditor': 'Auditor',
        'admin': 'Administrador'
    };
    return roles[role] || role;
};

export const getStatusText = (status: PoeStatus): string => {
    const statuses: { [key in PoeStatus]: string } = {
        'draft': 'Borrador',
        'pending': 'Pendiente',
        'approved': 'Aprobado',
        'rejected': 'Rechazado'
    };
    return statuses[status] || status;
};

export const getStatusBadgeClass = (status: PoeStatus): string => {
    const classes: { [key in PoeStatus]: string } = {
        'draft': 'bg-gray-500 text-white',
        'pending': 'bg-yellow-500 text-white',
        'approved': 'bg-green-600 text-white',
        'rejected': 'bg-red-600 text-white'
    };
    return classes[status] || 'bg-gray-500 text-white';
};

export const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    } catch (e) {
        return 'Fecha inválida';
    }
};

export const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
     try {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES');
    } catch (e) {
        return 'Fecha inválida';
    }
};
