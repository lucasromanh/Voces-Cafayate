import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import {
    Calendar, FileText, Download, Send, MessageSquare,
    Bell, User, ChevronRight, Clock, Star, DownloadCloud,
    AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import { mockObrasSociales } from '../../mockData';

const FamilyPortal = () => {
    const { user } = useAuth();
    const { pacientes, turnos, informes, profesionales, usuarios } = useData();
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    // Find child(ren) for this tutor
    const myChildren = pacientes.filter(p => p.tutorPrincipalId === user?.id);
    const selectedChild = myChildren[0]; // For simplicity, take the first one

    const childTurnos = turnos.filter(t => t.pacienteId === selectedChild?.id).sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
    const childInformes = informes.filter(i => i.pacienteId === selectedChild?.id && i.visibleParaFamilia);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setSending(true);
        // Simulate API delay
        setTimeout(() => {
            setSending(false);
            setMessage('');
            alert("¡Mensaje enviado correctamente! El equipo técnico o el profesional asignado te responderá pronto.");
        }, 1500);
    };

    const downloadReport = (reportType: string) => {
        alert(`Generando archivo PDF para "${reportType.replace(/_/g, ' ')}"... Se descargará en unos segundos.`);
    };

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Hero Profile Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 p-8 md:p-12 text-white shadow-2xl shadow-gray-200">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-5xl font-black shadow-xl shadow-primary/30">
                        {selectedChild?.nombre[0]}{selectedChild?.apellido[0]}
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-2">Portal de Familia</h4>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
                            {selectedChild?.nombre} {selectedChild?.apellido}
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10">
                                DNI: {selectedChild?.documento}
                            </span>
                            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 uppercase">
                                {mockObrasSociales.find(os => os.id === selectedChild?.obrasSociales[0])?.nombre || 'Particular'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Appointments Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Clock size={24} />
                                </div>
                                Próximas Citas
                            </h3>
                            <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Ver Historial</button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {childTurnos.length > 0 ? (
                                childTurnos.map(t => {
                                    const pro = profesionales.find(p => p.id === t.profesionalId);
                                    const proUser = usuarios.find(u => u.id === pro?.usuarioId);
                                    const date = new Date(t.fechaHora);
                                    return (
                                        <div key={t.id} className="group flex flex-col sm:flex-row items-center bg-white p-6 rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 shadow-xl shadow-gray-100/50 transition-all">
                                            <div className="flex-1 flex items-center gap-6 w-full">
                                                <div className="text-center min-w-[80px] bg-gray-50 p-4 rounded-3xl">
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">
                                                        {date.toLocaleDateString('es-AR', { month: 'short' })}
                                                    </p>
                                                    <p className="text-2xl font-black text-gray-900 leading-none">{date.getDate()}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-lg text-gray-800">{proUser?.nombre} {proUser?.apellido}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black bg-primary/5 text-primary px-2 py-0.5 rounded-md uppercase">{pro?.especialidad}</span>
                                                        <span className="text-xs text-gray-400 font-bold">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0 flex items-center gap-4 w-full sm:w-auto sm:justify-end">
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${t.estado === 'CONFIRMADO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-primary'
                                                        }`}>
                                                        {t.estado}
                                                    </span>
                                                    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase mr-2">{t.modo}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-300 group-hover:text-primary transition-colors">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-20 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                                    <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No hay turnos programados</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reports Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <FileText size={24} />
                                </div>
                                Informes Clínicos
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {childInformes.length > 0 ? (
                                childInformes.map(inf => (
                                    <div key={inf.id} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(inf.fecha).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-black text-xl text-gray-900 mb-2 leading-tight uppercase tracking-tighter">
                                                {inf.tipo.replace(/_/g, ' ')}
                                            </h4>
                                            <p className="text-sm text-gray-500 font-medium line-clamp-3 mb-8">
                                                {inf.resumen || "Resumen del encuentro clínico y avances terapéuticos."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => downloadReport(inf.tipo)}
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all group"
                                        >
                                            <DownloadCloud size={18} className="group-hover:-translate-y-1 transition-transform" />
                                            <span>Descargar PDF</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="md:col-span-2 p-16 text-center bg-gray-50 rounded-[3rem]">
                                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Aún no hay informes procesados para visualizar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Contact Section */}
                    <div className="bg-gray-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400" />
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <MessageSquare className="text-primary" size={24} />
                            Consulta al Equipo
                        </h3>
                        <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">
                            Envía tus dudas sobre el tratamiento del niño/a. El equipo profesional te responderá a la brevedad.
                        </p>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                                className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-sm outline-none focus:bg-white/10 focus:border-primary transition-all min-h-[160px] resize-none"
                            />
                            <button
                                disabled={sending || !message.trim()}
                                className="w-full group bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-primary py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20"
                            >
                                <span className="font-black text-xs uppercase tracking-widest">
                                    {sending ? 'Enviando...' : 'Enviar Mensaje'}
                                </span>
                                {!sending && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </button>
                        </form>
                    </div>

                    {/* Important Info Card */}
                    <div className="bg-orange-50 rounded-[2.5rem] p-8 border-2 border-orange-100">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <AlertCircle size={24} />
                            <h4 className="font-black text-xs uppercase tracking-[0.2em]">Recordatorios</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="mt-1"><CheckCircle2 size={16} className="text-green-500" /></div>
                                <p className="text-xs text-orange-900 font-bold leading-relaxed">
                                    Avisar con 24hs de anticipación si no puede asistir al turno.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1"><Info size={16} className="text-blue-500" /></div>
                                <p className="text-xs text-orange-900 font-bold leading-relaxed">
                                    Hoy hay taller de padres a las 18:00 hs.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Support Info */}
                    <div className="px-4 py-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                            <Star size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Atención Directa</p>
                            <p className="text-sm font-black text-gray-800">Soporte WhatsApp Voces</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyPortal;
