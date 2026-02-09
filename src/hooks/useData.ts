import { useState, useEffect } from 'react';
import { mockPacientes, mockProfesionales, mockTurnos, mockUsuarios, mockObrasSociales, mockTalleres } from '../mockData';
import { Paciente, Profesional, Turno, Usuario, ObraSocial, Taller, Informe, Seguimiento } from '../types';

// Simple persistence simulator
const getStored = <T>(key: string, initial: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
};

const setStored = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const useData = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>(() => getStored('voces_pacientes', mockPacientes));
    const [profesionales, setProfesionales] = useState<Profesional[]>(() => getStored('voces_profesionales', mockProfesionales));
    const [turnos, setTurnos] = useState<Turno[]>(() => getStored('voces_turnos', mockTurnos));
    const [usuarios, setUsuarios] = useState<Usuario[]>(() => getStored('voces_usuarios', mockUsuarios));
    const [obrasSociales, setObrasSociales] = useState<ObraSocial[]>(() => getStored('voces_obras_sociales', mockObrasSociales));
    const [talleres, setTalleres] = useState<Taller[]>(() => getStored('voces_talleres', mockTalleres));
    const [informes, setInformes] = useState<Informe[]>(() => getStored('voces_informes', []));
    const [seguimientos, setSeguimientos] = useState<Seguimiento[]>(() => getStored('voces_seguimientos', []));

    useEffect(() => {
        setStored('voces_pacientes', pacientes);
        setStored('voces_profesionales', profesionales);
        setStored('voces_turnos', turnos);
        setStored('voces_usuarios', usuarios);
        setStored('voces_obras_sociales', obrasSociales);
        setStored('voces_talleres', talleres);
        setStored('voces_informes', informes);
        setStored('voces_seguimientos', seguimientos);
    }, [pacientes, profesionales, turnos, usuarios, obrasSociales, talleres, informes, seguimientos]);

    // CRUD Operations
    const addPaciente = (p: Omit<Paciente, 'id'>) => {
        const newP = { ...p, id: Math.random().toString(36).substr(2, 9) };
        setPacientes([...pacientes, newP]);
        return newP;
    };

    const updatePaciente = (id: string, updates: Partial<Paciente>) => {
        setPacientes(pacientes.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addTurno = (t: Omit<Turno, 'id'>) => {
        const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
        setTurnos([...turnos, newT]);
        // Mock email notification
        console.log('STITCH-LOOP: Turno creado, notificando vía Email...', newT);
        return newT;
    };

    const updateTurnoEstado = (id: string, estado: Turno['estado']) => {
        setTurnos(turnos.map(t => t.id === id ? { ...t, estado } : t));
    };

    const addInforme = (i: Omit<Informe, 'id'>) => {
        const newI = { ...i, id: Math.random().toString(36).substr(2, 9) };
        setInformes([...informes, newI]);
        if (newI.visibleParaFamilia) {
            console.log('STITCH-LOOP: Nuevo informe visible para familia, enviando notificación...');
        }
        return newI;
    };

    const updateInforme = (id: string, updates: Partial<Informe>) => {
        setInformes(informes.map(i => i.id === id ? { ...i, ...updates } : i));
    };

    const addSeguimiento = (s: Omit<Seguimiento, 'id'>) => {
        const newS = { ...s, id: Math.random().toString(36).substr(2, 9) };
        setSeguimientos([...seguimientos, newS]);
        return newS;
    };

    const addTaller = (t: Omit<Taller, 'id'>) => {
        const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
        setTalleres([...talleres, newT]);
        return newT;
    };

    const updateTallerEstado = (id: string, estado: Taller['estado']) => {
        setTalleres(talleres.map(t => t.id === id ? { ...t, estado } : t));
    };

    const addDocumentoTaller = (tallerId: string, doc: Omit<NonNullable<Taller['documentos']>[0], 'id' | 'fecha'>) => {
        setTalleres(talleres.map(t => {
            if (t.id === tallerId) {
                const newDoc = {
                    ...doc,
                    id: Math.random().toString(36).substr(2, 9),
                    fecha: new Date().toISOString()
                };
                return { ...t, documentos: [...(t.documentos || []), newDoc] };
            }
            return t;
        }));
    };

    const toggleSeguimiento = (id: string) => {
        setSeguimientos(seguimientos.map(s => s.id === id ? { ...s, estado: s.estado === 'COMPLETADO' ? 'PENDIENTE' : 'COMPLETADO' } : s));
    };

    return {
        pacientes, profesionales, turnos, usuarios, obrasSociales, talleres, informes, seguimientos,
        addPaciente, updatePaciente, addTurno, updateTurnoEstado, addInforme, updateInforme, addSeguimiento, toggleSeguimiento,
        addTaller, updateTallerEstado, addDocumentoTaller
    };
};
