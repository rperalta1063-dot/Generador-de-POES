
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, POE, AuditLog, ToastNotification } from '../types';
import { initialUsers, initialPoes, initialAuditLog } from './initialData';

interface AppContextType {
    currentUser: User | null;
    users: User[];
    poes: POE[];
    auditLog: AuditLog[];
    toastNotifications: ToastNotification[];
    currentEstablishment: string | null;
    login: (username: string, password: string) => User | null;
    logout: () => void;
    register: (user: Omit<User, 'id' | 'registered' | 'active'>) => User | null;
    addAuditLog: (user: string, action: string, details: string) => void;
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    setCurrentEstablishment: (establishment: string | null) => void;
    savePoe: (poe: Omit<POE, 'id'>) => POE;
    updatePoe: (poe: POE) => void;
    deletePoe: (poeId: number) => void;
    updateUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('users');
        return saved ? JSON.parse(saved) : initialUsers;
    });

    const [poes, setPoes] = useState<POE[]>(() => {
        const saved = localStorage.getItem('poes');
        return saved ? JSON.parse(saved) : initialPoes;
    });

    const [auditLog, setAuditLog] = useState<AuditLog[]>(() => {
        const saved = localStorage.getItem('auditLog');
        return saved ? JSON.parse(saved) : initialAuditLog;
    });

    const [currentEstablishment, _setCurrentEstablishment] = useState<string | null>(() => {
        return localStorage.getItem('currentEstablishment') || null;
    });

    const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);
    
    useEffect(() => {
        localStorage.setItem('poes', JSON.stringify(poes));
    }, [poes]);

    useEffect(() => {
        localStorage.setItem('auditLog', JSON.stringify(auditLog));
    }, [auditLog]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const addAuditLog = (user: string, action: string, details: string) => {
        setAuditLog(prevLog => {
            const newLog = {
                id: prevLog.length > 0 ? Math.max(...prevLog.map(l => l.id)) + 1 : 1,
                timestamp: new Date().toISOString(),
                user, action, details
            };
            return [newLog, ...prevLog];
        });
    };

    const addToast = (message: string, type: 'success' | 'error' | 'info') => {
        const id = new Date().getTime();
        const newToast: ToastNotification = { id, message, type };
        setToastNotifications(prev => [...prev, newToast]);

        setTimeout(() => {
            setToastNotifications(prev => prev.filter(t => t.id !== id));
        }, 5000); // Remove after 5 seconds
    };

    const login = (username: string, password: string): User | null => {
        const user = users.find(u => u.username === username && u.password === password && u.active);
        if (user) {
            setCurrentUser(user);
            addAuditLog(user.username, 'Inicio de sesión', 'Usuario inició sesión en el sistema');
            return user;
        }
        return null;
    };

    const logout = () => {
        if(currentUser) {
            addAuditLog(currentUser.username, 'Cierre de sesión', 'Usuario cerró sesión en el sistema');
            setCurrentUser(null);
        }
    };

    const register = (user: Omit<User, 'id' | 'registered' | 'active'>): User | null => {
         if (users.some(u => u.username === user.username)) {
            throw new Error('El nombre de usuario ya existe');
        }
        if (users.some(u => u.email === user.email)) {
             throw new Error('El email ya está registrado');
        }

        const newUser: User = {
            ...user,
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            registered: new Date().toISOString(),
            active: true
        };
        setUsers(prev => [...prev, newUser]);
        addAuditLog('system', 'Registro de usuario', `Nuevo usuario registrado: ${newUser.username}`);
        return newUser;
    };

    const setCurrentEstablishment = (establishment: string | null) => {
        if (establishment) {
            localStorage.setItem('currentEstablishment', establishment);
        } else {
            localStorage.removeItem('currentEstablishment');
        }
        _setCurrentEstablishment(establishment);
    };

    const savePoe = (poeData: Omit<POE, 'id'>): POE => {
        const newPoe: POE = {
            ...poeData,
            id: poes.length > 0 ? Math.max(...poes.map(p => p.id)) + 1 : 1,
        };
        setPoes(prev => [...prev, newPoe]);
        addAuditLog(newPoe.createdBy, 'Crear POE', `POE ID: ${newPoe.id} - ${newPoe.title}`);
        return newPoe;
    };

    const updatePoe = (updatedPoe: POE) => {
        setPoes(prev => prev.map(p => p.id === updatedPoe.id ? updatedPoe : p));
    };
    
    const deletePoe = (poeId: number) => {
        const poeToDelete = poes.find(p => p.id === poeId);
        if(poeToDelete && currentUser) {
            setPoes(prev => prev.filter(p => p.id !== poeId));
            addAuditLog(currentUser.username, 'Eliminar POE', `POE ID: ${poeId} - ${poeToDelete.title}`);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if(currentUser) {
            addAuditLog(currentUser.username, updatedUser.active ? 'Activar usuario' : 'Desactivar usuario', `Usuario: ${updatedUser.username}`);
        }
    };

    return (
        <AppContext.Provider value={{ currentUser, users, poes, auditLog, toastNotifications, currentEstablishment, login, logout, register, addAuditLog, addToast, setCurrentEstablishment, savePoe, updatePoe, deletePoe, updateUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
