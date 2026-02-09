import React, { useRef } from 'react';
import { X, Download, FileText, Phone, MapPin, Mail, Globe } from 'lucide-react';
import { Informe, Paciente, Profesional } from '../types';
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
                <div className="overflow-y-auto p-4 md:p-12 flex justify-center bg-gray-100/50">
                    <div
                        ref={reportRef}
                        className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-xl mx-auto flex flex-col text-gray-800 font-sans"
                        style={{ aspectRatio: '1 / 1.414' }}
                    >
                        {/* Header with Logo and Center Info */}
                        <div className="flex justify-between items-start border-b-2 border-primary pb-8 mb-10">
                            <div>
                                <img src="/logo.png" alt="Voces Cafayate" className="h-20 mb-4" />
                                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Voces Cafayate</h1>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">Centro de Neurodesarrollo e Interdisciplina</p>
                            </div>
                            <div className="text-right space-y-1 mt-4">
                                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-gray-500">
                                    <span>Pje. San Cayetano 123, Cafayate, Salta</span>
                                    <MapPin size={12} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-gray-500">
                                    <span>+54 3868 438285</span>
                                    <Phone size={12} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-gray-500">
                                    <span>centrovoces.cafayate@gmail.com</span>
                                    <Mail size={12} className="text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-gray-500">
                                    <span>www.vocescafayate.com.ar</span>
                                    <Globe size={12} className="text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Report Title Section */}
                        <div className={`p-6 rounded-2xl mb-10 flex justify-between items-center ${mode === 'GENERAL' ? 'bg-primary text-white' : 'bg-gray-900 text-white'}`}>
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase">
                                    {mode === 'GENERAL' ? 'Informe para la Familia' : `Informe de ${informe.especialidadProfesional}`}
                                </h2>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${mode === 'GENERAL' ? 'text-white/80' : 'text-primary'}`}>
                                    {informe.tipo.replace(/_/g, ' ')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase opacity-60">Fecha de Emisión</p>
                                <p className="text-lg font-black">{new Date(informe.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Patient & Professional Grid */}
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Datos del Paciente</h4>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-gray-900 leading-tight">{paciente?.nombre} {paciente?.apellido}</p>
                                    <p className="text-sm font-bold text-gray-500 uppercase">DNI: {paciente?.documento}</p>
                                    <p className="text-sm font-bold text-gray-500 uppercase">F. Nac: {paciente?.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Profesional a Cargo</h4>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-gray-900 leading-tight">Lic. {profesional?.nombre} {profesional?.apellido}</p>
                                    <p className="text-sm font-bold text-gray-500 uppercase">{informe.especialidadProfesional}</p>
                                    <p className="text-sm font-bold text-gray-500 uppercase">M.P. {profesional?.id === 'p1' ? '1234' : '----'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Report Sections */}
                        <div className="flex-1 space-y-8">
                            {/* Situación Actual - Siempre visible pero con título adaptado */}
                            <section>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-primary pl-4 mb-4">
                                    {mode === 'GENERAL' ? 'I. ¿Cómo estamos hoy?' : 'I. Situación y Evolución Clínica'}
                                </h4>
                                <div className="space-y-4 ml-5">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase mb-1">
                                            {mode === 'GENERAL' ? 'Resumen de la situación' : 'Situación Actual'}
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-700">{informe.informeGeneral?.situacionActual || 'No se registra situación actual.'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase mb-1">
                                            {mode === 'GENERAL' ? 'Avances logrados' : 'Progreso Observado'}
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-700">{informe.informeGeneral?.progresoObservado || 'No se registran progresos.'}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-primary pl-4 mb-4">
                                    {mode === 'GENERAL' ? 'II. Consejos y Próximos Pasos' : 'II. Plan de Trabajo y Sugerencias'}
                                </h4>
                                <div className="space-y-4 ml-5">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase mb-1">
                                            {mode === 'GENERAL' ? 'Para hacer en casa' : 'Recomendaciones para el Hogar'}
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-700">{informe.informeGeneral?.recomendacionesFamilia || 'Sin recomendaciones específicas.'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase mb-1">
                                            {mode === 'GENERAL' ? '¿Cómo seguimos?' : 'Próximos Pasos en Tratamiento'}
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-700">{informe.informeGeneral?.proximosPasos || 'Continuar con el plan de trabajo actual.'}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Secciones Técnicas solo en modo COMPLETO */}
                            {mode === 'COMPLETO' && informe.requiereInterconsulta && informe.especialidadesInterconsulta && (
                                <section className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                    <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest mb-3">Sugerencia de Interconsulta</h4>
                                    <p className="text-sm text-orange-800 font-medium mb-3">Se sugiere evaluación por las siguientes especialidades:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {informe.especialidadesInterconsulta.map(esp => (
                                            <span key={esp} className="px-3 py-1 bg-white border border-orange-200 rounded-lg text-[10px] font-black text-orange-900 uppercase">{esp}</span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Footer / Signatures Area */}
                        <div className="mt-20 pt-10 grid grid-cols-2 gap-20">
                            <div className="text-center">
                                <div className="w-48 h-[1px] bg-gray-300 mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase text-gray-900">Lic. {profesional?.nombre} {profesional?.apellido}</p>
                                <p className="text-[8px] font-bold uppercase text-gray-400">Firma y Sello del Profesional</p>
                            </div>
                            <div className="text-center">
                                <div className="w-48 h-[1px] bg-gray-300 mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase text-gray-900">Dirección Médica</p>
                                <p className="text-[8px] font-bold uppercase text-gray-400">Voces Cafayate</p>
                            </div>
                        </div>

                        {/* Document Footer */}
                        <div className="mt-auto pt-10 text-center border-t border-gray-100">
                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Este documento tiene carácter de informe clínico y es confidencial. Voces Cafayate - Centro de Interdisciplina.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewer;
