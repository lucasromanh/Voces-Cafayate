import React, { useRef, useEffect } from 'react';
import { X, Download, MapPin, Phone, Mail, Globe, Shield, GraduationCap, Heart, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Paciente } from '../types';
import { mockObrasSociales } from '../mockData';

interface PatientFileViewerProps {
    paciente: Paciente;
    onClose: () => void;
}

const PatientFileViewer: React.FC<PatientFileViewerProps> = ({ paciente, onClose }) => {
    const fileRef = useRef<HTMLDivElement>(null);

    // Bloquear scroll del body
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const downloadPDF = async () => {
        if (!fileRef.current) return;

        try {
            const canvas = await html2canvas(fileRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 800,
                windowWidth: 800
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Ficha_Clinica_${paciente.nombre}_${paciente.apellido}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error al generar el PDF.");
        }
    };

    const obraSocial = mockObrasSociales.find(os => os.id === paciente.obrasSociales[0])?.nombre || 'Particular';

    return (
        <div className="fixed inset-0 z-[10000] bg-black/95 flex flex-col overflow-hidden">

            {/* Nav Principal: Pegado arriba TOTAL */}
            <header className="w-full h-[70px] bg-gray-900 border-b border-white/10 px-6 flex justify-between items-center shrink-0 shadow-2xl z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                        <img src="/logo.png" alt="" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] leading-tight">Gestor de Fichas</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{paciente.nombre} {paciente.apellido}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={downloadPDF}
                        className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <Download size={16} /> <span>Exportar</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-2xl transition-all border border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>
            </header>

            {/* Area de Previsualización: MINIATURA REAL */}
            <main className="flex-1 w-full flex items-start justify-center p-4 overflow-auto bg-gray-950/40">

                {/* 
                    ESCALA MINIATURA:
                    He reducido drásticamente los valores para asegurar que la hoja completa quepa en pantalla.
                */}
                <div className="relative transform-gpu transition-all duration-300 origin-top mt-4
                    scale-[0.2] xs:scale-[0.25] sm:scale-[0.35] md:scale-[0.45] lg:scale-[0.5]
                    mb-[-40%] /* Compensa el espacio muerto creado por el scale */
                ">
                    <div
                        ref={fileRef}
                        className="bg-white p-12 w-[800px] min-h-[1130px] text-gray-900 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm overflow-hidden flex flex-col border border-gray-100"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        {/* Header: Branding */}
                        <div className="flex justify-between items-start border-b-2 border-primary/10 pb-10 mb-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary">
                                    <img src="/logo.png" alt="Logo" className="w-16 h-auto" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 leading-none uppercase">VOCES</h1>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2 italic">Neurodesarrollo Infantil</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-bold uppercase text-gray-400">Cafayate, Salta</p>
                                <p className="text-[10px] font-black text-gray-600">3868-438285</p>
                                <p className="text-[10px] font-black text-gray-600">admin@voces.com</p>
                            </div>
                        </div>

                        {/* Title Header */}
                        <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] mb-10 flex justify-between items-center shadow-lg">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase mb-1">Ficha Clínica Integral</h2>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Documento Institucional Confidencial</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase opacity-40">Emisión</p>
                                <p className="text-lg font-black">{new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white text-2xl font-black">
                                    {paciente.nombre[0]}{paciente.apellido[0]}
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Paciente</h4>
                                    <p className="text-xl font-black text-gray-900 leading-none mb-1">{paciente.nombre} {paciente.apellido}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">DNI: {paciente.documento}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Nacimiento</h4>
                                    <p className="text-sm font-black text-gray-800">{new Date(paciente.fechaNacimiento).toLocaleDateString('es-AR')}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Cobertura</h4>
                                    <p className="text-sm font-black text-gray-800 uppercase leading-none">{obraSocial}</p>
                                </div>
                            </div>
                        </div>

                        {/* Clinical Data */}
                        <div className="space-y-10 flex-1">
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <Shield className="text-primary" size={20} />
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Antecedentes y Diagnósticos</h3>
                                    <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-10 ml-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest leading-none">Certificado de Discapacidad (CUD)</p>
                                            <div className="inline-flex px-4 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase border border-green-100">
                                                {paciente.tieneCUD ? `Vigente - NRO: ${paciente.numeroCUD}` : 'Sin reporte de CUD'}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest leading-none">Diagnóstico Principal</p>
                                            <div className="bg-gray-100/50 p-5 rounded-3xl border-l-4 border-primary">
                                                <p className="text-sm text-gray-800 font-bold leading-relaxed uppercase">
                                                    {paciente.diagnosticoPrincipal || 'No registrado en sistema.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-2 mb-1">
                                                <AlertCircle size={10} /> Física
                                            </p>
                                            <p className="text-xs font-bold">{paciente.discapacidadFisica ? paciente.discapacidadFisicaDetalle : 'Sin observaciones.'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-2 mb-1">
                                                <Heart size={10} /> Madurativo
                                            </p>
                                            <p className="text-xs font-bold">{paciente.retrasoDesarrollo ? paciente.retrasoDesarrolloDetalle : 'Desarrollo típico.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <GraduationCap className="text-primary" size={20} />
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Contexto Escolar</h3>
                                    <div className="flex-1 h-px bg-gray-100" />
                                </div>
                                <div className="ml-8 grid grid-cols-3 gap-6">
                                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Escuela</p>
                                        <p className="text-xs font-black text-gray-800 uppercase leading-snug">{paciente.escuelaNombre || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Nivel</p>
                                        <p className="text-xs font-black text-gray-800 uppercase leading-snug">{paciente.escolaridad || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Turno</p>
                                        <p className="text-xs font-black text-gray-800 uppercase leading-snug">{paciente.escuelaTurno?.replace('_', ' ') || 'N/A'}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <footer className="mt-12 pt-10 border-t border-gray-100 flex justify-between items-end grayscale opacity-70">
                            <div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">
                                    Centro VOCES · Neurodesarrollo Infantil
                                </p>
                            </div>
                            <div className="w-48 border-t-2 border-gray-900 pt-2 text-center">
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Sello Autorizado</p>
                            </div>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientFileViewer;
