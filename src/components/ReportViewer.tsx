import React, { useRef } from 'react';
import { X, Download, FileText, Phone, MapPin, Mail, Globe } from 'lucide-react';
import { Informe, Paciente, InformeTecnicoFonoaudiologia } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportViewerProps {
    informe: Informe;
    paciente: Paciente | undefined;
    profesional: any;
    onClose: () => void;
    mode?: 'COMPLETO' | 'GENERAL';
}

const ReportViewer: React.FC<ReportViewerProps> = ({ informe, paciente, profesional, onClose, mode = 'COMPLETO' }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Informe_${paciente?.apellido}_${new Date(informe.fecha).toLocaleDateString()}.pdf`);
    };

    return (
        <div className="modal-overlay z-[100] fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-[#f8f9fa] w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Actions Toolbar */}
                <div className="px-8 py-4 bg-white border-b border-gray-100 flex justify-between items-center z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <FileText size={20} />
                        </div>
                        <h3 className="font-black text-gray-900 tracking-tighter">Vista Previa de Informe</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={downloadPDF}
                            className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <Download size={16} />
                            Descargar PDF
                        </button>
                        <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="overflow-y-auto p-4 md:p-8 flex justify-center bg-gray-100/50">
                    <div
                        ref={reportRef}
                        className="bg-white w-full max-w-[210mm] p-[12mm] shadow-xl mx-auto flex flex-col text-gray-800 font-sans"
                        style={{ minHeight: '297mm' }}
                    >
                        {/* ── ENCABEZADO INSTITUCIONAL ── */}
                        <div className="flex justify-between items-start border-b-2 border-primary pb-5 mb-6">
                            <div>
                                <img src="/logo.png" alt="Voces Cafayate" className="h-14 mb-3" />
                                <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Voces Cafayate</h1>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Centro Interdisciplinario de Atención</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Cafayate · Salta · Argentina</p>
                            </div>
                            <div className="text-right space-y-1 mt-1">
                                <div className="flex items-center justify-end gap-2 text-[8px] font-bold text-gray-500">
                                    <span>Pje. San Cayetano 123, Cafayate, Salta</span>
                                    <MapPin size={9} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[8px] font-bold text-gray-500">
                                    <span>+54 3868 438285</span>
                                    <Phone size={9} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[8px] font-bold text-gray-500">
                                    <span>centrovoces.cafayate@gmail.com</span>
                                    <Mail size={9} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[8px] font-bold text-gray-500">
                                    <span>www.vocescafayate.com.ar</span>
                                    <Globe size={9} className="text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* ── TÍTULO DEL INFORME ── */}
                        <div className={`p-4 rounded-xl mb-5 flex justify-between items-start ${mode === 'GENERAL' ? 'bg-primary text-white' : 'bg-gray-900 text-white'}`}>
                            <div>
                                <p className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 ${mode === 'GENERAL' ? 'text-white/70' : 'text-primary'}`}>
                                    VOCES — DISCIPLINA: {informe.especialidadProfesional?.toUpperCase()}
                                </p>
                                <h2 className="text-lg font-black tracking-tighter uppercase">
                                    {mode === 'GENERAL' ? 'Informe para la Familia' : `Informe de ${informe.especialidadProfesional}`}
                                </h2>
                                <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${mode === 'GENERAL' ? 'text-white/60' : 'text-gray-400'}`}>
                                    {informe.tipo.replace(/_/g, ' ')}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <p className="text-[8px] font-bold uppercase opacity-60">Fecha de Emisión</p>
                                <p className="text-sm font-black">
                                    {new Date(informe.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* ── SECCIÓN 1: IDENTIFICACIÓN ── */}
                        <SectionTitle number={1} title="Identificación" />
                        <div className="grid grid-cols-2 gap-4 mt-2 mb-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-[8px] font-black text-primary uppercase tracking-widest mb-2">Datos del Paciente</h4>
                                <p className="text-sm font-black text-gray-900 leading-tight">{paciente?.nombre} {paciente?.apellido}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase mt-0.5">DNI: {paciente?.documento}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase">
                                    F. NAC: {paciente?.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-AR') : 'N/A'}
                                </p>
                                {paciente?.tieneCUD && (
                                    <p className="text-[9px] font-bold text-green-700 uppercase mt-0.5">CUD N°: {paciente.numeroCUD}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-[8px] font-black text-primary uppercase tracking-widest mb-2">Profesional a Cargo</h4>
                                <p className="text-sm font-black text-gray-900 leading-tight">Lic. {profesional?.nombre} {profesional?.apellido}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase mt-0.5">{informe.especialidadProfesional}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase">M.P. {profesional?.id === 'p1' ? '1234' : '----'}</p>
                            </div>
                        </div>

                        {/* ── MODO COMPLETO — FONOAUDIOLOGÍA ── */}
                        {mode === 'COMPLETO' && informe.especialidadProfesional === 'Fonoaudiología' && (
                            <FonoInformeTecnico informe={informe} />
                        )}

                        {/* ── MODO COMPLETO — OTRAS ESPECIALIDADES ── */}
                        {mode === 'COMPLETO' && informe.especialidadProfesional !== 'Fonoaudiología' && (
                            <div className="space-y-4 mb-4">
                                <SectionTitle number={2} title="Situación y Evolución Clínica" />
                                <div className="ml-3 space-y-2">
                                    <ReportField label="Situación Actual" value={informe.informeGeneral?.situacionActual} />
                                    <ReportField label="Progreso Observado" value={informe.informeGeneral?.progresoObservado} />
                                </div>
                                <SectionTitle number={3} title="Plan y Recomendaciones" />
                                <div className="ml-3 space-y-2">
                                    <ReportField label="Recomendaciones" value={informe.informeGeneral?.recomendacionesFamilia} />
                                    <ReportField label="Próximos Pasos" value={informe.informeGeneral?.proximosPasos} />
                                </div>
                            </div>
                        )}

                        {/* ── MODO GENERAL — PARA FAMILIA ── */}
                        {mode === 'GENERAL' && (
                            <div className="space-y-4 mb-4">
                                <SectionTitle number={2} title="¿Cómo estamos hoy?" />
                                <div className="ml-3 space-y-2">
                                    <ReportField label="Resumen de la situación" value={informe.informeGeneral?.situacionActual} />
                                    <ReportField label="Avances logrados" value={informe.informeGeneral?.progresoObservado} />
                                </div>
                                <SectionTitle number={3} title="Fortalezas observadas" />
                                <div className="ml-3">
                                    <ReportField label="" value={informe.informeGeneral?.areasFortaleza} />
                                </div>
                                <SectionTitle number={4} title="Consejos y próximos pasos" />
                                <div className="ml-3 space-y-2">
                                    <ReportField label="Para hacer en casa" value={informe.informeGeneral?.recomendacionesFamilia} />
                                    <ReportField label="Actividades recomendadas" value={informe.informeGeneral?.actividadesCasa} />
                                    <ReportField label="¿Cómo seguimos?" value={informe.informeGeneral?.proximosPasos} />
                                </div>
                            </div>
                        )}

                        {/* ── INTERCONSULTA ── */}
                        {mode === 'COMPLETO' && informe.requiereInterconsulta && informe.especialidadesInterconsulta && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                                <h4 className="text-[9px] font-black text-orange-900 uppercase tracking-widest mb-2">Sugerencia de Interconsulta</h4>
                                <p className="text-[9px] text-orange-800 font-medium mb-2">Se sugiere evaluación por las siguientes especialidades:</p>
                                <div className="flex flex-wrap gap-2">
                                    {informe.especialidadesInterconsulta.map(esp => (
                                        <span key={esp} className="px-3 py-1 bg-white border border-orange-200 rounded-lg text-[8px] font-black text-orange-900 uppercase">{esp}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── FIRMAS ── */}
                        <div className="mt-auto pt-8 grid grid-cols-2 gap-16">
                            <div className="text-center">
                                <div className="w-40 h-[1px] bg-gray-300 mx-auto mb-2" />
                                <p className="text-[9px] font-black uppercase text-gray-900">Lic. {profesional?.nombre} {profesional?.apellido}</p>
                                <p className="text-[8px] font-bold uppercase text-gray-400">Firma y Sello del Profesional</p>
                                <p className="text-[8px] font-bold text-gray-400">{informe.especialidadProfesional}</p>
                            </div>
                            <div className="text-center">
                                <div className="w-40 h-[1px] bg-gray-300 mx-auto mb-2" />
                                <p className="text-[9px] font-black uppercase text-gray-900">Dirección Médica</p>
                                <p className="text-[8px] font-bold uppercase text-gray-400">VOCES — Centro Interdisciplinario</p>
                            </div>
                        </div>

                        {/* ── PIE DE PÁGINA ── */}
                        <div className="mt-6 pt-4 text-center border-t border-gray-100">
                            <p className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">
                                Documento clínico confidencial — VOCES Centro Interdisciplinario de Atención — Cafayate, Salta, Argentina
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════════
// Sub-componente: Secciones técnicas fonoaudiológicas completas (2–10)
// ══════════════════════════════════════════════════════════════════════
const FonoInformeTecnico: React.FC<{ informe: Informe }> = ({ informe }) => {
    const fono = informe.informeTecnico as InformeTecnicoFonoaudiologia;
    if (!fono) return null;

    return (
        <div className="space-y-3 mb-4">

            {/* 2. MOTIVO DE CONSULTA */}
            {fono.motivoConsulta && <>
                <SectionTitle number={2} title="Motivo de Consulta" />
                <div className="ml-3 mt-1 mb-1">
                    <p className="text-[9px] leading-relaxed text-gray-700">{fono.motivoConsulta}</p>
                </div>
            </>}

            {/* 3. ANTECEDENTES */}
            {(fono.antecedentesPerinatal || fono.antecedentesDesarrolloLenguaje || fono.antecedentesEscolaridad || fono.antecedentesMedicos) && <>
                <SectionTitle number={3} title="Antecedentes Relevantes" />
                <div className="ml-3 space-y-1.5">
                    <ReportField label="Perinatales" value={fono.antecedentesPerinatal} />
                    <ReportField label="Desarrollo del Lenguaje" value={fono.antecedentesDesarrolloLenguaje} />
                    <ReportField label="Escolaridad" value={fono.antecedentesEscolaridad} />
                    <ReportField label="Antecedentes Médicos" value={fono.antecedentesMedicos} />
                </div>
            </>}

            {/* 4. EVALUACIÓN */}
            {(fono.evaluacionObservacionClinica || fono.evaluacionEstructuralOrofacial ||
                fono.evaluacionLenguajeComprension || fono.evaluacionLenguajeExpresion ||
                fono.evaluacionArticulatoria || fono.evaluacionFluidez || fono.evaluacionVoz) && <>
                    <SectionTitle number={4} title="Evaluación Fonoaudiológica" />
                    <div className="ml-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                        <ReportField label="4.1 Observación Clínica" value={fono.evaluacionObservacionClinica} />
                        <ReportField label="4.2 Estructural Orofacial" value={fono.evaluacionEstructuralOrofacial} />
                        <ReportField label="4.3a Lenguaje — Comprensión" value={fono.evaluacionLenguajeComprension} />
                        <ReportField label="4.3b Lenguaje — Expresión" value={fono.evaluacionLenguajeExpresion} />
                        <div className="col-span-2">
                            <ReportField label="4.4 Articulación" value={fono.evaluacionArticulatoria} />
                        </div>
                        <ReportField label="4.5 Fluidez" value={fono.evaluacionFluidez} />
                        <ReportField label="4.6 Voz" value={fono.evaluacionVoz} />
                        <ReportField label="4.7 Deglución" value={fono.evaluacionDeglucion} />
                        <ReportField label="4.8 Audición" value={fono.evaluacionAudicion} />
                        <div className="col-span-2">
                            <ReportField label="4.9 Praxias Bucofonatorias" value={fono.evaluacionPraxias} />
                        </div>
                    </div>
                </>}

            {/* 5. ANÁLISIS CLÍNICO */}
            {fono.analisisClinico && <>
                <SectionTitle number={5} title="Análisis Clínico" />
                <div className="ml-3 mt-1 bg-indigo-50/60 p-3 rounded-lg border-l-2 border-indigo-300">
                    <p className="text-[9px] leading-relaxed text-gray-700 italic whitespace-pre-line">{fono.analisisClinico}</p>
                </div>
            </>}

            {/* 6. IMPRESIÓN FONOAUDIOLÓGICA */}
            {fono.impresionFonoaudiologica && <>
                <SectionTitle number={6} title="Impresión Fonoaudiológica" />
                <div className="ml-3 mt-1 bg-violet-50/60 p-3 rounded-lg border-l-2 border-violet-400">
                    <p className="text-[9px] font-bold leading-relaxed text-violet-900 whitespace-pre-line">{fono.impresionFonoaudiologica}</p>
                </div>
            </>}

            {/* 7. OBJETIVOS TERAPÉUTICOS */}
            {fono.objetivosTerapeuticos && <>
                <SectionTitle number={7} title="Objetivos Terapéuticos" />
                <div className="ml-3 mt-1">
                    <p className="text-[9px] leading-relaxed text-gray-700 whitespace-pre-line">{fono.objetivosTerapeuticos}</p>
                </div>
            </>}

            {/* 8. PLAN DE INTERVENCIÓN */}
            {(fono.planFrecuencia || fono.planModalidad || fono.planEstrategias) && <>
                <SectionTitle number={8} title="Plan de Intervención" />
                <div className="ml-3 mt-1 space-y-1.5">
                    {fono.planFrecuencia && (
                        <div className="flex gap-2">
                            <span className="text-[8px] font-black text-gray-400 uppercase w-20 flex-shrink-0 pt-0.5">Frecuencia:</span>
                            <span className="text-[9px] text-gray-700">{fono.planFrecuencia}</span>
                        </div>
                    )}
                    {fono.planModalidad && (
                        <div className="flex gap-2">
                            <span className="text-[8px] font-black text-gray-400 uppercase w-20 flex-shrink-0 pt-0.5">Modalidad:</span>
                            <span className="text-[9px] text-gray-700">{fono.planModalidad}</span>
                        </div>
                    )}
                    <ReportField label="Estrategias Terapéuticas" value={fono.planEstrategias} />
                </div>
            </>}

            {/* 9. RECOMENDACIONES */}
            {(fono.recomendacionesFamilia || fono.recomendacionesEscuela) && <>
                <SectionTitle number={9} title="Recomendaciones" />
                <div className="ml-3 mt-1 space-y-1.5">
                    <ReportField label="Para la Familia" value={fono.recomendacionesFamilia} />
                    <ReportField label="Para la Institución Educativa" value={fono.recomendacionesEscuela} />
                </div>
            </>}

            {/* 10. CONCLUSIÓN */}
            {fono.conclusion && <>
                <SectionTitle number={10} title="Conclusión" />
                <div className="ml-3 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-[9px] leading-relaxed text-gray-600 whitespace-pre-line">{fono.conclusion}</p>
                </div>
            </>}

        </div>
    );
};

// ══════════════════════════════════════
// Helpers de presentación del informe
// ══════════════════════════════════════
const SectionTitle: React.FC<{ number: number; title: string }> = ({ number, title }) => (
    <div className="flex items-center gap-2 mt-2">
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">
            {number}
        </div>
        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 flex-1 pb-0.5">
            {title}
        </h4>
    </div>
);

const ReportField: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="mb-0.5">
            {label && <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5">{label}</p>}
            <p className="text-[9px] leading-relaxed text-gray-700 whitespace-pre-line">{value}</p>
        </div>
    );
};

export default ReportViewer;
