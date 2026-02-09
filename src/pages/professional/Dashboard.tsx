import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import {
    CheckCircle2, Circle, Clock, FileText, UserPlus, ClipboardList,
    X, Plus, Calendar, Users, Activity, TrendingUp, AlertCircle,
    ChevronRight, Eye, Edit3, Save
} from 'lucide-react';
import { Paciente } from '../../types';
import CalendarComponent, { Turno as CalendarTurno } from '../../components/Calendar';

const ProfessionalDashboard = () => {
    const { user } = useAuth();
    const { turnos, pacientes, updateTurnoEstado, seguimientos, toggleSeguimiento, addInforme, informes, addPaciente } = useData();

    // UI State
    const [activeTab, setActiveTab] = useState<'agenda' | 'calendar' | 'patients' | 'reports'>('agenda');
    const [showInformeModal, setShowInformeModal] = useState(false);
    const [showNewPacienteModal, setShowNewPacienteModal] = useState(false);
    const [selectedPacienteForReport, setSelectedPacienteForReport] = useState('');
    const [selectedPacienteDetail, setSelectedPacienteDetail] = useState<Paciente | null>(null);

    // Report Form
    const [reportForm, setReportForm] = useState({
        resumen: '',
        objetivos: '',
        intervencionesRealizadas: '',
        sugerenciasFamilia: '',
        visibleParaFamilia: true
    });

    // New Patient Form
    const [newPacienteForm, setNewPacienteForm] = useState({
        nombre: '', apellido: '', documento: '', fechaNacimiento: '',
        tieneCUD: false, numeroCUD: '', diagnosticoPrincipal: '',
        escolaridad: '', obrasSociales: ['os1'], notasRelevantes: '',
        tutorPrincipalId: 'u4'
    });

    // Filter data for this professional
    const proId = 'p1'; // Mocking current professional as p1 (Laura)
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
            escolaridad: '', obrasSociales: ['os1'], notasRelevantes: '',
            tutorPrincipalId: 'u4'
        });
        alert("✅ Paciente agregado exitosamente");
    };

    const handleAddInforme = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPacienteForReport) return;

        addInforme({
            pacienteId: selectedPacienteForReport,
            creadoPorProfesionalId: proId,
            coProfesionalesIds: [],
            tipo: 'SEGUIMIENTO',
            fecha: new Date().toISOString(),
            ...reportForm
        });

        setShowInformeModal(false);
        setSelectedPacienteForReport('');
        setReportForm({
            resumen: '',
            objetivos: '',
            intervencionesRealizadas: '',
            sugerenciasFamilia: '',
            visibleParaFamilia: true
        });
        alert("✅ Informe guardado exitosamente");
    };

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
    const handleAddCalendarTurno = (turno: Omit<CalendarTurno, 'id'>) => {
        const newTurno: CalendarTurno = {
            ...turno,
            id: `t${Date.now()}`
        };
        setAdditionalCalendarTurnos([...additionalCalendarTurnos, newTurno]);
        alert("✅ Turno creado exitosamente");
    };

    const handleEditCalendarTurno = (turno: CalendarTurno) => {
        setAdditionalCalendarTurnos(additionalCalendarTurnos.map(t => t.id === turno.id ? turno : t));
        alert("✅ Turno actualizado");
    };

    const handleDeleteCalendarTurno = (id: string) => {
        if (confirm("¿Estás seguro de cancelar este turno?")) {
            setAdditionalCalendarTurnos(additionalCalendarTurnos.filter(t => t.id !== id));
            alert("✅ Turno cancelado");
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

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('agenda')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'agenda' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Agenda
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'calendar' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Calendario
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'patients' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Pacientes
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Informes
                    </button>
                </div>
            </div>

            {/* Quick Action */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setShowInformeModal(true)}
                    className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
                >
                    <FileText size={18} />
                    <span>Nuevo Informe Clínico</span>
                </button>
                <button
                    onClick={() => setShowNewPacienteModal(true)}
                    className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all shadow-xl shadow-gray-100"
                >
                    <UserPlus size={18} className="text-primary" />
                    <span>Nuevo Paciente</span>
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
                                    className="group bg-white p-6 rounded-3xl border-2 border-gray-50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                                            {p.nombre[0]}{p.apellido[0]}
                                        </div>
                                        <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                            <Eye size={18} />
                                        </div>
                                    </div>
                                    <h4 className="font-black text-lg text-gray-800 mb-1">{p.nombre} {p.apellido}</h4>
                                    <p className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest">DNI: {p.documento}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${p.tieneCUD ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {p.tieneCUD ? 'CUD' : 'SIN CUD'}
                                        </span>
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
                                                {inf.resumen}
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
            {showInformeModal && (
                <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Generar Informe</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Registro de sesión clínica</p>
                            </div>
                            <button onClick={() => setShowInformeModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <form onSubmit={handleAddInforme} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seleccionar Paciente</label>
                                    <select
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                        value={selectedPacienteForReport}
                                        onChange={(e) => setSelectedPacienteForReport(e.target.value)}
                                    >
                                        <option value="">Seleccionar un paciente...</option>
                                        {pacientes.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Resumen de la Sesión</label>
                                    <textarea
                                        required
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none font-medium"
                                        placeholder="Describe lo trabajado en la sesión..."
                                        value={reportForm.resumen}
                                        onChange={(e) => setReportForm({ ...reportForm, resumen: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Objetivos Terapéuticos</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none font-medium"
                                        placeholder="Objetivos planteados..."
                                        value={reportForm.objetivos}
                                        onChange={(e) => setReportForm({ ...reportForm, objetivos: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sugerencias para la Familia</label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none font-medium"
                                        placeholder="Recomendaciones para el hogar..."
                                        value={reportForm.sugerenciasFamilia}
                                        onChange={(e) => setReportForm({ ...reportForm, sugerenciasFamilia: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                                    <input
                                        id="visible"
                                        type="checkbox"
                                        className="w-5 h-5 accent-primary rounded cursor-pointer"
                                        checked={reportForm.visibleParaFamilia}
                                        onChange={(e) => setReportForm({ ...reportForm, visibleParaFamilia: e.target.checked })}
                                    />
                                    <label htmlFor="visible" className="font-bold text-gray-700 cursor-pointer select-none">
                                        Compartir este informe con la familia del paciente
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-widest"
                                >
                                    Guardar Informe en Sistema
                                </button>
                            </form>
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
                        <div className="p-8 space-y-6">
                            <div className="bg-gray-50 p-6 rounded-3xl">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Diagnóstico</h4>
                                <p className="text-sm text-gray-700 font-bold">{selectedPacienteDetail.diagnosticoPrincipal || "No especificado"}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Notas Relevantes</h4>
                                <p className="text-sm text-gray-700 font-medium italic">"{selectedPacienteDetail.notasRelevantes || "Sin notas adicionales"}"</p>
                            </div>
                            <button
                                onClick={() => setSelectedPacienteDetail(null)}
                                className="w-full py-4 rounded-2xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                            >
                                Cerrar
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
                            <form onSubmit={handleAddPaciente} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                                        <input required type="text" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                            value={newPacienteForm.nombre} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, nombre: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                                        <input required type="text" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                            value={newPacienteForm.apellido} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, apellido: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">DNI</label>
                                        <input required type="text" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold tabular-nums"
                                            value={newPacienteForm.documento} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, documento: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nacimiento</label>
                                        <input required type="date" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                            value={newPacienteForm.fechaNacimiento} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, fechaNacimiento: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diagnóstico Inicial</label>
                                    <textarea className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none font-medium text-gray-600"
                                        placeholder="Describe brevemente la condición del paciente..."
                                        value={newPacienteForm.diagnosticoPrincipal} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, diagnosticoPrincipal: e.target.value })} />
                                </div>

                                <button type="submit" className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-widest">
                                    Guardar Paciente en Sistema
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalDashboard;
