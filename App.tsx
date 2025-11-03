
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PoeList from './pages/PoeList';
import CreatePoe from './pages/CreatePoe';
import Approvals from './pages/Approvals';
import Audit from './pages/Audit';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from './components/ToastNotifications';

const App: React.FC = () => {
    return (
        <AppProvider>
            <MainRouter />
        </AppProvider>
    );
};

const MainRouter: React.FC = () => {
    const { currentUser } = useApp();

    return (
        <HashRouter>
            <Routes>
                {currentUser ? (
                    <Route path="/*" element={<PrivateRoutes />} />
                ) : (
                    <Route path="/*" element={<PublicRoutes />} />
                )}
            </Routes>
        </HashRouter>
    );
};

const PrivateRoutes: React.FC = () => {
    const { currentUser } = useApp();
    const role = currentUser?.role;

    // Define permissions based on roles
    const canCreatePoe = role === 'admin' || role === 'verifier' || role === 'operator';
    const canEditPoe = role === 'admin' || role === 'verifier';
    const isAdmin = role === 'admin';

    return (
        <>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/poe-list" element={<PoeList />} />
                            <Route path="/audit" element={<Audit />} />

                            {/* Role-based routes */}
                            {canCreatePoe && <Route path="/create-poe" element={<CreatePoe />} />}
                            {canEditPoe && <Route path="/edit-poe/:id" element={<CreatePoe />} />}
                            {isAdmin && <Route path="/approvals" element={<Approvals />} />}
                            {isAdmin && <Route path="/user-management" element={<UserManagement />} />}

                            {/* Fallback route */}
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </main>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};


const PublicRoutes: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
};


export default App;
