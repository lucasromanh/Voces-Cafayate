export type Role = "ADMIN" | "PROFESIONAL" | "PACIENTE_TUTOR";

export interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: Role;
    activo: boolean;
    avatar?: string;
}

export type Especialidad =
    | "Psicología"
    | "Psicopedagogía"
    | "Fonoaudiología"
    | "Kinesiología"
    | "Fisioterapia"
    | "Psicomotricidad"
    | "Neurología Infantil"
    | "Pediatría"
    | "Atención Temprana";

export interface Profesional {
    id: string;
    usuarioId: string;
    especialidad: Especialidad;
    matricula: string;
    diasDeAtencion: string[];
    horarios: string[];
    bio: string;
    aceptaObrasSociales: boolean;
    obrasSociales: string[]; // ids
}

export interface Paciente {
    id: string;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    documento: string;
    tieneCUD: boolean;
    numeroCUD?: string;
    diagnosticoPrincipal: string;
    escolaridad: string;
    tutorPrincipalId: string;
    obrasSociales: string[];
    notasRelevantes: string;
}

export interface ObraSocial {
    id: string;
    nombre: string;
    plan: string;
    notas: string;
}

export type TipoTurno = "ENTREVISTA_INICIAL" | "SESION" | "CONTROL" | "TALLER";
export type EstadoTurno = "PENDIENTE" | "CONFIRMADO" | "ASISTIO" | "AUSENTE" | "CANCELADO";
export type ModoTurno = "PRESENCIAL" | "VIRTUAL";

export interface Turno {
    id: string;
    pacienteId: string;
    profesionalId: string;
    fechaHora: string;
    tipo: TipoTurno;
    estado: EstadoTurno;
    modo: ModoTurno;
    notas: string;
}

export type TipoInforme = "EVALUACION_INICIAL" | "INFORME_INTERDISCIPLINARIO" | "SEGUIMIENTO" | "ALTA";

export interface Informe {
    id: string;
    pacienteId: string;
    creadoPorProfesionalId: string;
    coProfesionalesIds: string[];
    tipo: TipoInforme;
    fecha: string;
    resumen: string;
    objetivos: string;
    intervencionesRealizadas: string;
    sugerenciasFamilia: string;
    visibleParaFamilia: boolean;
}

export interface Seguimiento {
    id: string;
    pacienteId: string;
    profesionalId: string;
    fecha: string;
    descripcion: string;
    estado: "PENDIENTE" | "EN_PROCESO" | "COMPLETADO";
}

export interface Taller {
    id: string;
    nombre: string;
    descripcion: string;
    orientadoA: string;
    fechaHora: string;
    cupoMaximo: number;
    profesionalesResponsables: string[];
    inscritos: string[]; // pacienteId or tutorId
}
