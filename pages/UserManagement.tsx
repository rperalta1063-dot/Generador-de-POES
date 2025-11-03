
import React from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import { getRoleName, formatDate } from '../utils/helpers';
import { UserCheck, UserSlash } from '../components/Icons';

const UserManagement: React.FC = () => {
    const { users, updateUser } = useApp();

    const handleToggleUserStatus = (user: User) => {
        const action = user.active ? 'desactivar' : 'activar';
        if (window.confirm(`¿Está seguro de que desea ${action} al usuario ${user.username}?`)) {
            updateUser({ ...user, active: !user.active });
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Usuarios</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Usuario</th>
                                <th scope="col" className="px-4 py-3">Email</th>
                                <th scope="col" className="px-4 py-3">Rol</th>
                                <th scope="col" className="px-4 py-3">Fecha Registro</th>
                                <th scope="col" className="px-4 py-3">Estado</th>
                                <th scope="col" className="px-4 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{getRoleName(user.role)}</td>
                                    <td className="px-4 py-3">{formatDate(user.registered)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleToggleUserStatus(user)} className="text-gray-500 hover:text-gray-700">
                                            {user.active ? <UserSlash /> : <UserCheck />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
