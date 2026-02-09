import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import { mockUsuarios } from '../mockData';

interface AuthContextType {
    user: Usuario | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => { success: boolean, msg?: string };
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(() => {
        const saved = localStorage.getItem('voces_auth_user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    useEffect(() => {
        console.log('VOCES-AUTH: Current User State:', user);
    }, [user]);

    const login = (email: string, password: string) => {
        console.log('VOCES-AUTH: Attempting login for:', email);
        const found = mockUsuarios.find(u => u.email === email);
        if (found) {
            setUser(found);
            localStorage.setItem('voces_auth_user', JSON.stringify(found));
            console.log('VOCES-AUTH: Login successful:', found.rol);
            return { success: true };
        }
        console.warn('VOCES-AUTH: Login failed - invalid credentials');
        return { success: false, msg: 'Credenciales inválidas' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('voces_auth_user');
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
