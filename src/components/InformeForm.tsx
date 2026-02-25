import React, { useState, useEffect } from 'react';
import { X, FileText, Users, AlertCircle, CheckCircle2, Sparkles, Mic, Ear, Brain, ClipboardList, Target, Stethoscope } from 'lucide-react';
import {
    Especialidad,
    InformeTecnicoPsicologia,
    InformeTecnicoPsicopedagogia,
    InformeTecnicoFonoaudiologia,
    InformeTecnicoKinesiologia,
    InformeTecnicoNeurologia,
    InformeGeneral,
    TipoInforme
} from '../types';

interface InformeFormProps {
    especialidad: Especialidad;
    pacienteId: string;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

const InformeForm: React.FC<InformeFormProps> = ({ especialidad, pacienteId, onClose, onSave, initialData }) => {
    const [activeTab, setActiveTab] = useState<'tecnico' | 'general'>('tecnico');
    const [autoGenerating, setAutoGenerating] = useState(false);

    // Informe Técnico (varía según especialidad)
    const [informeTecnico, setInformeTecnico] = useState<any>(initialData?.informeTecnico || {});

    // Informe General (común para todas las especialidades)
    const [informeGeneral, setInformeGeneral] = useState<InformeGeneral>(initialData?.informeGeneral || {
        situacionActual: '',
        progresoObservado: '',
        areasFortaleza: '',
        areasTrabajar: '',
        recomendacionesFamilia: '',
        actividadesCasa: '',
        proximosPasos: '',
        observacionesAdicionales: ''
    });

    const [tipoInforme, setTipoInforme] = useState<TipoInforme>(initialData?.tipo || 'SEGUIMIENTO');
    const [requiereInterconsulta, setRequiereInterconsulta] = useState(initialData?.requiereInterconsulta || false);
    const [especialidadesInterconsulta, setEspecialidadesInterconsulta] = useState<Especialidad[]>(initialData?.especialidadesInterconsulta || []);
    const [visibleParaFamilia, setVisibleParaFamilia] = useState(initialData?.visibleParaFamilia !== undefined ? initialData.visibleParaFamilia : true);

    useEffect(() => {
        if (initialData) {
            setInformeTecnico(initialData.informeTecnico || {});
            setInformeGeneral(initialData.informeGeneral || {});
            setTipoInforme(initialData.tipo || 'SEGUIMIENTO');
            setRequiereInterconsulta(initialData.requiereInterconsulta || false);
            setEspecialidadesInterconsulta(initialData.especialidadesInterconsulta || []);
            setVisibleParaFamilia(initialData.visibleParaFamilia !== undefined ? initialData.visibleParaFamilia : true);
        }
    }, [initialData]);

    // Auto-generar informe general desde el técnico
    const autoGenerarInformeGeneral = () => {
        setAutoGenerating(true);

        setTimeout(() => {
            let generado: Partial<InformeGeneral> = {};

            switch (especialidad) {
                case 'Psicología':
                    const psi = informeTecnico as InformeTecnicoPsicologia;
                    generado = {
                        situacionActual: psi.motivoConsulta ? `El paciente se encuentra en proceso terapéutico por ${psi.motivoConsulta.toLowerCase()}.` : '',
                        progresoObservado: psi.evolucion || '',
                        areasFortaleza: psi.observacionesConductuales ? `Se observan aspectos positivos en: ${psi.observacionesConductuales}` : '',
                        areasTrabajar: psi.objetivosTerapeuticos || '',
                        recomendacionesFamilia: 'Se sugiere mantener un ambiente de contención y apoyo emocional.',
                        proximosPasos: psi.planTerapeutico || ''
                    };
                    break;

                case 'Psicopedagogía':
                    const psico = informeTecnico as InformeTecnicoPsicopedagogia;
                    generado = {
                        situacionActual: `El niño/a se encuentra en nivel pedagógico ${psico.nivelPedagogico || 'en evaluación'}.`,
                        progresoObservado: psico.estrategiasAprendizaje ? `Se observa progreso en estrategias de aprendizaje.` : '',
                        areasFortaleza: psico.lectoescritura && psico.matematica ? `Fortalezas en áreas académicas.` : '',
                        areasTrabajar: psico.planIntervencion || '',
                        recomendacionesFamilia: 'Acompañar las tareas escolares con paciencia y refuerzo positivo.',
                        actividadesCasa: psico.adaptacionesCurriculares || '',
                        proximosPasos: psico.planIntervencion || ''
                    };
                    break;

                case 'Fonoaudiología':
                    const fono = informeTecnico as InformeTecnicoFonoaudiologia;
                    generado = {
                        situacionActual: fono.motivoConsulta
                            ? `El/la paciente asiste a consulta fonoaudiológica por ${fono.motivoConsulta.toLowerCase()}.`
                            : '',
                        progresoObservado: fono.analisisClinico
                            ? fono.analisisClinico.substring(0, 200) + (fono.analisisClinico.length > 200 ? '...' : '')
                            : fono.evaluacionLenguajeExpresion ? 'Se observan aspectos en desarrollo en el área del lenguaje.' : '',
                        areasFortaleza: fono.evaluacionLenguajeComprension
                            ? 'Se observa una adecuada comprensión del lenguaje a nivel contextual.'
                            : '',
                        areasTrabajar: fono.objetivosTerapeuticos || fono.planEstrategias || '',
                        recomendacionesFamilia: fono.recomendacionesFamilia
                            || 'Se sugiere estimular la comunicación en el hogar mediante juegos, lectura compartida y conversación cotidiana.',
                        actividadesCasa: `Realizar los ejercicios indicados por el/la profesional. ${fono.planFrecuencia ? 'Frecuencia sugerida de sesiones: ' + fono.planFrecuencia + '.' : ''}`,
                        proximosPasos: fono.planEstrategias
                            ? `Continuaremos trabajando con las siguientes estrategias: ${fono.planEstrategias.substring(0, 150)}...`
                            : fono.impresionFonoaudiologica || '',
                        observacionesAdicionales: fono.recomendacionesEscuela
                            ? `Recomendaciones para la institución educativa: ${fono.recomendacionesEscuela}`
                            : ''
                    };
                    break;

                case 'Kinesiología':
                    const kine = informeTecnico as InformeTecnicoKinesiologia;
                    generado = {
                        situacionActual: kine.motivoConsulta || '',
                        progresoObservado: kine.desarrolloMotor ? `Avances en desarrollo motor.` : '',
                        areasFortaleza: kine.equilibrioCoordinacion ? `Buen equilibrio y coordinación.` : '',
                        areasTrabajar: kine.objetivosTerapeuticos || '',
                        recomendacionesFamilia: 'Fomentar la actividad física adaptada y el juego activo.',
                        actividadesCasa: 'Ejercicios de movilidad y fortalecimiento según indicación.',
                        proximosPasos: kine.planTratamiento || ''
                    };
                    break;

                case 'Neurología Infantil':
                    const neuro = informeTecnico as InformeTecnicoNeurologia;
                    generado = {
                        situacionActual: neuro.motivoConsulta || '',
                        progresoObservado: neuro.desarrolloPsicomotor ? `Desarrollo psicomotor en evolución.` : '',
                        areasFortaleza: neuro.conductaCognitivo ? `Aspectos cognitivos preservados.` : '',
                        areasTrabajar: neuro.tratamientoIndicado || '',
                        recomendacionesFamilia: 'Seguir las indicaciones médicas y mantener controles periódicos.',
                        proximosPasos: neuro.seguimiento || ''
                    };
                    break;
            }

            setInformeGeneral(prev => ({
                ...prev,
                ...generado,
                // Preservar observaciones adicionales del usuario
                observacionesAdicionales: prev.observacionesAdicionales
            }));

            setAutoGenerating(false);
            setActiveTab('general');
        }, 800);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const informeCompleto = {
            pacienteId,
            especialidadProfesional: especialidad,
            tipo: tipoInforme,
            fecha: new Date().toISOString(),
            informeTecnico,
            informeGeneral,
            visibleParaFamilia,
            requiereInterconsulta,
            especialidadesInterconsulta: requiereInterconsulta ? especialidadesInterconsulta : undefined,
            estadoInterconsulta: requiereInterconsulta ? 'PENDIENTE' : undefined
        };

        onSave(informeCompleto);
    };

    // Renderizar campos específicos según especialidad
    const renderCamposTecnicos = () => {
        switch (especialidad) {
            case 'Psicología':
                return <FormPsicologia data={informeTecnico} onChange={setInformeTecnico} />;
            case 'Psicopedagogía':
                return <FormPsicopedagogia data={informeTecnico} onChange={setInformeTecnico} />;
            case 'Fonoaudiología':
                return <FormFonoaudiologia data={informeTecnico} onChange={setInformeTecnico} />;
            case 'Kinesiología':
                return <FormKinesiologia data={informeTecnico} onChange={setInformeTecnico} />;
            case 'Neurología Infantil':
                return <FormNeurologia data={informeTecnico} onChange={setInformeTecnico} />;
            default:
                return <p className="text-gray-400">Especialidad no soportada</p>;
        }
    };

    return (
        <div className="modal-overlay z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">
                            {initialData ? 'Editar Informe' : 'Nuevo Informe'} - {especialidad}
                        </h3>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
                            Informe técnico + Informe para familia
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-8 bg-gray-50 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('tecnico')}
                        className={`px-6 py-4 font-black text-xs uppercase tracking-widest transition-all relative ${activeTab === 'tecnico'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <FileText size={16} className="inline mr-2" />
                        Informe Técnico
                        {activeTab === 'tecnico' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-6 py-4 font-black text-xs uppercase tracking-widest transition-all relative ${activeTab === 'general'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <Users size={16} className="inline mr-2" />
                        Informe para Familia
                        {activeTab === 'general' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tipo de Informe */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Tipo de Informe
                            </label>
                            <select
                                value={tipoInforme}
                                onChange={(e) => setTipoInforme(e.target.value as TipoInforme)}
                                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                            >
                                <option value="EVALUACION_INICIAL">Evaluación Inicial</option>
                                <option value="SEGUIMIENTO">Seguimiento</option>
                                <option value="INFORME_INTERDISCIPLINARIO">Informe Interdisciplinario</option>
                                <option value="INTERCONSULTA">Interconsulta</option>
                                <option value="ALTA">Alta</option>
                            </select>
                        </div>

                        {/* Contenido según tab activo */}
                        {activeTab === 'tecnico' ? (
                            <>
                                {renderCamposTecnicos()}

                                {/* Botón Auto-generar */}
                                <button
                                    type="button"
                                    onClick={autoGenerarInformeGeneral}
                                    disabled={autoGenerating}
                                    className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {autoGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} />
                                            Auto-generar Informe para Familia
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <FormInformeGeneral data={informeGeneral} onChange={setInformeGeneral} />
                        )}

                        {/* Interconsulta */}
                        <div className="bg-blue-50 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center gap-4">
                                <input
                                    id="interconsulta"
                                    type="checkbox"
                                    checked={requiereInterconsulta}
                                    onChange={(e) => setRequiereInterconsulta(e.target.checked)}
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                />
                                <label htmlFor="interconsulta" className="font-bold text-gray-700 cursor-pointer select-none">
                                    Requiere interconsulta con otros profesionales
                                </label>
                            </div>

                            {requiereInterconsulta && (
                                <div className="space-y-2 ml-9">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Especialidades a consultar
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['Psicología', 'Psicopedagogía', 'Fonoaudiología', 'Kinesiología', 'Neurología Infantil'] as Especialidad[])
                                            .filter(e => e !== especialidad)
                                            .map(esp => (
                                                <button
                                                    key={esp}
                                                    type="button"
                                                    onClick={() => {
                                                        setEspecialidadesInterconsulta(prev =>
                                                            prev.includes(esp)
                                                                ? prev.filter(e => e !== esp)
                                                                : [...prev, esp]
                                                        );
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${especialidadesInterconsulta.includes(esp)
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {esp}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Visibilidad */}
                        <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                            <input
                                id="visible"
                                type="checkbox"
                                checked={visibleParaFamilia}
                                onChange={(e) => setVisibleParaFamilia(e.target.checked)}
                                className="w-5 h-5 accent-primary rounded cursor-pointer"
                            />
                            <label htmlFor="visible" className="font-bold text-gray-700 cursor-pointer select-none">
                                Compartir informe general con la familia del paciente
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 font-black text-sm uppercase tracking-widest"
                        >
                            Guardar Informe Completo
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Componentes de formulario específicos por especialidad
const FormPsicologia: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
    const update = (field: string, value: any) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-primary border-b border-primary/20 pb-2">
                Evaluación Psicológica
            </h4>

            <InputField label="Motivo de Consulta" value={data.motivoConsulta} onChange={(v) => update('motivoConsulta', v)} />
            <TextAreaField label="Antecedentes" value={data.antecedentes} onChange={(v) => update('antecedentes', v)} />
            <TextAreaField label="Observaciones Conductuales" value={data.observacionesConductuales} onChange={(v) => update('observacionesConductuales', v)} />
            <TextAreaField label="Resultados de Pruebas" value={data.resultadosPruebas} onChange={(v) => update('resultadosPruebas', v)} />
            <TextAreaField label="Diagnóstico Presuntivo" value={data.diagnosticoPresuntivo} onChange={(v) => update('diagnosticoPresuntivo', v)} />
            <TextAreaField label="Objetivos Terapéuticos" value={data.objetivosTerapeuticos} onChange={(v) => update('objetivosTerapeuticos', v)} />
            <TextAreaField label="Técnicas Utilizadas" value={data.tecnicasUtilizadas} onChange={(v) => update('tecnicasUtilizadas', v)} />
            <TextAreaField label="Evolución" value={data.evolucion} onChange={(v) => update('evolucion', v)} />
            <TextAreaField label="Pronóstico" value={data.pronostico} onChange={(v) => update('pronostico', v)} />
        </div>
    );
};

const FormPsicopedagogia: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
    const update = (field: string, value: any) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-primary border-b border-primary/20 pb-2">
                Evaluación Psicopedagógica
            </h4>

            <InputField label="Motivo de Consulta" value={data.motivoConsulta} onChange={(v) => update('motivoConsulta', v)} />
            <TextAreaField label="Antecedentes Escolares" value={data.antecedentesEscolares} onChange={(v) => update('antecedentesEscolares', v)} />
            <InputField label="Nivel Pedagógico" value={data.nivelPedagogico} onChange={(v) => update('nivelPedagogico', v)} />
            <TextAreaField label="Lectoescritura" value={data.lectoescritura} onChange={(v) => update('lectoescritura', v)} />
            <TextAreaField label="Matemática" value={data.matematica} onChange={(v) => update('matematica', v)} />
            <TextAreaField label="Atención y Concentración" value={data.atencionConcentracion} onChange={(v) => update('atencionConcentracion', v)} />
            <TextAreaField label="Memoria" value={data.memoria} onChange={(v) => update('memoria', v)} />
            <TextAreaField label="Funciones Ejecutivas" value={data.funcionesEjecutivas} onChange={(v) => update('funcionesEjecutivas', v)} />
            <TextAreaField label="Estrategias de Aprendizaje" value={data.estrategiasAprendizaje} onChange={(v) => update('estrategiasAprendizaje', v)} />
            <TextAreaField label="Adaptaciones Curriculares" value={data.adaptacionesCurriculares} onChange={(v) => update('adaptacionesCurriculares', v)} />
            <TextAreaField label="Plan de Intervención" value={data.planIntervencion} onChange={(v) => update('planIntervencion', v)} />
        </div>
    );
};

const FormFonoaudiologia: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
    const update = (field: string, value: any) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-8">

            {/* Banner Institucional */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-5 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-xl flex-shrink-0">
                    <Mic size={20} />
                </div>
                <div>
                    <p className="font-black text-xs uppercase tracking-widest mb-1">Protocolo Clínico Institucional — Fonoaudiología</p>
                    <p className="text-[11px] text-white/80 leading-relaxed">
                        Utilizar: &quot;se observa&quot; · &quot;se evidencia&quot; · &quot;se infiere&quot; · &quot;presenta indicadores compatibles con&quot;.
                        No emitir diagnósticos médicos ni psicológicos.
                    </p>
                </div>
            </div>

            {/* SECCIÓN 2 — MOTIVO DE CONSULTA */}
            <FonoSectionHeader number={2} title="Motivo de Consulta" icon={<ClipboardList size={16} />} />
            <div className="bg-teal-50/50 p-6 rounded-2xl space-y-4 border border-teal-100">
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">
                    Redactar en términos clínicos, evitando lenguaje coloquial
                </p>
                <TextAreaField
                    label="Motivo de Consulta"
                    value={data.motivoConsulta}
                    onChange={(v) => update('motivoConsulta', v)}
                    placeholder="Ej: Consulta por dificultades en la adquisición del sistema fonológico con impacto en la inteligibilidad del habla en contexto conversacional..."
                />
            </div>

            {/* SECCIÓN 3 — ANTECEDENTES RELEVANTES */}
            <FonoSectionHeader number={3} title="Antecedentes Relevantes" icon={<Brain size={16} />} />
            <div className="bg-teal-50/50 p-6 rounded-2xl space-y-5 border border-teal-100">
                <TextAreaField
                    label="Antecedentes Perinatales"
                    value={data.antecedentesPerinatal}
                    onChange={(v) => update('antecedentesPerinatal', v)}
                    placeholder="Gestación, tipo de parto, período neonatal, lactancia materna/artificial..."
                />
                <TextAreaField
                    label="Desarrollo del Lenguaje"
                    value={data.antecedentesDesarrolloLenguaje}
                    onChange={(v) => update('antecedentesDesarrolloLenguaje', v)}
                    placeholder="Primeras palabras, frases, vocabulario, hitos comunicativos, balbuceo..."
                />
                <TextAreaField
                    label="Escolaridad"
                    value={data.antecedentesEscolaridad}
                    onChange={(v) => update('antecedentesEscolaridad', v)}
                    placeholder="Nivel escolar, desempeño, apoyo pedagógico, adaptaciones curriculares..."
                />
                <TextAreaField
                    label="Antecedentes Médicos Relevantes"
                    value={data.antecedentesMedicos}
                    onChange={(v) => update('antecedentesMedicos', v)}
                    placeholder="Enfermedades, intervenciones quirúrgicas, estudios complementarios, tratamientos fonoaudiológicos previos..."
                />
            </div>

            {/* SECCIÓN 4 — EVALUACIÓN FONOAUDIOLÓGICA */}
            <FonoSectionHeader number={4} title="Evaluación Fonoaudiológica" icon={<Stethoscope size={16} />} />
            <div className="bg-teal-50/50 p-6 rounded-2xl space-y-4 border border-teal-100">
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-2">
                    Describir procedimientos aplicados y hallazgos objetivos
                </p>

                <div className="space-y-4">
                    <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                        <TextAreaField
                            label="4.1 — Observación Clínica"
                            value={data.evaluacionObservacionClinica}
                            onChange={(v) => update('evaluacionObservacionClinica', v)}
                            placeholder="Conducta durante la evaluación, nivel de atención y motivación, tipo de interacción comunicativa, actitud frente a la tarea..."
                        />
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                        <TextAreaField
                            label="4.2 — Evaluación Estructural Orofacial"
                            value={data.evaluacionEstructuralOrofacial}
                            onChange={(v) => update('evaluacionEstructuralOrofacial', v)}
                            placeholder="Labios, lengua, paladar duro/blando, dentición, oclusión, frenillo lingual/labial, tonicidad muscular orofacial..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                            <TextAreaField
                                label="4.3a — Lenguaje: Comprensión"
                                value={data.evaluacionLenguajeComprension}
                                onChange={(v) => update('evaluacionLenguajeComprension', v)}
                                placeholder="Comprensión de consignas simples/complejas, vocabulario receptivo, instrucciones de 2/3 pasos..."
                            />
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                            <TextAreaField
                                label="4.3b — Lenguaje: Expresión"
                                value={data.evaluacionLenguajeExpresion}
                                onChange={(v) => update('evaluacionLenguajeExpresion', v)}
                                placeholder="Vocabulario expresivo, morfosintaxis, narrativa, longitud media de enunciado (LME)..."
                            />
                        </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                        <TextAreaField
                            label="4.4 — Evaluación Articulatoria"
                            value={data.evaluacionArticulatoria}
                            onChange={(v) => update('evaluacionArticulatoria', v)}
                            placeholder="Fonemas comprometidos, procesos de simplificación fonológica, inteligibilidad en contexto aislado y conectado..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                            <TextAreaField
                                label="4.5 — Fluidez"
                                value={data.evaluacionFluidez}
                                onChange={(v) => update('evaluacionFluidez', v)}
                                placeholder="Velocidad del habla, pausas, repeticiones, bloqueos, tensión muscular visible..."
                            />
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                            <TextAreaField
                                label="4.6 — Voz"
                                value={data.evaluacionVoz}
                                onChange={(v) => update('evaluacionVoz', v)}
                                placeholder="Calidad vocal, tono, intensidad, resonancia, tiempo máximo de fonación (TMF)..."
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                            <TextAreaField
                                label="4.7 — Deglución"
                                value={data.evaluacionDeglucion}
                                onChange={(v) => update('evaluacionDeglucion', v)}
                                placeholder="Deglución de sólidos/líquidos, patrón deglutorio, posición lingual, signos de disfagia si aplica..."
                            />
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                            <TextAreaField
                                label="4.8 — Audición"
                                value={data.evaluacionAudicion}
                                onChange={(v) => update('evaluacionAudicion', v)}
                                placeholder="Respuesta a estímulos auditivos, antecedentes otológicos, estudios audiológicos previos..."
                            />
                        </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-teal-100">
                        <TextAreaField
                            label="4.9 — Praxias Bucofonatorias"
                            value={data.evaluacionPraxias}
                            onChange={(v) => update('evaluacionPraxias', v)}
                            placeholder="Praxias labiales, linguales, mandibulares, velares. Coordinación fonoarticulatoria..."
                        />
                    </div>
                </div>
            </div>

            {/* SECCIÓN 5 — ANÁLISIS CLÍNICO */}
            <FonoSectionHeader number={5} title="Análisis Clínico" icon={<Brain size={16} />} />
            <div className="bg-indigo-50/50 p-6 rounded-2xl space-y-4 border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    Usar: &quot;se observa&quot; / &quot;se evidencia&quot; / &quot;se infiere&quot; / &quot;presenta indicadores compatibles con&quot;
                </p>
                <TextAreaField
                    label="Análisis e Interpretación Clínica"
                    value={data.analisisClinico}
                    onChange={(v) => update('analisisClinico', v)}
                    placeholder="Se observa un perfil comunicativo caracterizado por...&#10;Se evidencia compromiso en el plano...&#10;Se infiere que las dificultades articulatorias presentan indicadores compatibles con..."
                />
            </div>

            {/* SECCIÓN 6 — IMPRESIÓN FONOAUDIOLÓGICA */}
            <FonoSectionHeader number={6} title="Impresión Fonoaudiológica" icon={<FileText size={16} />} />
            <div className="bg-violet-50/50 p-6 rounded-2xl space-y-4 border border-violet-100">
                <div className="bg-white/80 rounded-xl p-4 border border-violet-100 space-y-2">
                    <p className="text-[10px] text-violet-700 font-black uppercase">Ejemplos orientativos:</p>
                    <ul className="text-[10px] text-gray-500 space-y-1 list-disc list-inside">
                        <li>Cuadro compatible con trastorno fonológico de tipo funcional.</li>
                        <li>Indicadores compatibles con retraso del lenguaje expresivo.</li>
                        <li>No se observan alteraciones estructurales significativas.</li>
                        <li>Perfil compatible con disfluencia típica del desarrollo.</li>
                    </ul>
                </div>
                <TextAreaField
                    label="Impresión Fonoaudiológica"
                    value={data.impresionFonoaudiologica}
                    onChange={(v) => update('impresionFonoaudiologica', v)}
                    placeholder="Cuadro compatible con... / No se observan alteraciones en... / Indicadores compatibles con..."
                />
            </div>

            {/* SECCIÓN 7 — OBJETIVOS TERAPÉUTICOS */}
            <FonoSectionHeader number={7} title="Objetivos Terapéuticos" icon={<Target size={16} />} />
            <div className="bg-emerald-50/50 p-6 rounded-2xl space-y-4 border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Objetivos claros, medibles y progresivos
                </p>
                <TextAreaField
                    label="Objetivos Terapéuticos"
                    value={data.objetivosTerapeuticos}
                    onChange={(v) => update('objetivosTerapeuticos', v)}
                    placeholder="Objetivo General: Mejorar la inteligibilidad del habla...&#10;&#10;Objetivos Específicos:&#10;• Adquisición del fonema /r/ simple en posición inicial&#10;• Incremento del vocabulario expresivo en contexto narrativo&#10;• Desarrollo de la conciencia fonológica a nivel silábico"
                />
            </div>

            {/* SECCIÓN 8 — PLAN DE INTERVENCIÓN */}
            <FonoSectionHeader number={8} title="Plan de Intervención" icon={<ClipboardList size={16} />} />
            <div className="bg-blue-50/50 p-6 rounded-2xl space-y-5 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Frecuencia Sugerida"
                        value={data.planFrecuencia}
                        onChange={(v) => update('planFrecuencia', v)}
                        placeholder="Ej: 2 sesiones semanales de 45 min"
                    />
                    <InputField
                        label="Modalidad"
                        value={data.planModalidad}
                        onChange={(v) => update('planModalidad', v)}
                        placeholder="Ej: Individual / Presencial / Mixta"
                    />
                </div>
                <TextAreaField
                    label="Estrategias Terapéuticas Específicas"
                    value={data.planEstrategias}
                    onChange={(v) => update('planEstrategias', v)}
                    placeholder="• Estimulación fonológica mediante contraste mínimo de pares&#10;• Técnicas de modelado y retroalimentación auditiva&#10;• Ejercicios miofuncionales de tonicidad lingual&#10;• Juego simbólico como mediador lingüístico"
                />
            </div>

            {/* SECCIÓN 9 — RECOMENDACIONES */}
            <FonoSectionHeader number={9} title="Recomendaciones" icon={<Ear size={16} />} />
            <div className="bg-amber-50/50 p-6 rounded-2xl space-y-5 border border-amber-100">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                    Redactadas de forma técnica y prudente
                </p>
                <TextAreaField
                    label="Para la Familia"
                    value={data.recomendacionesFamilia}
                    onChange={(v) => update('recomendacionesFamilia', v)}
                    placeholder="Se sugiere al grupo familiar estimular la comunicación en contextos cotidianos, evitar correcciones directas del habla y privilegiar modelos lingüísticos enriquecidos..."
                />
                <TextAreaField
                    label="Para la Institución Educativa"
                    value={data.recomendacionesEscuela}
                    onChange={(v) => update('recomendacionesEscuela', v)}
                    placeholder="Se recomienda considerar adaptaciones en la modalidad de evaluación oral, permitir tiempo adicional para respuestas verbales..."
                />
            </div>

            {/* SECCIÓN 10 — CONCLUSIÓN */}
            <FonoSectionHeader number={10} title="Conclusión" icon={<CheckCircle2 size={16} />} />
            <div className="bg-gray-50/80 p-6 rounded-2xl space-y-4 border border-gray-200">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Cierre profesional formal — listo para firmar y archivar en historia clínica
                </p>
                <TextAreaField
                    label="Conclusión"
                    value={data.conclusion}
                    onChange={(v) => update('conclusion', v)}
                    placeholder="El presente informe refleja los hallazgos obtenidos durante la evaluación fonoaudiológica realizada en el ámbito del VOCES – Centro Interdisciplinario de Atención. La información aquí consignada tiene carácter clínico-profesional, se enmarca en el alcance de la Licenciatura en Fonoaudiología y fue elaborada con fines institucionales y terapéuticos..."
                />
            </div>
        </div>
    );
};

const FormKinesiologia: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
    const update = (field: string, value: any) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-primary border-b border-primary/20 pb-2">
                Evaluación Kinesiológica
            </h4>

            <InputField label="Motivo de Consulta" value={data.motivoConsulta} onChange={(v) => update('motivoConsulta', v)} />
            <TextAreaField label="Antecedentes" value={data.antecedentes} onChange={(v) => update('antecedentes', v)} />
            <TextAreaField label="Evaluación Postural" value={data.evaluacionPostural} onChange={(v) => update('evaluacionPostural', v)} />
            <TextAreaField label="Rango de Movilidad" value={data.rangoMovilidad} onChange={(v) => update('rangoMovilidad', v)} />
            <TextAreaField label="Fuerza Muscular" value={data.fuerzaMuscular} onChange={(v) => update('fuerzaMuscular', v)} />
            <TextAreaField label="Tono" value={data.tono} onChange={(v) => update('tono', v)} />
            <TextAreaField label="Equilibrio y Coordinación" value={data.equilibrioCoordinacion} onChange={(v) => update('equilibrioCoordinacion', v)} />
            <TextAreaField label="Marcha" value={data.marcha} onChange={(v) => update('marcha', v)} />
            <TextAreaField label="Desarrollo Motor" value={data.desarrolloMotor} onChange={(v) => update('desarrolloMotor', v)} />
            <TextAreaField label="Dolor y Limitaciones" value={data.dolorLimitaciones} onChange={(v) => update('dolorLimitaciones', v)} />
            <TextAreaField label="Diagnóstico Kinésico" value={data.diagnosticoKinesico} onChange={(v) => update('diagnosticoKinesico', v)} />
            <TextAreaField label="Objetivos Terapéuticos" value={data.objetivosTerapeuticos} onChange={(v) => update('objetivosTerapeuticos', v)} />
            <TextAreaField label="Plan de Tratamiento" value={data.planTratamiento} onChange={(v) => update('planTratamiento', v)} />
        </div>
    );
};

const FormNeurologia: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
    const update = (field: string, value: any) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-primary border-b border-primary/20 pb-2">
                Evaluación Neurológica Infantil
            </h4>

            <InputField label="Motivo de Consulta" value={data.motivoConsulta} onChange={(v) => update('motivoConsulta', v)} />
            <TextAreaField label="Antecedentes Pre/Peri/Postnatales" value={data.antecedentesPrePeriPostnatales} onChange={(v) => update('antecedentesPrePeriPostnatales', v)} />
            <TextAreaField label="Desarrollo Psicomotor" value={data.desarrolloPsicomotor} onChange={(v) => update('desarrolloPsicomotor', v)} />
            <TextAreaField label="Examen Neurológico" value={data.examenNeurologico} onChange={(v) => update('examenNeurologico', v)} />
            <TextAreaField label="Pares Craneales" value={data.paresCraneales} onChange={(v) => update('paresCraneales', v)} />
            <TextAreaField label="Reflejos" value={data.reflejos} onChange={(v) => update('reflejos', v)} />
            <TextAreaField label="Tono" value={data.tono} onChange={(v) => update('tono', v)} />
            <TextAreaField label="Fuerza" value={data.fuerza} onChange={(v) => update('fuerza', v)} />
            <TextAreaField label="Sensibilidad" value={data.sensibilidad} onChange={(v) => update('sensibilidad', v)} />
            <TextAreaField label="Coordinación" value={data.coordinacion} onChange={(v) => update('coordinacion', v)} />
            <TextAreaField label="Marcha" value={data.marcha} onChange={(v) => update('marcha', v)} />
            <TextAreaField label="Lenguaje" value={data.lenguaje} onChange={(v) => update('lenguaje', v)} />
            <TextAreaField label="Conducta y Cognitivo" value={data.conductaCognitivo} onChange={(v) => update('conductaCognitivo', v)} />
            <TextAreaField label="Estudios Complementarios" value={data.estudiosComplementarios} onChange={(v) => update('estudiosComplementarios', v)} />
            <TextAreaField label="Diagnóstico Neurológico" value={data.diagnosticoNeurologico} onChange={(v) => update('diagnosticoNeurologico', v)} />
            <TextAreaField label="Tratamiento Indicado" value={data.tratamientoIndicado} onChange={(v) => update('tratamientoIndicado', v)} />
            <TextAreaField label="Seguimiento" value={data.seguimiento} onChange={(v) => update('seguimiento', v)} />
        </div>
    );
};

const FormInformeGeneral: React.FC<{ data: InformeGeneral; onChange: (data: InformeGeneral) => void }> = ({ data, onChange }) => {
    const update = (field: keyof InformeGeneral, value: string) => onChange({ ...data, [field]: value });

    return (
        <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 font-medium">
                    Este informe se auto-completa desde el informe técnico. Puedes editarlo para adaptarlo al lenguaje familiar.
                </p>
            </div>

            <TextAreaField
                label="Situación Actual"
                value={data.situacionActual}
                onChange={(v) => update('situacionActual', v)}
                placeholder="Descripción general de la situación actual del paciente en lenguaje accesible..."
            />
            <TextAreaField
                label="Progreso Observado"
                value={data.progresoObservado}
                onChange={(v) => update('progresoObservado', v)}
                placeholder="Avances y mejoras observadas..."
            />
            <TextAreaField
                label="Áreas de Fortaleza"
                value={data.areasFortaleza}
                onChange={(v) => update('areasFortaleza', v)}
                placeholder="Aspectos positivos y fortalezas del paciente..."
            />
            <TextAreaField
                label="Áreas a Trabajar"
                value={data.areasTrabajar}
                onChange={(v) => update('areasTrabajar', v)}
                placeholder="Aspectos que requieren atención y trabajo..."
            />
            <TextAreaField
                label="Recomendaciones para la Familia"
                value={data.recomendacionesFamilia}
                onChange={(v) => update('recomendacionesFamilia', v)}
                placeholder="Sugerencias y recomendaciones para el entorno familiar..."
            />
            <TextAreaField
                label="Actividades para Casa"
                value={data.actividadesCasa}
                onChange={(v) => update('actividadesCasa', v)}
                placeholder="Ejercicios y actividades que pueden realizar en casa..."
            />
            <TextAreaField
                label="Próximos Pasos"
                value={data.proximosPasos}
                onChange={(v) => update('proximosPasos', v)}
                placeholder="Plan de acción y próximos objetivos..."
            />
            <TextAreaField
                label="Observaciones Adicionales"
                value={data.observacionesAdicionales}
                onChange={(v) => update('observacionesAdicionales', v)}
                placeholder="Cualquier otra información relevante..."
            />
        </div>
    );
};

// Componente auxiliar para encabezados de sección fonoaudiológica
const FonoSectionHeader: React.FC<{ number: number; title: string; icon?: React.ReactNode }> = ({ number, title, icon }) => (
    <div className="flex items-center gap-3 pt-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white font-black text-[11px] flex-shrink-0">
            {number}
        </div>
        <div className="flex items-center gap-2 flex-1">
            {icon && <span className="text-teal-700">{icon}</span>}
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-wider">{title}</h4>
        </div>
        <div className="flex-1 h-px bg-teal-200/60" />
    </div>
);

// Componentes auxiliares
const InputField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> =
    ({ label, value, onChange, placeholder }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <input
                type="text"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

const TextAreaField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> =
    ({ label, value, onChange, placeholder }) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <textarea
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none font-medium"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

export default InformeForm;
