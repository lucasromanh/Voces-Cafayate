import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import {
    CheckCircle2, Circle, Clock, FileText, UserPlus, ClipboardList,
    X, Plus, Calendar, Users, Activity, TrendingUp, AlertCircle,
    ChevronRight, Eye, Edit3, Save, Download, Image as ImageIcon
} from 'lucide-react';
import { Paciente, Especialidad } from '../../types';
import CalendarComponent, { Turno as CalendarTurno } from '../../components/Calendar';
import InformeForm from '../../components/InformeForm';
import { useToast } from '../../context/ToastContext';

const ProfessionalDashboard = () => {
    const { user } = useAuth();
    const { turnos, pacientes, updateTurnoEstado, seguimientos, toggleSeguimiento, addInforme, informes, addPaciente, addTurno, talleres, addTaller, addDocumentoTaller } = useData();
    const { showToast } = useToast();

    // UI State
    const [activeTab, setActiveTab] = useState<'agenda' | 'calendar' | 'patients' | 'reports' | 'workshops'>('agenda');
    const [showInformeModal, setShowInformeModal] = useState(false);
    const [showNewPacienteModal, setShowNewPacienteModal] = useState(false);
    const [selectedPacienteForReport, setSelectedPacienteForReport] = useState<string>('');
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState<string | null>(null);
    const [selectedPacienteDetail, setSelectedPacienteDetail] = useState<Paciente | null>(null);
    const [selectedTallerDetail, setSelectedTallerDetail] = useState<any | null>(null);
    const [showNewTallerModal, setShowNewTallerModal] = useState(false);
    const [newTallerForm, setNewTallerForm] = useState({
        nombre: '', descripcion: '', orientadoA: '',
        fechaHora: '', cupoMaximo: 10, profesionalesResponsables: [user?.id || ''],
        inscritos: [], estado: 'PROPUESTO' as any, creadoPorId: user?.id || ''
    });

    // New Patient Form
    const [newPacienteForm, setNewPacienteForm] = useState({
        nombre: '', apellido: '', documento: '', fechaNacimiento: '',
        tieneCUD: false, numeroCUD: '', diagnosticoPrincipal: '',
        escolaridad: '', escuelaNombre: '', escuelaTurno: 'MAÑANA' as any,
        tutorPrincipalId: 'u4',
        tutorSecundarioNombre: '', tutorSecundarioParentesco: '', tutorSecundarioTelefono: '',
        obrasSociales: ['os1'], notasRelevantes: '',
        discapacidadFisica: false, discapacidadFisicaDetalle: '',
        retrasoDesarrollo: false, retrasoDesarrolloDetalle: '',
        hermanos: '', composicionFamiliar: '', telefonoEmergencia: ''
    });

    // Filter data for this professional
    const proId = 'p1'; // Mocking current professional as p1 (Laura - Psicología)
    const profesionalEspecialidad = 'Psicología' as Especialidad; // En producción, obtener de la BD
    const myTurnos = turnos.filter(t => t.profesionalId === proId).sort((a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );
    const myPacientes = pacientes; // In real app, filter by professional's
    const myInformes = informes.filter(i => i.creadoPorProfesionalId === proId);

    const todayTurnos = myTurnos.filter(t => {
        const turnoDate = new Date(t.fechaHora);
        const today = new Date();
        return turnoDate.toDateString() === today.toDateString();
    });

    const handleAddPaciente = (e: React.FormEvent) => {
        e.preventDefault();
        addPaciente(newPacienteForm);
        setShowNewPacienteModal(false);
        setNewPacienteForm({
            nombre: '', apellido: '', documento: '', fechaNacimiento: '',
            tieneCUD: false, numeroCUD: '', diagnosticoPrincipal: '',
            escolaridad: '', escuelaNombre: '', escuelaTurno: 'MAÑANA' as any,
            tutorPrincipalId: 'u4',
            tutorSecundarioNombre: '', tutorSecundarioParentesco: '', tutorSecundarioTelefono: '',
            obrasSociales: ['os1'], notasRelevantes: '',
            discapacidadFisica: false, discapacidadFisicaDetalle: '',
            retrasoDesarrollo: false, retrasoDesarrolloDetalle: '',
            hermanos: '', composicionFamiliar: '', telefonoEmergencia: ''
        });
        showToast("Paciente agregado exitosamente", "success");
    };

    const handleProposeTaller = (e: React.FormEvent) => {
        e.preventDefault();
        addTaller(newTallerForm);
        setShowNewTallerModal(false);
        setNewTallerForm({
            nombre: '', descripcion: '', orientadoA: '',
            fechaHora: '', cupoMaximo: 10, profesionalesResponsables: [user?.id || ''],
            inscritos: [], estado: 'PROPUESTO' as any, creadoPorId: user?.id || ''
        });
        showToast("Propuesta de taller enviada para aprobación", "success");
    };

    const handleAddInforme = (informeData: any) => {
        addInforme({
            ...informeData,
            id: `inf${Date.now()}`,
            creadoPorProfesionalId: proId,
            coProfesionalesIds: informeData.coProfesionalesIds || []
        });

        setShowInformeModal(false);
        setSelectedPacienteForReport('');
        showToast("Informe guardado exitosamente", "success");
    };

    // Sincronizar el detalle del taller cuando los datos globales cambian (muy importante para archivos)
    React.useEffect(() => {
        if (selectedTallerDetail) {
            const current = talleres.find(t => t.id === selectedTallerDetail.id);
            if (current && JSON.stringify(current.documentos) !== JSON.stringify(selectedTallerDetail.documentos)) {
                setSelectedTallerDetail(JSON.parse(JSON.stringify(current))); // Deep clone to trigger re-render
            }
        }
    }, [talleres, selectedTallerDetail?.id]); // Escuchar cambios en talleres o si cambia el ID seleccionado

    // Calendar Turnos State - Convert existing turnos to calendar format using useMemo
    const calendarTurnos = React.useMemo<CalendarTurno[]>(() => {
        return myTurnos.map(t => {
            const fecha = new Date(t.fechaHora);
            const horaInicio = fecha.toTimeString().slice(0, 5);
            const horaFin = new Date(fecha.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5); // +1 hour
            const paciente = pacientes.find(p => p.id === t.pacienteId);

            return {
                id: t.id,
                pacienteId: t.pacienteId,
                pacienteNombre: paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Desconocido',
                profesionalId: t.profesionalId,
                profesionalNombre: 'Laura Fernández', // Mock - should get from professionals list
                fecha: fecha.toISOString().split('T')[0],
                horaInicio,
                horaFin,
                estado: t.estado === 'CONFIRMADO' ? 'CONFIRMADO' : t.estado === 'CANCELADO' ? 'CANCELADO' : t.estado === 'ASISTIO' ? 'COMPLETADO' : 'PENDIENTE',
                notas: ''
            };
        });
    }, [myTurnos, pacientes]);

    // Additional calendar turnos state for new appointments
    const [additionalCalendarTurnos, setAdditionalCalendarTurnos] = useState<CalendarTurno[]>([]);

    // Combine existing and new turnos
    const allCalendarTurnos = React.useMemo(() => {
        return [...calendarTurnos, ...additionalCalendarTurnos];
    }, [calendarTurnos, additionalCalendarTurnos]);

    // Get all professionals (mock data - should come from API)
    const allProfesionales = [
        { id: 'p1', nombre: 'Laura', apellido: 'Fernández' },
        { id: 'p2', nombre: 'Carlos', apellido: 'Gómez' },
        { id: 'p3', nombre: 'Ana', apellido: 'Martínez' }
    ];

    // Calendar handlers
    const handleAddCalendarTurno = (turno: any) => {
        const newTurno: CalendarTurno = {
            ...turno,
            id: `t${Date.now()}`
        };
        setAdditionalCalendarTurnos([...additionalCalendarTurnos, newTurno]);
        showToast("Turno creado exitosamente", "success");

        if (turno.notificarEmail) {
            showToast("Enviando notificación por email...", "loading");
            setTimeout(() => {
                showToast("Notificación enviada a la familia", "success");
            }, 2000);
        }
    };

    const handleEditCalendarTurno = (turno: CalendarTurno) => {
        setAdditionalCalendarTurnos(additionalCalendarTurnos.map(t => t.id === turno.id ? turno : t));
        showToast("Turno actualizado correctamente", "success");
    };

    const handleDeleteCalendarTurno = (id: string) => {
        setShowConfirmCancelModal(id);
    };

    const confirmCancelTurno = () => {
        if (showConfirmCancelModal) {
            setAdditionalCalendarTurnos(additionalCalendarTurnos.filter(t => t.id !== showConfirmCancelModal));
            showToast("Turno cancelado exitosamente", "success");
            setShowConfirmCancelModal(null);
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">¡Hola, {user?.nombre}!</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                {todayTurnos.length} turnos hoy
                            </p>
                        </div>
                        <span className="text-gray-300">•</span>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                            {myPacientes.length} pacientes activos
                        </p>
                    </div>
                </div>

                {/* Tab Switcher - Ahora en Grid para evitar problemas de scroll en móvil */}
                <div className="w-full bg-gray-100 p-1.5 rounded-[2rem]">
                    <div className="grid grid-cols-2 xs:grid-cols-3 md:flex md:flex-wrap gap-1.5">
                        <button
                            onClick={() => setActiveTab('agenda')}
                            className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'agenda' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'
                                }`}
                        >
                            Agenda
                        </button>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calendar' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'
                                }`}
                        >
                            Calendario
                        </button>
                        <button
                            onClick={() => setActiveTab('patients')}
                            className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'patients' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'
                                }`}
                        >
                            Pacientes
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'
                                }`}
                        >
                            Informes
                        </button>
                        <button
                            onClick={() => setActiveTab('workshops')}
                            className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'workshops' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400'
                                }`}
                        >
                            Talleres
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <button
                    onClick={() => setShowInformeModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
                >
                    <FileText size={18} />
                    <span>Nuevo Informe Clínico</span>
                </button>
                <button
                    onClick={() => setShowNewPacienteModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all shadow-xl shadow-gray-100"
                >
                    <UserPlus size={18} className="text-primary" />
                    <span>Nuevo Paciente</span>
                </button>
                <button
                    onClick={() => setShowNewTallerModal(true)}
                    className="flex-1 flex items-center justify-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-100"
                >
                    <Plus size={18} />
                    <span>Proponer Taller</span>
                </button>
            </div>

            {activeTab === 'agenda' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Today's Schedule */}
                        <div className="card border-none shadow-2xl shadow-gray-200/50">
                            <h3 className="font-black text-2xl mb-8 flex items-center gap-3 text-gray-900 tracking-tighter">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Clock size={24} />
                                </div>
                                Agenda de Hoy
                            </h3>
                            <div className="space-y-4">
                                {todayTurnos.length > 0 ? (
                                    todayTurnos.map(t => {
                                        const p = pacientes.find(prev => prev.id === t.pacienteId);
                                        const time = new Date(t.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        return (
                                            <div key={t.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50/50 rounded-3xl border-2 border-transparent hover:border-primary/20 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
                                                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                                    <div className="text-center min-w-[80px] bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">TURNO</p>
                                                        <p className="text-2xl font-black text-gray-800">{time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-gray-800 group-hover:text-primary transition-colors">
                                                            {p?.nombre} {p?.apellido}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] font-black bg-primary/5 text-primary px-2 py-0.5 rounded-md uppercase tracking-widest">
                                                                {t.tipo.replace('_', ' ')}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                                {t.modo}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <select
                                                        value={t.estado}
                                                        onChange={(e) => updateTurnoEstado(t.id, e.target.value as any)}
                                                        className={`text-xs font-black uppercase tracking-widest border-none px-4 py-2 rounded-xl outline-none cursor-pointer transition-all shadow-sm ${t.estado === 'PENDIENTE' ? 'bg-orange-100 text-orange-600' :
                                                            t.estado === 'CONFIRMADO' ? 'bg-blue-100 text-blue-600' :
                                                                t.estado === 'ASISTIO' ? 'bg-green-100 text-green-600' :
                                                                    t.estado === 'AUSENTE' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                                            }`}
                                                    >
                                                        <option value="PENDIENTE">⏳ Pendiente</option>
                                                        <option value="CONFIRMADO">✅ Confirmado</option>
                                                        <option value="ASISTIO">👥 Asistió</option>
                                                        <option value="AUSENTE">❌ Ausente</option>
                                                        <option value="CANCELADO">🚫 Cancelado</option>
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-20 text-center bg-gray-50 rounded-[3rem]">
                                        <Clock size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs text-gray-400">No hay turnos programados para hoy</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pending Tasks */}
                        <div className="card border-none shadow-2xl shadow-gray-200/50">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-3 text-gray-900 tracking-tighter">
                                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                    <ClipboardList size={20} />
                                </div>
                                Seguimientos Pendientes
                            </h3>
                            <div className="space-y-3">
                                {seguimientos.length > 0 ? (
                                    seguimientos.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => toggleSeguimiento(s.id)}
                                            className="flex items-center gap-4 p-5 hover:bg-primary/5 rounded-2xl cursor-pointer group transition-all border border-transparent hover:border-primary/10"
                                        >
                                            <div className={`transition-all ${s.estado === 'COMPLETADO' ? 'text-green-500 scale-110' : 'text-gray-200 group-hover:text-primary'}`}>
                                                {s.estado === 'COMPLETADO' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                            </div>
                                            <div className="flex-1">
                                                <span className={`text-sm font-bold transition-all ${s.estado === 'COMPLETADO' ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                                                    {s.descripcion}
                                                </span>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                    {new Date(s.fecha).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-20">
                                        <p className="text-sm font-black uppercase tracking-widest">Sin tareas pendientes</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Stats Card */}
                        <div className="card bg-gray-900 text-white border-none shadow-2xl shadow-gray-900/20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 -m-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                            <div className="relative z-10">
                                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-primary mb-6 border-b border-white/10 pb-4">
                                    Estadísticas
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Turnos Esta Semana</p>
                                        <p className="text-4xl font-black tracking-tighter">{myTurnos.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Informes Generados</p>
                                        <p className="text-4xl font-black tracking-tighter">{myInformes.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card border-none shadow-2xl shadow-gray-200/50">
                            <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-gray-400">Acceso Rápido</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setActiveTab('patients')}
                                    className="w-full flex items-center gap-4 p-4 text-sm font-black bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all group"
                                >
                                    <Users size={18} className="text-primary group-hover:text-white" />
                                    <span>Ver Mis Pacientes</span>
                                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('reports')}
                                    className="w-full flex items-center gap-4 p-4 text-sm font-black bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all group"
                                >
                                    <FileText size={18} className="text-primary group-hover:text-white" />
                                    <span>Mis Informes</span>
                                    <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'patients' && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                    <div className="card border-none shadow-2xl shadow-gray-200/50">
                        <h3 className="font-black text-2xl mb-8 text-gray-900 tracking-tighter">Mis Pacientes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myPacientes.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPacienteDetail(p)}
                                    className="group bg-white rounded-3xl border-2 border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer overflow-hidden"
                                >
                                    {/* Header negro con logo */}
                                    <div className="bg-gray-900 p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/40">
                                                {p.nombre[0]}{p.apellido[0]}
                                            </div>
                                        </div>
                                        <div className="p-2 bg-white/10 rounded-xl text-white group-hover:text-primary group-hover:bg-white transition-all absolute top-4 right-4">
                                            <Eye size={16} />
                                        </div>
                                    </div>

                                    {/* Datos del paciente */}
                                    <div className="p-6">
                                        <h4 className="font-black text-xl text-gray-900 mb-1 tracking-tight">{p.nombre} {p.apellido}</h4>
                                        <p className="text-xs text-gray-400 font-black mb-4 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full inline-block">
                                            DNI: {p.documento}
                                        </p>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest ${p.tieneCUD ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                {p.tieneCUD ? 'CUD' : 'SIN CUD'}
                                            </span>
                                            <img src="/logo.png" alt="Voces" className="h-12 transition-transform group-hover:scale-105" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="animate-in slide-in-from-left-4 duration-500">
                    <div className="card border-none shadow-2xl shadow-gray-200/50">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-2xl text-gray-900 tracking-tighter">Mis Informes</h3>
                            <button
                                onClick={() => setShowInformeModal(true)}
                                className="btn-primary px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest"
                            >
                                Nuevo Informe
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myInformes.length > 0 ? (
                                myInformes.map(inf => {
                                    const pac = pacientes.find(p => p.id === inf.pacienteId);
                                    return (
                                        <div key={inf.id} className="bg-white p-6 rounded-3xl border-2 border-gray-50 hover:border-blue-100 hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                    {new Date(inf.fecha).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="font-black text-lg text-gray-900 mb-2 uppercase tracking-tighter">
                                                {inf.tipo.replace(/_/g, ' ')}
                                            </h4>
                                            <p className="text-xs text-gray-500 font-bold mb-4">
                                                Paciente: {pac?.nombre} {pac?.apellido}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-3 mb-6">
                                                {inf.informeGeneral?.situacionActual || 'Sin descripción'}
                                            </p>
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-2 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                                    Ver
                                                </button>
                                                <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                                                    Editar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="md:col-span-2 p-20 text-center bg-gray-50 rounded-[3rem]">
                                    <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs text-gray-400">No hay informes generados aún</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar View */}
            {activeTab === 'calendar' && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                    <CalendarComponent
                        turnos={allCalendarTurnos}
                        onAddTurno={handleAddCalendarTurno}
                        onEditTurno={handleEditCalendarTurno}
                        onDeleteTurno={handleDeleteCalendarTurno}
                        profesionales={allProfesionales}
                        pacientes={myPacientes.map(p => ({ id: p.id, nombre: p.nombre, apellido: p.apellido }))}
                        userRole="PROFESIONAL"
                        currentUserId={proId}
                    />
                </div>
            )}



            {/* Modal: Nuevo Informe */}
            {showInformeModal && selectedPacienteForReport && (
                <InformeForm
                    especialidad={profesionalEspecialidad}
                    pacienteId={selectedPacienteForReport}
                    onClose={() => {
                        setShowInformeModal(false);
                        setSelectedPacienteForReport('');
                    }}
                    onSave={handleAddInforme}
                />
            )}

            {/* Modal: Seleccionar Paciente para Informe */}
            {showInformeModal && !selectedPacienteForReport && (
                <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Seleccionar Paciente</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                                    Elige el paciente para el informe
                                </p>
                            </div>
                            <button onClick={() => setShowInformeModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            {pacientes.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPacienteForReport(p.id)}
                                    className="w-full p-4 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl text-left transition-all group"
                                >
                                    <p className="font-black text-lg">{p.nombre} {p.apellido}</p>
                                    <p className="text-xs opacity-60 font-bold uppercase tracking-widest">DNI: {p.documento}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Patient Detail */}
            {selectedPacienteDetail && (
                <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                        <div className="bg-gray-900 p-8 text-white relative overflow-hidden">
                            <button onClick={() => setSelectedPacienteDetail(null)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-20">
                                <X size={24} />
                            </button>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="flex items-center gap-8 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary/40">
                                    {selectedPacienteDetail.nombre[0]}{selectedPacienteDetail.apellido[0]}
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black tracking-tighter">{selectedPacienteDetail.nombre} {selectedPacienteDetail.apellido}</h3>
                                    <p className="text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full inline-block mt-2">
                                        DNI: {selectedPacienteDetail.documento}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                            {/* Header de Especialidad */}
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={16} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Vista enfocada en: {profesionalEspecialidad}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-3xl border ${(profesionalEspecialidad as string) === 'Psicología' ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-gray-50 border-transparent'}`}>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                        Diagnóstico {(profesionalEspecialidad as string) === 'Psicología' && "Conductual"}
                                    </h4>
                                    <p className="text-sm text-gray-700 font-bold leading-relaxed">{selectedPacienteDetail.diagnosticoPrincipal || "No especificado"}</p>
                                </div>
                                <div className={`p-6 rounded-3xl border ${(profesionalEspecialidad as string) === 'Psicopedagogía' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' : 'bg-gray-50 border-transparent'}`}>
                                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Escolaridad y Aprendizaje</h4>
                                    <p className="text-sm text-gray-700 font-bold">{selectedPacienteDetail.escolaridad || "Primaria"}</p>
                                    <p className="text-[10px] font-black text-blue-400/60 uppercase mt-1">{selectedPacienteDetail.escuelaNombre} — {selectedPacienteDetail.escuelaTurno}</p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-3xl border transition-all ${(profesionalEspecialidad as string) === 'Psicología' ? 'bg-orange-50 border-orange-200' : 'bg-orange-50/30 border-orange-100'}`}>
                                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Marco Familiar {(profesionalEspecialidad as string) === 'Psicología' && "(Crítico)"}</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Vínculos Cercanos</p>
                                        <p className="text-sm font-bold text-gray-700">{selectedPacienteDetail.hermanos || 'Hijo único'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Tel. Emergencia</p>
                                        <p className="text-sm font-black text-gray-900">{selectedPacienteDetail.telefonoEmergencia}</p>
                                    </div>
                                    <div className="col-span-2 pt-2 border-t border-orange-100">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Entorno Conviviente</p>
                                        <p className="text-sm text-gray-600 italic">"{selectedPacienteDetail.composicionFamiliar || 'Sin detalles registrados.'}"</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle Clínico Específico */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-3xl border ${selectedPacienteDetail.discapacidadFisica ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-transparent'}`}>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Compromiso Psicomotor</h4>
                                    <p className="text-sm text-gray-700">{selectedPacienteDetail.discapacidadFisica ? selectedPacienteDetail.discapacidadFisicaDetalle : "Desarrollo motor esperado."}</p>
                                </div>
                                <div className={`p-6 rounded-3xl border ${selectedPacienteDetail.retrasoDesarrollo ? 'bg-purple-50/50 border-purple-100' : 'bg-gray-50 border-transparent'}`}>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pautas Madurativas</h4>
                                    <p className="text-sm text-gray-700">{selectedPacienteDetail.retrasoDesarrollo ? selectedPacienteDetail.retrasoDesarrolloDetalle : "Hitos en tiempo."}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-3xl">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Notas Relevantes</h4>
                                <p className="text-sm text-gray-700 font-medium italic">"{selectedPacienteDetail.notasRelevantes || "Sin notas adicionales"}"</p>
                            </div>
                            <button
                                onClick={() => setSelectedPacienteDetail(null)}
                                className="w-full py-5 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 hover:bg-black transition-all"
                            >
                                Volver al Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Nuevo Paciente */}
            {showNewPacienteModal && (
                <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Nuevo Paciente</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Ficha de ingreso institucional</p>
                            </div>
                            <button onClick={() => setShowNewPacienteModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <form onSubmit={handleAddPaciente} className="p-10 space-y-8">
                                {/* Sección 1: Datos Generales */}
                                <div className="bg-gray-50/50 p-6 rounded-[2rem] space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">I. Identificación Básica</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                                            <input required type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.nombre} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, nombre: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                                            <input required type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.apellido} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, apellido: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DNI</label>
                                            <input required type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm tabular-nums"
                                                value={newPacienteForm.documento} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, documento: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nacimiento</label>
                                            <input required type="date" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.fechaNacimiento} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, fechaNacimiento: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="tieneCUDPro" checked={newPacienteForm.tieneCUD}
                                                onChange={(e) => setNewPacienteForm({ ...newPacienteForm, tieneCUD: e.target.checked })}
                                                className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20 cursor-pointer" />
                                            <label htmlFor="tieneCUDPro" className="text-[10px] font-black text-gray-900 uppercase tracking-widest cursor-pointer">Posee CUD</label>
                                        </div>
                                        {newPacienteForm.tieneCUD && (
                                            <input type="text" placeholder="Nro de Certificado" className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none"
                                                value={newPacienteForm.numeroCUD} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, numeroCUD: e.target.value })} />
                                        )}
                                    </div>
                                </div>

                                {/* Sección 2: Educación */}
                                <div className="bg-blue-50/30 p-6 rounded-[2rem] space-y-6">
                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">II. Trayectoria Educativa</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Grado/Año</label>
                                            <input type="text" placeholder="Ej: Sala de 5" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.escolaridad} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, escolaridad: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Establecimiento</label>
                                            <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.escuelaNombre} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, escuelaNombre: e.target.value })} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Turno</label>
                                            <select className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.escuelaTurno} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, escuelaTurno: e.target.value as any })}>
                                                <option value="MAÑANA">Mañana</option>
                                                <option value="TARDE">Tarde</option>
                                                <option value="JORNADA_COMPLETA">Jornada Completa</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 3: Familia */}
                                <div className="bg-orange-50/30 p-6 rounded-[2rem] space-y-6">
                                    <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4">III. Dinámica Familiar</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Guardian 2</label>
                                            <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.tutorSecundarioNombre} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, tutorSecundarioNombre: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono Emergencia</label>
                                            <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                                value={newPacienteForm.telefonoEmergencia} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, telefonoEmergencia: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Integración del Grupo Familiar</label>
                                        <textarea className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none h-24 resize-none font-medium text-gray-600 shadow-sm"
                                            placeholder="Quiénes conviven, relación con hermanos..."
                                            value={newPacienteForm.composicionFamiliar} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, composicionFamiliar: e.target.value })} />
                                    </div>
                                </div>

                                {/* Sección 4: Clinical */}
                                <div className="bg-red-50/10 p-6 rounded-[2rem] space-y-6 border border-red-50">
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4">IV. Antecedentes Clínicos y Desarrollo</h4>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diagnóstico Específico / Derivación</label>
                                            <textarea className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none h-24 resize-none font-medium text-gray-600 shadow-sm"
                                                placeholder="Resumen clínico inicial..."
                                                value={newPacienteForm.diagnosticoPrincipal} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, diagnosticoPrincipal: e.target.value })} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <input type="checkbox" id="discaFisicaPro" checked={newPacienteForm.discapacidadFisica}
                                                        onChange={(e) => setNewPacienteForm({ ...newPacienteForm, discapacidadFisica: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-gray-200 text-red-500 focus:ring-red-500/20 cursor-pointer" />
                                                    <label htmlFor="discaFisicaPro" className="text-[10px] font-black text-gray-900 uppercase tracking-widest cursor-pointer">Compromiso Físico</label>
                                                </div>
                                                {newPacienteForm.discapacidadFisica && (
                                                    <textarea placeholder="Especificar limitaciones..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-medium outline-none h-20"
                                                        value={newPacienteForm.discapacidadFisicaDetalle} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, discapacidadFisicaDetalle: e.target.value })} />
                                                )}
                                            </div>

                                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <input type="checkbox" id="retrasoDesaPro" checked={newPacienteForm.retrasoDesarrollo}
                                                        onChange={(e) => setNewPacienteForm({ ...newPacienteForm, retrasoDesarrollo: e.target.checked })}
                                                        className="w-5 h-5 rounded-lg border-gray-200 text-red-500 focus:ring-red-500/20 cursor-pointer" />
                                                    <label htmlFor="retrasoDesaPro" className="text-[10px] font-black text-gray-900 uppercase tracking-widest cursor-pointer">Retraso en Hitos</label>
                                                </div>
                                                {newPacienteForm.retrasoDesarrollo && (
                                                    <textarea placeholder="Detallar pautas de desarrollo..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-medium outline-none h-20"
                                                        value={newPacienteForm.retrasoDesarrolloDetalle} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, retrasoDesarrolloDetalle: e.target.value })} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full group bg-primary hover:bg-orange-600 text-white py-6 rounded-[2rem] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-[0.98]">
                                    <span className="font-black text-sm uppercase tracking-[0.2em]">Registrar Paciente</span>
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'workshops' && (
                <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white px-6 py-4 rounded-3xl border-2 border-primary/10 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mis propuestas</p>
                                <p className="text-xl font-black text-gray-900">{talleres.filter(t => t.creadoPorId === user?.id).length}</p>
                            </div>
                        </div>
                    </div>

                    {talleres.filter(t => t.creadoPorId === user?.id || t.estado === 'APROBADO').length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {talleres.filter(t => t.creadoPorId === user?.id || t.estado === 'APROBADO').map(t => (
                                <div key={t.id} className="card border-none shadow-2xl shadow-gray-200/50 flex flex-col justify-between group overflow-hidden relative">
                                    <div className={`absolute top-0 left-0 w-2 h-full ${t.estado === 'APROBADO' ? 'bg-green-500' : t.estado === 'PROPUESTO' ? 'bg-orange-400' : 'bg-red-400'}`} />
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{t.orientadoA}</span>
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${t.estado === 'APROBADO' ? 'bg-green-100 text-green-600' : t.estado === 'PROPUESTO' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                                    {t.estado}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="font-black text-2xl text-gray-900 mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">{t.nombre}</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-3">{t.descripcion}</p>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 text-gray-400">
                                                <Calendar size={18} />
                                                <span className="text-xs font-bold">{new Date(t.fechaHora).toLocaleDateString()}hs</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-gray-400">
                                                <Users size={18} />
                                                <span className="text-xs font-bold">{t.inscritos.length}/{t.cupoMaximo} Cupos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTallerDetail(t)}
                                        className="w-full mt-8 py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                                    >
                                        Ver Detalle
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
                                <Activity size={32} />
                            </div>
                            <p className="font-black text-sm text-gray-400 uppercase tracking-widest">Sin talleres disponibles</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Propuesta de Taller */}
            {showNewTallerModal && (
                <div className="modal-overlay z-[200] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-orange-500 p-8 text-white relative flex-shrink-0">
                            <button onClick={() => setShowNewTallerModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20">
                                <X size={24} />
                            </button>
                            <h3 className="text-3xl font-black tracking-tighter">Propuesta de Taller</h3>
                            <p className="text-orange-100/80 text-[10px] font-black uppercase tracking-widest mt-1">Sugerir una actividad grupal institucional</p>
                        </div>
                        <form onSubmit={handleProposeTaller} className="p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Taller</label>
                                <input required type="text" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                    value={newTallerForm.nombre} onChange={(e) => setNewTallerForm({ ...newTallerForm, nombre: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción y Objetivos</label>
                                <textarea required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none h-32 resize-none font-medium text-gray-600"
                                    placeholder="¿De qué trata el taller? ¿Cuáles son sus metas?"
                                    value={newTallerForm.descripcion} onChange={(e) => setNewTallerForm({ ...newTallerForm, descripcion: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Orientado a (Edades/Perfil)</label>
                                    <input required type="text" placeholder="Ej: Niños de 4 a 6 años" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                        value={newTallerForm.orientadoA} onChange={(e) => setNewTallerForm({ ...newTallerForm, orientadoA: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha y Hora Tentativa</label>
                                    <input required type="datetime-local" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                        value={newTallerForm.fechaHora} onChange={(e) => setNewTallerForm({ ...newTallerForm, fechaHora: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cupo Máximo</label>
                                    <input required type="number" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                        value={newTallerForm.cupoMaximo} onChange={(e) => setNewTallerForm({ ...newTallerForm, cupoMaximo: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all active:scale-[0.98]">
                                Enviar Propuesta
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Cancelación */}
            {showConfirmCancelModal && (
                <div className="modal-overlay z-[200] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100/50">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">¿Cancelar turno?</h3>
                        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                            Esta acción no se puede deshacer. El paciente recibirá una notificación de la cancelación.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmCancelTurno}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-200"
                            >
                                Sí, cancelar turno
                            </button>
                            <button
                                onClick={() => setShowConfirmCancelModal(null)}
                                className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                            >
                                No, mantener
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Detalle de Taller y Documentos (Profesional) */}
            {selectedTallerDetail && (
                <div className="modal-overlay z-[200] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-primary/5 p-8 border-b border-gray-100 relative flex-shrink-0">
                            <button onClick={() => setSelectedTallerDetail(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
                                <X size={24} className="text-gray-400" />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <ClipboardList size={24} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedTallerDetail.nombre}</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{selectedTallerDetail.orientadoA}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Información del Taller</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed">{selectedTallerDetail.descripcion}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Fecha Programada</p>
                                        <p className="text-sm font-black text-gray-900">{new Date(selectedTallerDetail.fechaHora).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Capacidad</p>
                                        <p className="text-sm font-black text-gray-900">{selectedTallerDetail.inscritos.length} / {selectedTallerDetail.cupoMaximo}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Archivos y Recursos</h4>
                                    <button
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = "image/*,application/pdf";
                                            input.onchange = (e: any) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        const docType = file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMAGE' : 'DOC';
                                                        addDocumentoTaller(selectedTallerDetail.id, {
                                                            nombre: file.name,
                                                            url: event.target?.result as string, // Previsualización real con Data URL
                                                            tipo: docType
                                                        });
                                                        showToast("Archivo subido con éxito", "success");
                                                        // La actualización de selectedTallerDetail ahora la maneja el useEffect global de sincronización
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            };
                                            input.click();
                                        }}
                                        className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {selectedTallerDetail.documentos && selectedTallerDetail.documentos.length > 0 ? (
                                        selectedTallerDetail.documentos.map((doc: any) => (
                                            <div key={doc.id} className="group flex flex-col p-4 bg-white border border-gray-100 rounded-3xl hover:border-primary/20 hover:shadow-xl transition-all gap-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${doc.tipo === 'PDF' ? 'bg-red-50 text-red-500' : doc.tipo === 'IMAGE' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                                                            {doc.tipo === 'IMAGE' ? <ImageIcon size={20} /> : <FileText size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-gray-900 truncate max-w-[200px]">{doc.nombre}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(doc.fecha).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <a href={doc.url} download={doc.nombre} className="p-2 text-gray-300 hover:text-primary transition-colors">
                                                        <Download size={18} />
                                                    </a>
                                                </div>

                                                {/* Previsualización del contenido */}
                                                {doc.url !== '#' && (
                                                    <div className="w-full h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100/50">
                                                        {doc.tipo === 'IMAGE' ? (
                                                            <img src={doc.url} alt={doc.nombre} className="w-full h-full object-cover" />
                                                        ) : doc.tipo === 'PDF' ? (
                                                            <iframe src={`${doc.url}#toolbar=0`} className="w-full h-full pointer-events-none" title={doc.nombre} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <FileText size={32} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                <FileText size={24} />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sin archivos adjuntos</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedTallerDetail(null)}
                                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
                            >
                                Volver al Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalDashboard;
