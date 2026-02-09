import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { mockObrasSociales, mockUsuarios } from '../../mockData';
import {
    Users, Calendar, Activity, Briefcase, Plus, Search,
    X, Check, Clipboard, Info, Filter, MoreVertical,
    Download, ChevronRight, Clock, MapPin
} from 'lucide-react';
import { Paciente, Turno, Taller } from '../../types';

const StatCard = ({ title, value, icon, color }: any) => (
    <div className="card hover:shadow-2xl transition-all duration-300 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-black text-gray-400 mb-1 uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const {
        pacientes, profesionales, turnos, talleres, obrasSociales, usuarios,
        addPaciente, addTurno, updateTurnoEstado
    } = useData();

    // UI State
    const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'turns' | 'workshops'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [showTurnoModal, setShowTurnoModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

    // Forms State
    const [newPacienteForm, setNewPacienteForm] = useState({
        nombre: '', apellido: '', documento: '', fechaNacimiento: '',
        tieneCUD: false, numeroCUD: '', diagnosticoPrincipal: '',
        escolaridad: '', obrasSociales: ['os1'], notasRelevantes: '',
        tutorPrincipalId: 'u4'
    });

    const [newTurnoForm, setNewTurnoForm] = useState({
        pacienteId: '', profesionalId: 'p1', fechaHora: '',
        tipo: 'SESION' as any, modo: 'PRESENCIAL' as any, notas: ''
    });

    // Filtering
    const filteredPacientes = pacientes.filter(p =>
        `${p.nombre} ${p.apellido} ${p.documento}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPaciente = (e: React.FormEvent) => {
        e.preventDefault();
        addPaciente(newPacienteForm);
        setShowNewModal(false);
        setNewPacienteForm({
            nombre: '', apellido: '', documento: '', fechaNacimiento: '',
            tieneCUD: false, numeroCUD: '', diagnosticoPrincipal: '',
            escolaridad: '', obrasSociales: ['os1'], notasRelevantes: '',
            tutorPrincipalId: 'u4'
        });
    };

    const handleAddTurno = (e: React.FormEvent) => {
        e.preventDefault();
        addTurno({
            ...newTurnoForm,
            estado: 'PENDIENTE',
            fechaHora: new Date(newTurnoForm.fechaHora).toISOString()
        });
        setShowTurnoModal(false);
        setNewTurnoForm({
            pacienteId: '', profesionalId: 'p1', fechaHora: '',
            tipo: 'SESION', modo: 'PRESENCIAL', notas: ''
        });
    };

    const downloadMockPDF = (p: Paciente) => {
        console.log("Generando PDF para:", p.nombre);
        alert(`Generando Ficha Clínica de ${p.nombre} ${p.apellido}... El archivo PDF se descargará automáticamente.`);
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Panel de Administración</h1>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Sistema VOCES Activo</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Resumen
                    </button>
                    <button
                        onClick={() => setActiveTab('turns')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'turns' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Turnos
                    </button>
                    <button
                        onClick={() => setActiveTab('workshops')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'workshops' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Talleres
                    </button>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
                >
                    <Plus size={16} />
                    <span>Nuevo Paciente</span>
                </button>
                <button
                    onClick={() => setShowTurnoModal(true)}
                    className="flex items-center space-x-2 bg-white border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all shadow-xl shadow-gray-100"
                >
                    <Calendar size={16} className="text-primary" />
                    <span>Programar Turno</span>
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Pacientes Activos"
                            value={pacientes.length}
                            icon={<Users className="text-blue-600" size={24} />}
                            color="bg-blue-50"
                        />
                        <StatCard
                            title="Turnos Hoy"
                            value={turnos.filter(t => new Date(t.fechaHora).toDateString() === new Date().toDateString()).length}
                            icon={<Calendar className="text-orange-600" size={24} />}
                            color="bg-orange-50"
                        />
                        <StatCard
                            title="Profesionales"
                            value={profesionales.length}
                            icon={<Briefcase className="text-green-600" size={24} />}
                            color="bg-green-50"
                        />
                        <StatCard
                            title="Especialidades"
                            value={3} // Mock
                            icon={<Activity className="text-purple-600" size={24} />}
                            color="bg-purple-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Patients Table */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="card border-none shadow-2xl shadow-gray-200/50">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-black text-2xl text-gray-900 tracking-tighter">Gestión de Pacientes</h3>
                                    <div className="relative w-64 group">
                                        <input
                                            type="text"
                                            placeholder="Filtrar por nombre..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all"
                                        />
                                        <Search className="absolute left-3 top-2.5 text-gray-300 group-focus-within:text-primary transition-colors" size={16} />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Paciente</th>
                                                <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Documento</th>
                                                <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">CUD</th>
                                                <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredPacientes.map(p => (
                                                <tr key={p.id} className="group hover:bg-gray-50/70 transition-colors">
                                                    <td className="py-5 px-2">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                                {p.nombre[0]}{p.apellido[0]}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-800 tracking-tight">{p.nombre} {p.apellido}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase">OS: {mockObrasSociales.find(os => os.id === p.obrasSociales[0])?.nombre || 'Particular'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-2 text-gray-500 font-black tabular-nums">{p.documento}</td>
                                                    <td className="py-5 px-2">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest ${p.tieneCUD ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                                            {p.tieneCUD ? 'SI' : 'NO'}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-2">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => setSelectedPaciente(p)}
                                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                                title="Ver Detalle"
                                                            >
                                                                <Info size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => downloadMockPDF(p)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                                title="Ficha PDF"
                                                            >
                                                                <Download size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Side */}
                        <div className="space-y-8">
                            <div className="card border-none shadow-2xl shadow-gray-200/50">
                                <h3 className="font-black text-lg mb-6 flex items-center space-x-2">
                                    <Clock size={20} className="text-primary" />
                                    <span>Próximos Talleres</span>
                                </h3>
                                <div className="space-y-4">
                                    {talleres.slice(0, 2).map(t => (
                                        <div key={t.id} className="p-4 rounded-3xl border-2 border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group">
                                            <h4 className="font-black text-sm mb-1 group-hover:text-primary transition-colors">{t.nombre}</h4>
                                            <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center space-x-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(t.fechaHora).toLocaleDateString()}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Users size={12} />
                                                    <span>{t.inscritos.length}/{t.cupoMaximo}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveTab('workshops')}
                                    className="w-full mt-6 py-3 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 hover:bg-primary hover:text-white transition-all uppercase tracking-widest"
                                >
                                    Ir a Talleres
                                </button>
                            </div>

                            <div className="card bg-gray-900 border-none shadow-2xl shadow-gray-900/30 text-white overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                    <Activity size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-2">Estado Semanal</h4>
                                    <p className="text-2xl font-black mb-4 tracking-tighter">Agenda completa para esta semana.</p>
                                    <button
                                        onClick={() => setActiveTab('turns')}
                                        className="btn-primary w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                                    >
                                        Gestionar Turnos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'turns' && (
                <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                    <div className="card border-none shadow-2xl shadow-gray-200/50">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-black text-2xl text-gray-900 tracking-tighter">Gestión de Turnos</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Haga clic en el estado para cambiarlo</p>
                            </div>
                            <button
                                onClick={() => setShowTurnoModal(true)}
                                className="btn-primary px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest"
                            >
                                Nuevo Turno
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Hora / Fecha</th>
                                        <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Paciente</th>
                                        <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Profesional</th>
                                        <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Tipo / Modo</th>
                                        <th className="pb-4 font-black text-gray-400 px-2 uppercase tracking-widest text-[10px]">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {turnos.map(t => {
                                        const pac = pacientes.find(p => p.id === t.pacienteId);
                                        const pro = profesionales.find(p => p.id === t.profesionalId);
                                        const date = new Date(t.fechaHora);
                                        return (
                                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-5 px-2">
                                                    <p className="font-black text-gray-900">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{date.toLocaleDateString()}</p>
                                                </td>
                                                <td className="py-5 px-2">
                                                    <p className="font-bold text-gray-800">{pac?.nombre} {pac?.apellido}</p>
                                                </td>
                                                <td className="py-5 px-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase">{pro?.especialidad}</p>
                                                </td>
                                                <td className="py-5 px-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{t.tipo.replace('_', ' ')}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold">{t.modo}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-2">
                                                    <select
                                                        value={t.estado}
                                                        onChange={(e) => updateTurnoEstado(t.id, e.target.value as any)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-none outline-none cursor-pointer ${t.estado === 'PENDIENTE' ? 'bg-orange-100 text-orange-600' :
                                                                t.estado === 'CONFIRMADO' ? 'bg-blue-100 text-blue-600' :
                                                                    t.estado === 'ASISTIO' ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                                                            }`}
                                                    >
                                                        <option value="PENDIENTE">Pendiente</option>
                                                        <option value="CONFIRMADO">Confirmado</option>
                                                        <option value="ASISTIO">Asistió</option>
                                                        <option value="AUSENTE">Ausente</option>
                                                        <option value="CANCELADO">Cancelado</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'workshops' && (
                <div className="animate-in slide-in-from-left-4 duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {talleres.map(t => (
                        <div key={t.id} className="card border-none shadow-2xl shadow-gray-200/50 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">{t.orientadoA}</span>
                                    <MoreVertical size={16} className="text-gray-300 cursor-pointer" />
                                </div>
                                <h3 className="font-black text-2xl text-gray-900 mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">{t.nombre}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-3">{t.descripcion}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-gray-400">
                                        <Calendar size={18} />
                                        <span className="text-xs font-bold">{new Date(t.fechaHora).toLocaleDateString()} - {new Date(t.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-gray-400">
                                        <Users size={18} />
                                        <span className="text-xs font-bold">{t.inscritos.length}/{t.cupoMaximo} Inscritos</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-primary hover:text-white transition-all">
                                Gestionar Taller
                            </button>
                        </div>
                    ))}
                    <div className="card border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                            <Plus size={32} />
                        </div>
                        <p className="font-black text-xs uppercase tracking-widest text-gray-400">Crear Nuevo Taller</p>
                    </div>
                </div>
            )}

            {/* Modal: Nuevo Paciente */}
            {showNewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Nuevo Paciente</h3>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Ficha de ingreso institucional</p>
                            </div>
                            <button onClick={() => setShowNewModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={28} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPaciente} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            )}

            {/* Modal: Programar Turno */}
            {showTurnoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Programar Turno</h3>
                            <button onClick={() => setShowTurnoModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddTurno} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paciente</label>
                                <select required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                    value={newTurnoForm.pacienteId} onChange={(e) => setNewTurnoForm({ ...newTurnoForm, pacienteId: e.target.value })}>
                                    <option value="">Seleccionar...</option>
                                    {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profesional</label>
                                <select required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                    value={newTurnoForm.profesionalId} onChange={(e) => setNewTurnoForm({ ...newTurnoForm, profesionalId: e.target.value })}>
                                    {profesionales.map(pro => {
                                        const u = usuarios.find(u => u.id === pro.usuarioId);
                                        return <option key={pro.id} value={pro.id}>{u?.nombre} {u?.apellido} - {pro.especialidad}</option>
                                    })}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha y Hora</label>
                                <input required type="datetime-local" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                    value={newTurnoForm.fechaHora} onChange={(e) => setNewTurnoForm({ ...newTurnoForm, fechaHora: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full btn-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                Confirmar Turno
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Detalle Paciente */}
            {selectedPaciente && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                        <div className="bg-gray-900 p-10 text-white relative overflow-hidden">
                            <button onClick={() => setSelectedPaciente(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20">
                                <X size={24} />
                            </button>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="flex items-center space-x-8 relative z-10">
                                <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary/40">
                                    {selectedPaciente.nombre[0]}{selectedPaciente.apellido[0]}
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black tracking-tighter">{selectedPaciente.nombre} {selectedPaciente.apellido}</h3>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">DNI: {selectedPaciente.documento}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${selectedPaciente.tieneCUD ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/50'}`}>
                                            {selectedPaciente.tieneCUD ? 'CUD ACTIVO' : 'SIN CUD'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/30">
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Diagnóstico Principal</h4>
                                    <p className="text-sm text-gray-700 font-bold leading-relaxed">{selectedPaciente.diagnosticoPrincipal || "No especificado."}</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Escolaridad</h4>
                                    <p className="text-sm text-gray-700 font-bold">{selectedPaciente.escolaridad || "Escuela Normal N°X"}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Obra Social</h4>
                                    <p className="text-sm text-gray-800 font-black">{mockObrasSociales.find(os => os.id === selectedPaciente.obrasSociales[0])?.nombre || 'Particular'}</p>
                                </div>
                                <div className="flex flex-col space-y-3">
                                    <button
                                        onClick={() => downloadMockPDF(selectedPaciente)}
                                        className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                                    >
                                        <Download size={18} />
                                        <span>Descargar Ficha Completa</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedPaciente(null)}
                                        className="py-4 rounded-2xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                                    >
                                        Cerrar Vista
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
