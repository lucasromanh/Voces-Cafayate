import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="VOCES Logo" className="h-12 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                        {!isAuthenticated ? (
                            <Link to="/login" className="btn-primary">Ingreso</Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={user?.rol === 'ADMIN' ? '/admin' : user?.rol === 'PROFESIONAL' ? '/profesional' : '/familia'}
                                    className="flex items-center space-x-2 text-gray-voces hover:text-primary transition-colors"
                                >
                                    <User size={18} />
                                    <span>{user?.nombre}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-voces">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-600" onClick={() => setIsOpen(false)}>Inicio</Link>
                        {!isAuthenticated ? (
                            <Link to="/login" className="block px-3 py-2 btn-primary text-center" onClick={() => setIsOpen(false)}>Ingreso</Link>
                        ) : (
                            <>
                                <Link
                                    to={user?.rol?.toUpperCase() === 'ADMIN' ? '/admin' : user?.rol?.toUpperCase() === 'PROFESIONAL' ? '/profesional' : '/familia'}
                                    className="block px-3 py-4 text-base font-black text-primary bg-primary/5 rounded-2xl flex items-center gap-3 transition-all active:scale-95"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center border border-primary/20">
                                        <User size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="leading-tight">{user?.nombre} {user?.apellido}</span>
                                        <span className="text-[10px] uppercase tracking-widest opacity-60">Ver Mi Panel</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="block w-full text-left px-3 py-3 text-base font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
