import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated && user) {
            const target = user.rol?.toUpperCase() === 'ADMIN' ? '/admin' :
                user.rol?.toUpperCase() === 'PROFESIONAL' ? '/profesional' :
                    '/familia';
            navigate(target, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = login(email, password);
        if (!res.success) {
            setError(res.msg || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF5EC] px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="VOCES Logo" className="w-24 h-auto mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-voces">Bienvenido a VOCES</h1>
                    <p className="text-gray-400 mt-2">Ingresa a tu cuenta para gestionar turnos e información.</p>
                </div>

                <div className="bg-gradient-to-br from-[#38312D] to-[#241F1C] md:bg-none md:bg-white p-8 rounded-[40px] shadow-2xl md:shadow-soft border border-white/10 md:border-orange-50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 ml-1 text-white md:text-gray-900">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-2xl text-white md:text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-500"
                                    placeholder="ejemplo@voces.com"
                                    required
                                />
                                <Mail className="absolute left-3 top-4.5 text-gray-400 md:text-gray-300" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 ml-1 text-white md:text-gray-900">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-4 bg-white/5 md:bg-gray-50 border border-white/10 md:border-gray-100 rounded-2xl text-white md:text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-3 top-4.5 text-gray-400 md:text-gray-300" size={18} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-4.5 text-gray-400 md:text-gray-300 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 md:border-gray-50 text-center">
                        <p className="text-xs text-gray-400">
                            ¿No tenés una cuenta? Contactate con administración para el alta personalizada.
                        </p>
                        <div className="mt-6 flex flex-col gap-3">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Acceso Rápido Demo</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <button onClick={() => { setEmail('admin@voces.com'); setPassword('123'); }} className="text-[9px] bg-white/5 md:bg-gray-50 text-gray-400 px-3 py-2 rounded-xl border border-white/5 md:border-transparent hover:bg-primary/20 hover:text-white transition-all">ADMIN</button>
                                <button onClick={() => { setEmail('laura@voces.com'); setPassword('123'); }} className="text-[9px] bg-white/5 md:bg-gray-50 text-gray-400 px-3 py-2 rounded-xl border border-white/5 md:border-transparent hover:bg-primary/20 hover:text-white transition-all">PROFESIONAL</button>
                                <button onClick={() => { setEmail('maria@gmail.com'); setPassword('123'); }} className="text-[9px] bg-white/5 md:bg-gray-50 text-gray-400 px-3 py-2 rounded-xl border border-white/5 md:border-transparent hover:bg-primary/20 hover:text-white transition-all">FAMILIA</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
