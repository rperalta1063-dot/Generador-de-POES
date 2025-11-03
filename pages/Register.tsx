
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { ClipboardListIcon } from '../components/Icons';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<Role>('operator');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useApp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        try {
            register({ username, email, password, role });
            alert('Usuario registrado exitosamente');
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center">
                 <ClipboardListIcon className="w-12 h-12 text-sky-600"/>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Registro de Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700">Usuario</label>
                    <input id="reg-username" type="text" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="reg-email" type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="reg-password"  className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input id="reg-password" type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="reg-password-confirm" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <input id="reg-password-confirm" type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="reg-role" className="block text-sm font-medium text-gray-700">Rol</label>
                    <select id="reg-role" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                        <option value="operator">Operador</option>
                        <option value="verifier">Verificador</option>
                        <option value="auditor">Auditor</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div>
                    <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        Registrarse
                    </button>
                </div>
            </form>
            <p className="text-sm text-center text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
    );
};

export default Register;
