
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ClipboardListIcon } from '../components/Icons';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useApp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = login(username, password);
        if (user) {
            navigate('/dashboard');
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center">
                 <ClipboardListIcon className="w-12 h-12 text-sky-600"/>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
                    <input
                        id="username"
                        type="text"
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div>
                    <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        Iniciar Sesión
                    </button>
                </div>
            </form>
            <p className="text-sm text-center text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="font-medium text-sky-600 hover:text-sky-500">
                    Regístrate aquí
                </Link>
            </p>
        </div>
    );
};

export default Login;
