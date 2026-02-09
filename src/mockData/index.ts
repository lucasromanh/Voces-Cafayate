import { Usuario, Profesional, Paciente, ObraSocial, Turno, Taller } from '../types';

export const mockUsuarios: Usuario[] = [
    { id: 'u1', nombre: 'Admin', apellido: 'Voces', email: 'admin@voces.com', telefono: '3868123456', rol: 'ADMIN', activo: true },
    { id: 'u2', nombre: 'Laura', apellido: 'García', email: 'laura@voces.com', telefono: '3868123457', rol: 'PROFESIONAL', activo: true },
    { id: 'u3', nombre: 'Carlos', apellido: 'Pérez', email: 'carlos@voces.com', telefono: '3868123458', rol: 'PROFESIONAL', activo: true },
    { id: 'u4', nombre: 'María', apellido: 'López', email: 'maria@gmail.com', telefono: '3868123459', rol: 'PACIENTE_TUTOR', activo: true },
];

export const mockObrasSociales: ObraSocial[] = [
    { id: 'os1', nombre: 'OSDE', plan: '210', notas: '' },
    { id: 'os2', nombre: 'Swiss Medical', plan: 'SMG20', notas: '' },
    { id: 'os3', nombre: 'IPS', plan: 'Familiar', notas: 'Obra social provincial' },
];

export const mockProfesionales: Profesional[] = [
    {
        id: 'p1',
        usuarioId: 'u2',
        especialidad: 'Psicología',
        matricula: 'MP 1234',
        diasDeAtencion: ['Lunes', 'Miércoles'],
        horarios: ['08:00', '09:00', '10:00', '11:00'],
        bio: 'Especialista en psicología infantil y adolescencia.',
        aceptaObrasSociales: true,
        obrasSociales: ['os1', 'os3']
    },
    {
        id: 'p2',
        usuarioId: 'u3',
        especialidad: 'Psicopedagogía',
        matricula: 'MP 5678',
        diasDeAtencion: ['Martes', 'Jueves'],
        horarios: ['15:00', '16:00', '17:00'],
        bio: 'Acompañamiento en procesos de aprendizaje.',
        aceptaObrasSociales: false,
        obrasSociales: []
    }
];

export const mockPacientes: Paciente[] = [
    {
        id: 'pa1',
        nombre: 'Mateo',
        apellido: 'López',
        fechaNacimiento: '2018-05-20',
        documento: '50123456',
        tieneCUD: true,
        numeroCUD: 'CUD-9988-77',
        diagnosticoPrincipal: 'TEL (Trastorno Específico del Lenguaje)',
        escolaridad: 'Primaria - Escuela Normal',
        tutorPrincipalId: 'u4',
        obrasSociales: ['os1'],
        notasRelevantes: 'Alergia al gluten.'
    }
];

export const mockTurnos: Turno[] = [
    {
        id: 't1',
        pacienteId: 'pa1',
        profesionalId: 'p1',
        fechaHora: new Date(Date.now() + 86400000).toISOString(), // Mañana
        tipo: 'SESION',
        estado: 'PENDIENTE',
        modo: 'PRESENCIAL',
        notas: 'Primera sesión del mes.'
    }
];

export const mockTalleres: Taller[] = [
    {
        id: 'tal1',
        nombre: 'Taller de Emociones',
        descripcion: 'Espacio para reconocer y expresar emociones a través del juego.',
        orientadoA: 'Niños',
        fechaHora: new Date(Date.now() + 172800000).toISOString(),
        cupoMaximo: 10,
        profesionalesResponsables: ['p1'],
        inscritos: ['pa1']
    }
];
