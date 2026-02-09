import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Plus, X } from 'lucide-react';

interface Turno {
    id: string;
    pacienteId: string;
    pacienteNombre: string;
    profesionalId: string;
    profesionalNombre: string;
    fecha: string; // YYYY-MM-DD
    horaInicio: string; // HH:mm
    horaFin: string; // HH:mm
    estado: 'CONFIRMADO' | 'PENDIENTE' | 'CANCELADO' | 'COMPLETADO';
    notas?: string;
}

interface CalendarProps {
    turnos: Turno[];
    onAddTurno?: (turno: Omit<Turno, 'id'>) => void;
    onEditTurno?: (turno: Turno) => void;
    onDeleteTurno?: (id: string) => void;
    profesionales: Array<{ id: string; nombre: string; apellido: string }>;
    pacientes: Array<{ id: string; nombre: string; apellido: string }>;
    userRole?: 'ADMIN' | 'PROFESIONAL';
    currentUserId?: string;
}

type ViewMode = 'day' | 'week' | 'month';

const Calendar: React.FC<CalendarProps> = ({
    turnos,
    onAddTurno,
    onEditTurno,
    onDeleteTurno,
    profesionales,
    pacientes,
    userRole = 'ADMIN',
    currentUserId
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);

    // Navegación de fechas
    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
        else if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
        else if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const goToToday = () => setCurrentDate(new Date());

    // Formatear título según vista
    const getTitle = () => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            ...(viewMode === 'day' && { day: 'numeric' })
        };
        return currentDate.toLocaleDateString('es-ES', options);
    };

    // Obtener días de la semana
    const getWeekDays = () => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
        startOfWeek.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push(date);
        }
        return days;
    };

    // Obtener días del mes
    const getMonthDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        const dayOfWeek = firstDay.getDay();
        startDate.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const days = [];
        const current = new Date(startDate);
        while (current <= lastDay || days.length % 7 !== 0) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return days;
    };

    // Filtrar turnos por fecha
    const getTurnosForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return turnos.filter(t => t.fecha === dateStr);
    };

    // Horas del día (8:00 - 20:00)
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);

    const estadoColors = {
        CONFIRMADO: 'bg-green-100 text-green-700 border-green-300',
        PENDIENTE: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        CANCELADO: 'bg-red-100 text-red-700 border-red-300',
        COMPLETADO: 'bg-blue-100 text-blue-700 border-blue-300'
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <CalendarIcon size={32} className="font-black" />
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter">{getTitle()}</h2>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-90">Gestión de Turnos</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-white text-primary rounded-2xl font-black text-sm hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Nuevo Turno
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={goToPrevious} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={goToToday} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-all">
                            Hoy
                        </button>
                        <button onClick={goToNext} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-white text-primary' : 'bg-white/20 hover:bg-white/30'
                                    }`}
                            >
                                {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vista Día */}
            {viewMode === 'day' && (
                <div className="p-6">
                    <div className="grid grid-cols-[80px_1fr] gap-4">
                        <div className="space-y-4 pt-8">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 text-xs font-black text-gray-400 text-right pr-4">
                                    {hour}:00
                                </div>
                            ))}
                        </div>
                        <div className="border-l-2 border-gray-100 pl-4 space-y-4 pt-8">
                            {hours.map(hour => {
                                const hourTurnos = getTurnosForDate(currentDate).filter(t => {
                                    const startHour = parseInt(t.horaInicio.split(':')[0]);
                                    return startHour === hour;
                                });
                                return (
                                    <div key={hour} className="h-20 border-b border-gray-50 relative">
                                        {hourTurnos.map(turno => (
                                            <div
                                                key={turno.id}
                                                onClick={() => setSelectedTurno(turno)}
                                                className={`absolute left-0 right-0 p-3 rounded-xl border-2 cursor-pointer hover:shadow-lg transition-all ${estadoColors[turno.estado]}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-black text-sm">{turno.pacienteNombre}</p>
                                                        <p className="text-xs font-bold opacity-75">{turno.profesionalNombre}</p>
                                                    </div>
                                                    <div className="text-xs font-black">
                                                        {turno.horaInicio} - {turno.horaFin}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Vista Semana */}
            {viewMode === 'week' && (
                <div className="p-6 overflow-x-auto">
                    <div className="grid grid-cols-[80px_repeat(7,minmax(150px,1fr))] gap-2">
                        <div></div>
                        {getWeekDays().map((day, i) => (
                            <div key={i} className="text-center pb-4 border-b-2 border-gray-100">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                                </p>
                                <p className={`text-2xl font-black mt-1 ${day.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-gray-800'
                                    }`}>
                                    {day.getDate()}
                                </p>
                            </div>
                        ))}

                        {hours.map(hour => (
                            <React.Fragment key={hour}>
                                <div className="text-xs font-black text-gray-400 text-right pr-4 pt-2">
                                    {hour}:00
                                </div>
                                {getWeekDays().map((day, i) => {
                                    const dayTurnos = getTurnosForDate(day).filter(t => {
                                        const startHour = parseInt(t.horaInicio.split(':')[0]);
                                        return startHour === hour;
                                    });
                                    return (
                                        <div key={i} className="min-h-[60px] border border-gray-50 rounded-xl p-1 space-y-1">
                                            {dayTurnos.map(turno => (
                                                <div
                                                    key={turno.id}
                                                    onClick={() => setSelectedTurno(turno)}
                                                    className={`p-2 rounded-lg text-xs cursor-pointer hover:shadow-md transition-all ${estadoColors[turno.estado]}`}
                                                >
                                                    <p className="font-black truncate">{turno.pacienteNombre}</p>
                                                    <p className="font-bold opacity-75 text-[10px] truncate">{turno.profesionalNombre}</p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Vista Mes */}
            {viewMode === 'month' && (
                <div className="p-6">
                    <div className="grid grid-cols-7 gap-2">
                        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                            <div key={day} className="text-center text-xs font-black text-gray-400 uppercase tracking-widest pb-2">
                                {day}
                            </div>
                        ))}
                        {getMonthDays().map((day, i) => {
                            const dayTurnos = getTurnosForDate(day);
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                            const isToday = day.toDateString() === new Date().toDateString();
                            return (
                                <div
                                    key={i}
                                    className={`min-h-[100px] border-2 rounded-2xl p-2 ${isToday ? 'border-primary bg-primary/5' : 'border-gray-100'
                                        } ${!isCurrentMonth && 'opacity-40'}`}
                                >
                                    <p className={`text-sm font-black mb-2 ${isToday ? 'text-primary' : 'text-gray-600'}`}>
                                        {day.getDate()}
                                    </p>
                                    <div className="space-y-1">
                                        {dayTurnos.slice(0, 3).map(turno => (
                                            <div
                                                key={turno.id}
                                                onClick={() => setSelectedTurno(turno)}
                                                className={`p-1 rounded-lg text-[10px] font-bold cursor-pointer ${estadoColors[turno.estado]}`}
                                            >
                                                <p className="truncate">{turno.horaInicio}</p>
                                            </div>
                                        ))}
                                        {dayTurnos.length > 3 && (
                                            <p className="text-[10px] font-black text-gray-400">+{dayTurnos.length - 3} más</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal: Detalle de Turno */}
            {selectedTurno && (
                <TurnoDetailModal
                    turno={selectedTurno}
                    onClose={() => setSelectedTurno(null)}
                    onEdit={onEditTurno}
                    onDelete={onDeleteTurno}
                />
            )}

            {/* Modal: Nuevo Turno */}
            {showAddModal && (
                <AddTurnoModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={onAddTurno}
                    profesionales={profesionales}
                    pacientes={pacientes}
                    userRole={userRole}
                    currentUserId={currentUserId}
                />
            )}
        </div>
    );
};

// Modal de Detalle de Turno
const TurnoDetailModal: React.FC<{
    turno: Turno;
    onClose: () => void;
    onEdit?: (turno: Turno) => void;
    onDelete?: (id: string) => void;
}> = ({ turno, onClose, onEdit, onDelete }) => {
    return (
        <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-6 text-white relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all">
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black tracking-tighter">Detalle del Turno</h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-90 mt-1">
                        {turno.fecha} • {turno.horaInicio} - {turno.horaFin}
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Paciente</p>
                        <p className="text-lg font-black text-gray-800">{turno.pacienteNombre}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Profesional</p>
                        <p className="text-lg font-black text-gray-800">{turno.profesionalNombre}</p>
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Estado</p>
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest inline-block ${turno.estado === 'CONFIRMADO' ? 'bg-green-100 text-green-700' :
                                turno.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                                    turno.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                            }`}>
                            {turno.estado}
                        </span>
                    </div>
                    {turno.notas && (
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Notas</p>
                            <p className="text-sm text-gray-600">{turno.notas}</p>
                        </div>
                    )}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => onDelete?.(turno.id)}
                            className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all"
                        >
                            Cancelar Turno
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal de Agregar Turno
const AddTurnoModal: React.FC<{
    onClose: () => void;
    onAdd?: (turno: Omit<Turno, 'id'>) => void;
    profesionales: Array<{ id: string; nombre: string; apellido: string }>;
    pacientes: Array<{ id: string; nombre: string; apellido: string }>;
    userRole?: 'ADMIN' | 'PROFESIONAL';
    currentUserId?: string;
}> = ({ onClose, onAdd, profesionales, pacientes, userRole, currentUserId }) => {
    const [form, setForm] = useState({
        pacienteId: '',
        profesionalId: userRole === 'PROFESIONAL' ? currentUserId || '' : '',
        fecha: new Date().toISOString().split('T')[0],
        horaInicio: '09:00',
        horaFin: '10:00',
        estado: 'CONFIRMADO' as const,
        notas: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const paciente = pacientes.find(p => p.id === form.pacienteId);
        const profesional = profesionales.find(p => p.id === form.profesionalId);

        if (!paciente || !profesional) return;

        onAdd?.({
            ...form,
            pacienteNombre: `${paciente.nombre} ${paciente.apellido}`,
            profesionalNombre: `${profesional.nombre} ${profesional.apellido}`
        });
        onClose();
    };

    return (
        <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Nuevo Turno</h3>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Asignar cita profesional</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Paciente</label>
                                <select
                                    required
                                    value={form.pacienteId}
                                    onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                >
                                    <option value="">Seleccionar paciente...</option>
                                    {pacientes.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profesional</label>
                                <select
                                    required
                                    value={form.profesionalId}
                                    onChange={(e) => setForm({ ...form, profesionalId: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                    disabled={userRole === 'PROFESIONAL'}
                                >
                                    <option value="">Seleccionar profesional...</option>
                                    {profesionales.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha</label>
                                <input
                                    required
                                    type="date"
                                    value={form.fecha}
                                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
                                <select
                                    value={form.estado}
                                    onChange={(e) => setForm({ ...form, estado: e.target.value as any })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                >
                                    <option value="CONFIRMADO">Confirmado</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hora Inicio</label>
                                <input
                                    required
                                    type="time"
                                    value={form.horaInicio}
                                    onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hora Fin</label>
                                <input
                                    required
                                    type="time"
                                    value={form.horaFin}
                                    onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notas (Opcional)</label>
                            <textarea
                                value={form.notas}
                                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none font-medium"
                                placeholder="Observaciones adicionales..."
                            />
                        </div>

                        <button type="submit" className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-widest">
                            Crear Turno
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
export type { Turno, CalendarProps };
