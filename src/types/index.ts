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
    escuelaNombre?: string;
    escuelaTurno?: "MAÑANA" | "TARDE" | "JORNADA_COMPLETA";
    tutorPrincipalId: string;
    tutorSecundarioNombre?: string;
    tutorSecundarioParentesco?: string;
    tutorSecundarioTelefono?: string;
    obrasSociales: string[];
    notasRelevantes: string;
    // Campos solicitados por el usuario
    discapacidadFisica: boolean;
    discapacidadFisicaDetalle?: string;
    retrasoDesarrollo: boolean;
    retrasoDesarrolloDetalle?: string;
    hermanos?: string;
    composicionFamiliar?: string;
    telefonoEmergencia: string;
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

export type TipoInforme = "EVALUACION_INICIAL" | "INFORME_INTERDISCIPLINARIO" | "SEGUIMIENTO" | "ALTA" | "INTERCONSULTA";

// Informe Técnico Específico por Especialidad
export interface InformeTecnicoPsicologia {
    motivoConsulta: string;
    antecedentes: string;
    observacionesConductuales: string;
    pruebasAplicadas: string[];
    resultadosPruebas: string;
    diagnosticoPresuntivo: string;
    planTerapeutico: string;
    objetivosTerapeuticos: string;
    tecnicasUtilizadas: string;
    evolucion: string;
    pronostico: string;
}

export interface InformeTecnicoPsicopedagogia {
    motivoConsulta: string;
    antecedentesEscolares: string;
    nivelPedagogico: string;
    areasEvaluadas: string[];
    lectoescritura: string;
    matematica: string;
    atencionConcentracion: string;
    memoria: string;
    funcionesEjecutivas: string;
    estrategiasAprendizaje: string;
    adaptacionesCurriculares: string;
    planIntervencion: string;
}

export interface InformeTecnicoFonoaudiologia {
    motivoConsulta: string;
    antecedentes: string;
    desarrolloLenguaje: string;
    lenguajeComprensivo: string;
    lenguajeExpresivo: string;
    articulacion: string;
    fluidezVerbal: string;
    vozResonancia: string;
    deglucion: string;
    audicion: string;
    praxiasBucofonatorias: string;
    diagnosticoFonoaudiologico: string;
    planTerapeutico: string;
}

export interface InformeTecnicoKinesiologia {
    motivoConsulta: string;
    antecedentes: string;
    evaluacionPostural: string;
    rangoMovilidad: string;
    fuerzaMuscular: string;
    tono: string;
    equilibrioCoordinacion: string;
    marcha: string;
    desarrolloMotor: string;
    dolorLimitaciones: string;
    diagnosticoKinesico: string;
    objetivosTerapeuticos: string;
    planTratamiento: string;
}

export interface InformeTecnicoNeurologia {
    motivoConsulta: string;
    antecedentesPrePeriPostnatales: string;
    desarrolloPsicomotor: string;
    examenNeurologico: string;
    paresCraneales: string;
    reflejos: string;
    tono: string;
    fuerza: string;
    sensibilidad: string;
    coordinacion: string;
    marcha: string;
    lenguaje: string;
    conductaCognitivo: string;
    estudiosComplementarios: string;
    diagnosticoNeurologico: string;
    tratamientoIndicado: string;
    seguimiento: string;
}

export type InformeTecnicoData =
    | InformeTecnicoPsicologia
    | InformeTecnicoPsicopedagogia
    | InformeTecnicoFonoaudiologia
    | InformeTecnicoKinesiologia
    | InformeTecnicoNeurologia;

// Informe General para Familias (lenguaje accesible)
export interface InformeGeneral {
    situacionActual: string;
    progresoObservado: string;
    areasFortaleza: string;
    areasTrabajar: string;
    recomendacionesFamilia: string;
    actividadesCasa: string;
    proximosPasos: string;
    observacionesAdicionales: string;
}

// Informe Completo (Técnico + General)
export interface Informe {
    id: string;
    pacienteId: string;
    creadoPorProfesionalId: string;
    especialidadProfesional: Especialidad;
    coProfesionalesIds: string[]; // Para interconsultas
    tipo: TipoInforme;
    fecha: string;

    // Informe Técnico (específico por especialidad)
    informeTecnico: InformeTecnicoData;

    // Informe General (auto-generado desde el técnico, editable)
    informeGeneral: InformeGeneral;

    // Metadata
    visibleParaFamilia: boolean;
    requiereInterconsulta: boolean;
    especialidadesInterconsulta?: Especialidad[];
    estadoInterconsulta?: "PENDIENTE" | "EN_REVISION" | "COMPLETADA";
}

// Interconsulta entre profesionales
export interface Interconsulta {
    id: string;
    informeOrigenId: string;
    profesionalSolicitanteId: string;
    profesionalDestinatarioId: string;
    especialidadDestino: Especialidad;
    motivoInterconsulta: string;
    preguntasEspecificas: string;
    respuesta?: string;
    informeRespuestaId?: string;
    estado: "PENDIENTE" | "EN_REVISION" | "RESPONDIDA";
    fechaSolicitud: string;
    fechaRespuesta?: string;
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
    estado: "PROPUESTO" | "APROBADO" | "RECHAZADO";
    creadoPorId: string; // ID del profesional o admin que lo crea
    documentos?: {
        id: string;
        nombre: string;
        url: string;
        fecha: string;
        tipo: 'PDF' | 'IMAGE' | 'DOC';
    }[];
}
