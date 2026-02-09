import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { mockObrasSociales, mockUsuarios } from '../../mockData';
import {
    Users, Calendar, Activity, Briefcase, Plus, Search,
    X, Check, Clipboard, Info, Filter, MoreVertical,
    Download, ChevronRight, Clock, MapPin, FileText, Image as ImageIcon
} from 'lucide-react';
import { Paciente, Turno, Taller } from '../../types';
import { useToast } from '../../context/ToastContext';
import PatientFileViewer from '../../components/PatientFileViewer';

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
        addPaciente, addTurno, updateTurnoEstado, addTaller, updateTallerEstado, addDocumentoTaller
    } = useData();
    const { showToast } = useToast();

    // UI State
    const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'turns' | 'workshops'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [showTurnoModal, setShowTurnoModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [viewingPatientFile, setViewingPatientFile] = useState<Paciente | null>(null);
    const [selectedTallerDetail, setSelectedTallerDetail] = useState<Taller | null>(null);

    // Forms State
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

    const [newTurnoForm, setNewTurnoForm] = useState({
        pacienteId: '', profesionalId: 'p1', fechaHora: '',
        tipo: 'SESION' as any, modo: 'PRESENCIAL' as any, notas: '',
        notificarEmail: true
    });

    const [showNewTallerModal, setShowNewTallerModal] = useState(false);
    const [newTallerForm, setNewTallerForm] = useState({
        nombre: '', descripcion: '', orientadoA: '',
        fechaHora: '', cupoMaximo: 10, profesionalesResponsables: ['p1'],
        inscritos: [], estado: 'APROBADO' as any, creadoPorId: 'u1'
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
            escolaridad: '', escuelaNombre: '', escuelaTurno: 'MAÑANA' as any,
            tutorPrincipalId: 'u4',
            tutorSecundarioNombre: '', tutorSecundarioParentesco: '', tutorSecundarioTelefono: '',
            obrasSociales: ['os1'], notasRelevantes: '',
            discapacidadFisica: false, discapacidadFisicaDetalle: '',
            retrasoDesarrollo: false, retrasoDesarrolloDetalle: '',
            hermanos: '', composicionFamiliar: '', telefonoEmergencia: ''
        });
        showToast("Paciente registrado con éxito", "success");
    };

    const handleAddTurno = (e: React.FormEvent) => {
        e.preventDefault();
        addTurno({
            ...newTurnoForm,
            estado: 'PENDIENTE',
            fechaHora: new Date(newTurnoForm.fechaHora).toISOString()
        });

        showToast("Turno programado exitosamente", "success");

        if (newTurnoForm.notificarEmail) {
            showToast("Enviando notificación por email...", "loading");
            setTimeout(() => {
                showToast("Notificación enviada a la familia", "success");
            }, 2000);
        }

        setShowTurnoModal(false);
        setNewTurnoForm({
            pacienteId: '', profesionalId: 'p1', fechaHora: '',
            tipo: 'SESION', modo: 'PRESENCIAL', notas: '',
            notificarEmail: true
        });
    };

    const handleAddTaller = (e: React.FormEvent) => {
        e.preventDefault();
        addTaller(newTallerForm);
        setShowNewTallerModal(false);
        setNewTallerForm({
            nombre: '', descripcion: '', orientadoA: '',
            fechaHora: '', cupoMaximo: 10, profesionalesResponsables: ['p1'],
            inscritos: [], estado: 'APROBADO' as any, creadoPorId: 'u1'
        });
        showToast("Taller creado y publicado exitosamente", "success");
    };

    const downloadMockPDF = (p: Paciente) => {
        showToast(`Generando Ficha Clínica de ${p.nombre}...`, 'download');
        setTimeout(() => {
            showToast(`Ficha de ${p.nombre} descargada correctamente`, 'success');
        }, 2000);
    };

    // Sincronizar el detalle del taller cuando los datos globales cambian (muy importante para archivos)
    React.useEffect(() => {
        if (selectedTallerDetail) {
            const current = talleres.find(t => t.id === selectedTallerDetail.id);
            if (current && JSON.stringify(current.documentos) !== JSON.stringify(selectedTallerDetail.documentos)) {
                setSelectedTallerDetail(JSON.parse(JSON.stringify(current))); // Deep clone para forzar re-render
            }
        }
    }, [talleres, selectedTallerDetail?.id]);

    // Scroll to top on tab change
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    return (
        <div className="pt-32 pb-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
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
                <div className="w-full md:w-auto bg-gray-100 p-1.5 rounded-[2rem]">
                    <div className="grid grid-cols-2 xs:grid-cols-3 md:flex gap-1.5">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Resumen
                        </button>
                        <button
                            onClick={() => setActiveTab('turns')}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'turns' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Turnos
                        </button>
                        <button
                            onClick={() => setActiveTab('workshops')}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'workshops' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Talleres
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex-1 flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
                >
                    <Plus size={18} />
                    <span>Nuevo Paciente</span>
                </button>
                <button
                    onClick={() => setShowTurnoModal(true)}
                    className="flex-1 flex items-center justify-center space-x-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all shadow-xl shadow-gray-100"
                >
                    <Calendar size={18} className="text-primary" />
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
                                                                onClick={() => setViewingPatientFile(p)}
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
                                        <div
                                            key={t.id}
                                            onClick={() => setSelectedTallerDetail(t)}
                                            className="p-4 rounded-3xl border-2 border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group"
                                        >
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
                <div className="space-y-8">
                    {/* Header con estadísticas rápidas */}
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Activos</p>
                                <p className="text-xl font-black text-gray-900">{talleres.filter(t => t.estado === 'APROBADO').length}</p>
                            </div>
                        </div>
                        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Propuestas</p>
                                <p className="text-xl font-black text-gray-900">{talleres.filter(t => t.estado === 'PROPUESTO').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="animate-in slide-in-from-left-4 duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {talleres.sort((a, b) => a.estado === 'PROPUESTO' ? -1 : 1).map(t => (
                            <div key={t.id}
                                onClick={() => setSelectedTallerDetail(t)}
                                className={`card border-none shadow-2xl shadow-gray-200/50 flex flex-col justify-between group overflow-hidden relative transition-all cursor-pointer hover:scale-[1.02] ${t.estado === 'PROPUESTO' ? 'ring-2 ring-orange-400/30' : ''}`}
                            >
                                <div className={`absolute top-0 left-0 w-2 h-full ${t.estado === 'APROBADO' ? 'bg-primary' : t.estado === 'PROPUESTO' ? 'bg-orange-400' : 'bg-red-400'}`} />
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">{t.orientadoA}</span>
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${t.estado === 'APROBADO' ? 'bg-green-100 text-green-600' : t.estado === 'PROPUESTO' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                                {t.estado}
                                            </span>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                            <MoreVertical size={16} className="text-gray-300 cursor-pointer" />
                                        </button>
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

                                {t.estado === 'PROPUESTO' ? (
                                    <div className="grid grid-cols-2 gap-3 mt-8">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateTallerEstado(t.id, 'APROBADO'); showToast("Taller aprobado", "success"); }}
                                            className="py-4 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Check size={14} /> Aprobar
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateTallerEstado(t.id, 'RECHAZADO'); showToast("Propuesta rechazada", "info"); }}
                                            className="py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={14} /> Rechazar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedTallerDetail(t); }}
                                        className="w-full mt-8 py-4 bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-900 hover:bg-primary hover:text-white transition-all"
                                    >
                                        Gestionar Taller
                                    </button>
                                )}
                            </div>
                        ))}
                        <div
                            onClick={() => setShowNewTallerModal(true)}
                            className="card border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-12 hover:border-primary/50 transition-all cursor-pointer group"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                                <Plus size={32} />
                            </div>
                            <p className="font-black text-xs uppercase tracking-widest text-gray-400">Crear Nuevo Taller</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Nuevo Paciente */}
            {showNewModal && (
                <div className="modal-overlay z-[100] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-[#FFF9F5] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-y-auto max-h-[92vh] [&::-webkit-scrollbar]:w-0 scrollbar-hide">
                        <div className="p-10 border-b border-orange-100/50 flex justify-between items-center sticky top-0 bg-[#FFF9F5]/95 backdrop-blur-sm z-10">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Nuevo Paciente</h3>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Ficha de ingreso institucional</p>
                            </div>
                            <button onClick={() => setShowNewModal(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={28} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPaciente} className="p-10 space-y-10">
                            {/* Sección 1: Datos Generales y CUD */}
                            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] space-y-8 border border-orange-100/30 shadow-sm shadow-orange-900/5">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">I. Datos Generales e Identificación</h4>
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
                                        <input type="checkbox" id="tieneCUDNew" checked={newPacienteForm.tieneCUD}
                                            onChange={(e) => setNewPacienteForm({ ...newPacienteForm, tieneCUD: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary/20 cursor-pointer" />
                                        <label htmlFor="tieneCUDNew" className="text-[10px] font-black text-gray-900 uppercase tracking-widest cursor-pointer">Titular de CUD</label>
                                    </div>
                                    {newPacienteForm.tieneCUD && (
                                        <input type="text" placeholder="Nro de CUD" className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none"
                                            value={newPacienteForm.numeroCUD} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, numeroCUD: e.target.value })} />
                                    )}
                                </div>
                            </div>

                            {/* Sección 2: Escolaridad */}
                            <div className="bg-blue-50/30 p-6 rounded-[2rem] space-y-6">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">II. Nivel de Escolaridad</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel/Grado</label>
                                        <input type="text" placeholder="Ej: 3er Grado Primaria" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.escolaridad} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, escolaridad: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Escuela</label>
                                        <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.escuelaNombre} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, escuelaNombre: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Turno Escolar</label>
                                        <select className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.escuelaTurno} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, escuelaTurno: e.target.value as any })}>
                                            <option value="MAÑANA">Mañana</option>
                                            <option value="TARDE">Tarde</option>
                                            <option value="JORNADA_COMPLETA">Jornada Completa</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 3: Entorno Familiar */}
                            <div className="bg-orange-50/30 p-6 rounded-[2rem] space-y-6">
                                <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-4">III. Estructura y Entorno Familiar</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tutor Secundario</label>
                                        <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.tutorSecundarioNombre} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, tutorSecundarioNombre: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parentesco</label>
                                        <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.tutorSecundarioParentesco} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, tutorSecundarioParentesco: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono Tutor 2</label>
                                        <input type="text" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.tutorSecundarioTelefono} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, tutorSecundarioTelefono: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hermanos (Nombres y edades)</label>
                                        <input type="text" placeholder="Ej: Juan (10), Sofía (5)" className="input-voces w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none font-bold shadow-sm"
                                            value={newPacienteForm.hermanos} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, hermanos: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Composición Familiar (Con quién vive)</label>
                                        <textarea className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none h-24 resize-none font-medium text-gray-600 shadow-sm"
                                            placeholder="Detalla los miembros del grupo familiar conviviente..."
                                            value={newPacienteForm.composicionFamiliar} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, composicionFamiliar: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Sección 4: Información Clínica */}
                            <div className="bg-red-50/20 p-6 rounded-[2rem] space-y-6">
                                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4">IV. Información Clínica Específica</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diagnóstico Principal / Motivo de Consulta</label>
                                        <textarea className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary/20 outline-none h-24 resize-none font-medium text-gray-600 shadow-sm"
                                            placeholder="Describe brevemente la condición del paciente..."
                                            value={newPacienteForm.diagnosticoPrincipal} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, diagnosticoPrincipal: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" id="incapacidadFisicaNew" checked={newPacienteForm.discapacidadFisica}
                                                    onChange={(e) => setNewPacienteForm({ ...newPacienteForm, discapacidadFisica: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-gray-200 text-red-500 focus:ring-red-500/20 cursor-pointer" />
                                                <label htmlFor="incapacidadFisicaNew" className="text-[10px] font-black text-gray-900 uppercase tracking-widest cursor-pointer">Incapacidad Física</label>
                                            </div>
                                            {newPacienteForm.discapacidadFisica && (
                                                <textarea placeholder="Detallar incapacidad..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-medium outline-none h-20"
                                                    value={newPacienteForm.discapacidadFisicaDetalle} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, discapacidadFisicaDetalle: e.target.value })} />
                                            )}
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" id="retrasoDesarrolloNew" checked={newPacienteForm.retrasoDesarrollo}
                                                    onChange={(e) => setNewPacienteForm({ ...newPacienteForm, retrasoDesarrollo: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-gray-200 text-red-500 focus:ring-red-500/20 cursor-pointer" />
                                                <label htmlFor="retrasoDesarrolloNew" className="text-[10px] font-black text-gray-900 uppercase tracking-widest cursor-pointer">Retraso Madurativo/Desarrollo</label>
                                            </div>
                                            {newPacienteForm.retrasoDesarrollo && (
                                                <textarea placeholder="Detallar retraso..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-medium outline-none h-20"
                                                    value={newPacienteForm.retrasoDesarrolloDetalle} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, retrasoDesarrolloDetalle: e.target.value })} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 5: Emergencia y Otros */}
                            <div className="bg-gray-900 p-8 rounded-[2rem] text-white space-y-6">
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">V. Emergencia y Observaciones Finales</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Teléfono de Emergencia (24hs)</label>
                                        <input required type="text" className="w-full px-6 py-4 bg-white/10 border-none rounded-2xl outline-none font-bold text-white placeholder-white/20"
                                            value={newPacienteForm.telefonoEmergencia} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, telefonoEmergencia: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Notas Relevantes (Alergias, etc.)</label>
                                        <input type="text" className="w-full px-6 py-4 bg-white/10 border-none rounded-2xl outline-none font-bold text-white placeholder-white/20"
                                            value={newPacienteForm.notasRelevantes} onChange={(e) => setNewPacienteForm({ ...newPacienteForm, notasRelevantes: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full group bg-primary hover:bg-orange-600 text-white py-6 rounded-[2rem] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 transition-all active:scale-[0.98]">
                                <span className="font-black text-sm uppercase tracking-[0.2em]">Guardar Ficha del Paciente</span>
                                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Programar Turno */}
            {showTurnoModal && (
                <div className="modal-overlay z-[100] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
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
                            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <input
                                    type="checkbox"
                                    id="notificarEmailAdmin"
                                    checked={newTurnoForm.notificarEmail}
                                    onChange={(e) => setNewTurnoForm({ ...newTurnoForm, notificarEmail: e.target.checked })}
                                    className="w-5 h-5 rounded-lg border-orange-200 text-primary focus:ring-primary/20 cursor-pointer"
                                />
                                <label htmlFor="notificarEmailAdmin" className="text-xs font-black text-orange-900 uppercase tracking-widest cursor-pointer">
                                    Notificar por email a la familia
                                </label>
                            </div>
                            <button type="submit" className="w-full btn-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                Programar Turno
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Detalle Paciente */}
            {
                selectedPaciente && (
                    <div className="modal-overlay z-[100] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
                            <div className="bg-gray-900 p-10 text-white relative overflow-hidden">
                                <button onClick={() => setSelectedPaciente(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20">
                                    <X size={24} />
                                </button>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />

                                {/* Logo en el header */}
                                <div className="absolute top-6 left-6 z-20">
                                    <img src="/logo.png" alt="Voces" className="h-10 opacity-40 hover:opacity-100 transition-opacity" />
                                </div>

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
                            <div className="p-10 bg-gray-50/30 overflow-y-auto max-h-[60vh] space-y-8">
                                {/* Sección: Información Clínica y Escolar */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-primary rounded-full" /> Diagnóstico y Motivo
                                        </h4>
                                        <p className="text-sm text-gray-700 font-bold leading-relaxed">{selectedPaciente.diagnosticoPrincipal || "No especificado."}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-blue-500 rounded-full" /> Escolaridad
                                        </h4>
                                        <p className="text-sm text-gray-700 font-bold mb-1">{selectedPaciente.escolaridad} — {selectedPaciente.escuelaNombre || "Sin escuela"}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turno: {selectedPaciente.escuelaTurno?.replace('_', ' ') || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Sección: Desarrollo y Compromisos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-6 rounded-3xl shadow-sm border ${selectedPaciente.discapacidadFisica ? 'bg-red-50/30 border-red-100' : 'bg-white border-gray-100'}`}>
                                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-red-500 rounded-full" /> Compromiso Físico
                                        </h4>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {selectedPaciente.discapacidadFisica ? selectedPaciente.discapacidadFisicaDetalle : "Sin historial coincidente."}
                                        </p>
                                    </div>
                                    <div className={`p-6 rounded-3xl shadow-sm border ${selectedPaciente.retrasoDesarrollo ? 'bg-orange-50/30 border-orange-100' : 'bg-white border-gray-100'}`}>
                                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1 h-3 bg-orange-500 rounded-full" /> Retraso en Hitos
                                        </h4>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {selectedPaciente.retrasoDesarrollo ? selectedPaciente.retrasoDesarrolloDetalle : "Desarrollo típico reportado."}
                                        </p>
                                    </div>
                                </div>

                                {/* Sección: Entorno Familiar */}
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contexto Familiar y Convivencia</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Tutor Secundario</p>
                                                <p className="text-sm font-bold text-gray-800">{selectedPaciente.tutorSecundarioNombre || 'No registrado'} ({selectedPaciente.tutorSecundarioParentesco || '—'})</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hermanos</p>
                                                <p className="text-sm font-bold text-gray-800">{selectedPaciente.hermanos || 'Hijo único / No especificado'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Composición Familiar</p>
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{selectedPaciente.composicionFamiliar || 'Sin detalles de convivencia.'}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección: Contacto Emergencia y Notas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                    <div className="bg-gray-900 p-6 rounded-3xl text-white">
                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Contacto de Emergencia</h4>
                                        <p className="text-2xl font-black tabular-nums tracking-tighter">{selectedPaciente.telefonoEmergencia || 'Sin Nro.'}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Notas Relevantes</h4>
                                        <p className="text-sm text-gray-700 font-medium italic">"{selectedPaciente.notasRelevantes || "Ninguna."}"</p>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setViewingPatientFile(selectedPaciente)}
                                        className="flex-1 flex items-center justify-center space-x-3 bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
                                    >
                                        <Download size={18} />
                                        <span>Exportar Ficha Clínica</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedPaciente(null)}
                                        className="flex-1 py-5 rounded-2xl border-2 border-gray-200 font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-100 transition-all active:scale-[0.98]"
                                    >
                                        Finalizar Consulta
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Modal: Detalle de Taller y Gestión de Documentos */}
            {selectedTallerDetail && (
                <div className="modal-overlay z-[200] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-primary/5 p-8 border-b border-gray-100 relative flex-shrink-0">
                            <button onClick={() => setSelectedTallerDetail(null)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
                                <X size={24} className="text-gray-400" />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Clipboard size={24} />
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
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Descripción General</h4>
                                    <p className="text-gray-600 font-medium leading-relaxed">{selectedTallerDetail.descripcion}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Fecha y Hora</p>
                                        <p className="text-sm font-black text-gray-900">{new Date(selectedTallerDetail.fechaHora).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Cupo</p>
                                        <p className="text-sm font-black text-gray-900">{selectedTallerDetail.inscritos.length} / {selectedTallerDetail.cupoMaximo}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documentación y Recursos</h4>
                                    <div className="flex gap-2">
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
                                                                url: event.target?.result as string, // Simulación real con Data URL
                                                                tipo: docType
                                                            });
                                                            showToast("Documento subido correctamente", "success");
                                                            // La actualización la maneja el useEffect global de sincronización
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
                                </div>

                                <div className="space-y-3">
                                    {selectedTallerDetail.documentos && selectedTallerDetail.documentos.length > 0 ? (
                                        selectedTallerDetail.documentos.map(doc => (
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
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sin documentos cargados</p>
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
                                Cerrar Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Nuevo Taller */}
            {showNewTallerModal && (
                <div className="modal-overlay z-[200] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-primary p-8 text-white relative flex-shrink-0">
                            <button onClick={() => setShowNewTallerModal(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20">
                                <X size={24} />
                            </button>
                            <h3 className="text-3xl font-black tracking-tighter">Nuevo Taller Institucional</h3>
                            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mt-1">Crear actividad grupal aprobada directamente</p>
                        </div>
                        <form onSubmit={handleAddTaller} className="p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Taller</label>
                                <input required type="text" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                    value={newTallerForm.nombre} onChange={(e) => setNewTallerForm({ ...newTallerForm, nombre: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción</label>
                                <textarea required className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none h-32 resize-none font-medium text-gray-600"
                                    value={newTallerForm.descripcion} onChange={(e) => setNewTallerForm({ ...newTallerForm, descripcion: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Orientado a</label>
                                    <input required type="text" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                        value={newTallerForm.orientadoA} onChange={(e) => setNewTallerForm({ ...newTallerForm, orientadoA: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha y Hora</label>
                                    <input required type="datetime-local" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                        value={newTallerForm.fechaHora} onChange={(e) => setNewTallerForm({ ...newTallerForm, fechaHora: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cupo Máximo</label>
                                    <input required type="number" className="input-voces w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none font-bold"
                                        value={newTallerForm.cupoMaximo} onChange={(e) => setNewTallerForm({ ...newTallerForm, cupoMaximo: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-orange-600 transition-all active:scale-[0.98]">
                                Publicar Taller
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Patient File Viewer (PDF) */}
            {viewingPatientFile && (
                <PatientFileViewer
                    paciente={viewingPatientFile}
                    onClose={() => setViewingPatientFile(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
