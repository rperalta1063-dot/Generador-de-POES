
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRoleName } from '../utils/helpers';
import { LogOutIcon } from './Icons';

const Navbar: React.FC = () => {
    const { currentUser, logout, poes, currentEstablishment, setCurrentEstablishment } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const establishmentNames = useMemo(() => {
        return [...new Set(poes.map(p => p.establishment))].sort();
    }, [poes]);

    const handleEstablishmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'new') {
            const newEst = prompt('Ingrese el nombre del nuevo establecimiento:');
            if (newEst && newEst.trim() !== '') {
                setCurrentEstablishment(newEst.trim());
            }
        } else if (value === 'all') {
            setCurrentEstablishment(null);
        } else {
            setCurrentEstablishment(value);
        }
    };

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <select
                    id="establishment-selector"
                    className="form-select block w-full md:w-64 mt-1 rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50 text-sm"
                    value={currentEstablishment || 'all'}
                    onChange={handleEstablishmentChange}
                >
                    <option value="all">Todos los Establecimientos</option>
                    <option value="new" className="text-sky-600 font-semibold">Crear Nuevo Establecimiento...</option>
                    <option disabled>--------------------</option>
                    {establishmentNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center">
                <div className="text-right mr-4">
                    <div className="font-semibold text-gray-800">{currentUser?.username}</div>
                    <div className="text-xs text-gray-500">{currentUser ? getRoleName(currentUser.role) : ''}</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
                >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
};

export default Navbar;
