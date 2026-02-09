import React, { useState, useEffect } from 'react';
import { X, FileText, Users, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
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
}

const InformeForm: React.FC<InformeFormProps> = ({ especialidad, pacienteId, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState<'tecnico' | 'general'>('tecnico');
    const [autoGenerating, setAutoGenerating] = useState(false);

    // Informe Técnico (varía según especialidad)
    const [informeTecnico, setInformeTecnico] = useState<any>({});

    // Informe General (común para todas las especialidades)
    const [informeGeneral, setInformeGeneral] = useState<InformeGeneral>({
        situacionActual: '',
        progresoObservado: '',
        areasFortaleza: '',
        areasTrabajar: '',
        recomendacionesFamilia: '',
        actividadesCasa: '',
        proximosPasos: '',
        observacionesAdicionales: ''
    });

    const [tipoInforme, setTipoInforme] = useState<TipoInforme>('SEGUIMIENTO');
    const [requiereInterconsulta, setRequiereInterconsulta] = useState(false);
    const [especialidadesInterconsulta, setEspecialidadesInterconsulta] = useState<Especialidad[]>([]);
    const [visibleParaFamilia, setVisibleParaFamilia] = useState(true);

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
                        situacionActual: fono.motivoConsulta ? `Consulta por ${fono.motivoConsulta.toLowerCase()}.` : '',
                        progresoObservado: fono.desarrolloLenguaje ? `Se observa desarrollo en el lenguaje.` : '',
                        areasFortaleza: fono.lenguajeComprensivo ? `Buena comprensión del lenguaje.` : '',
                        areasTrabajar: fono.planTerapeutico || '',
                        recomendacionesFamilia: 'Estimular la comunicación en el hogar mediante juegos y lectura compartida.',
                        actividadesCasa: 'Ejercicios de articulación y lectura diaria.',
                        proximosPasos: fono.planTerapeutico || ''
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
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Nuevo Informe - {especialidad}</h3>
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
        <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-primary border-b border-primary/20 pb-2">
                Evaluación Fonoaudiológica
            </h4>

            <InputField label="Motivo de Consulta" value={data.motivoConsulta} onChange={(v) => update('motivoConsulta', v)} />
            <TextAreaField label="Antecedentes" value={data.antecedentes} onChange={(v) => update('antecedentes', v)} />
            <TextAreaField label="Desarrollo del Lenguaje" value={data.desarrolloLenguaje} onChange={(v) => update('desarrolloLenguaje', v)} />
            <TextAreaField label="Lenguaje Comprensivo" value={data.lenguajeComprensivo} onChange={(v) => update('lenguajeComprensivo', v)} />
            <TextAreaField label="Lenguaje Expresivo" value={data.lenguajeExpresivo} onChange={(v) => update('lenguajeExpresivo', v)} />
            <TextAreaField label="Articulación" value={data.articulacion} onChange={(v) => update('articulacion', v)} />
            <TextAreaField label="Fluidez Verbal" value={data.fluidezVerbal} onChange={(v) => update('fluidezVerbal', v)} />
            <TextAreaField label="Voz y Resonancia" value={data.vozResonancia} onChange={(v) => update('vozResonancia', v)} />
            <TextAreaField label="Deglución" value={data.deglucion} onChange={(v) => update('deglucion', v)} />
            <TextAreaField label="Audición" value={data.audicion} onChange={(v) => update('audicion', v)} />
            <TextAreaField label="Praxias Bucofonatorias" value={data.praxiasBucofonatorias} onChange={(v) => update('praxiasBucofonatorias', v)} />
            <TextAreaField label="Diagnóstico Fonoaudiológico" value={data.diagnosticoFonoaudiologico} onChange={(v) => update('diagnosticoFonoaudiologico', v)} />
            <TextAreaField label="Plan Terapéutico" value={data.planTerapeutico} onChange={(v) => update('planTerapeutico', v)} />
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
