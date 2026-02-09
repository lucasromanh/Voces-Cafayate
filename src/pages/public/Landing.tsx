import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Heart, Users, GraduationCap, Calendar, MessageCircle, ArrowRight, Star, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const Landing = () => {
    const services = [
        { title: 'Psicología', desc: 'Acompañamiento emocional y conductual especializado.', icon: <Heart /> },
        { title: 'Psicopedagogía', desc: 'Optimización de procesos de aprendizaje y desarrollo.', icon: <GraduationCap /> },
        { title: 'Fonoaudiología', desc: 'Desarrollo de la comunicación, lenguaje y audición.', icon: <Users /> },
        { title: 'Kinesiología', desc: 'Rehabilitación física y estimulación motriz temprana.', icon: <Calendar /> },
        { title: 'Neurología Infantil', desc: 'Diagnóstico precoz y seguimiento neurológico.', icon: <Star /> },
        { title: 'Pediatría', desc: 'Cuidado integral de la salud desde el nacimiento.', icon: <Heart /> },
    ];

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <div className="bg-background-voces font-sans selection:bg-primary/20 bg-grain">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-40 pb-32 px-4 overflow-hidden mesh-gradient">
                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-20">
                    <motion.div
                        className="lg:col-span-7"
                        style={{ y, opacity }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                        >
                            <span className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 rounded-full border border-primary/10">
                                <Sparkles size={14} />
                                Centro Interdisciplinario Cafayate
                            </span>
                            <h1 className="font-display text-6xl md:text-8xl font-extrabold leading-[1.05] mb-8 text-gray-deep tracking-tighter text-balance">
                                Creciendo <span className="text-primary italic font-medium">juntos</span> paso a paso.
                            </h1>
                            <p className="text-xl text-gray-voces mb-12 max-w-xl leading-relaxed font-medium">
                                En VOCES brindamos un espacio de excelencia para el desarrollo infantil y adolescente con un enfoque íntegramente humano.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <a href="https://wa.me/543868438285"
                                    className="group bg-primary text-white py-5 px-10 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:bg-primary-hover hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <span>Solicitar Entrevista</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <button
                                    onClick={() => document.getElementById('especialidades')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-10 py-5 rounded-[2rem] border-2 border-gray-100 font-black text-xs uppercase tracking-widest text-gray-deep hover:bg-white hover:border-primary/20 shadow-xl shadow-transparent hover:shadow-gray-100 hover:-translate-y-1 transition-all"
                                >
                                    Nuestros Servicios
                                </button>
                            </div>

                            <div className="mt-16 flex items-center gap-6 overflow-hidden">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Patient" />
                                        </div>
                                    ))}
                                </div>
                                <div className="h-10 w-[1px] bg-gray-100" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-deep uppercase">+50 Familias</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Confían en nuestro equipo</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                    >
                        <div className="relative z-10 group">
                            <div className="absolute -inset-4 bg-primary/20 rounded-[5rem] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                            <motion.div
                                className="aspect-[4/5] bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(249,119,0,0.15)] border-4 border-white relative"
                                whileHover={{ rotateY: -10, rotateX: 5, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                style={{ perspective: 1000 }}
                            >
                                <img src="/logo.png" alt="VOCES" className="w-full h-full object-contain p-16 opacity-10 group-hover:opacity-20 transition-opacity absolute inset-0 mix-blend-multiply" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                                <div className="w-full h-full flex items-center justify-center p-12">
                                    <img src="/logo.png" alt="Logo" className="w-full h-auto object-contain drop-shadow-2xl" />
                                </div>
                            </motion.div>

                            {/* Floating Badges */}
                            <motion.div
                                className="absolute -top-8 -right-8 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/50 z-20"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-green-200">
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Calidad</p>
                                <p className="text-sm font-black text-gray-deep uppercase tracking-tighter">Certificada</p>
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 z-20 max-w-[200px]"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        <Users size={20} />
                                    </div>
                                    <div className="h-[2px] w-8 bg-primary/20" />
                                </div>
                                <p className="text-xs font-black text-gray-deep leading-tight">Equipo interdisciplinario especializado</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Specialties Section */}
            <section id="especialidades" className="py-32 px-4 relative bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Especialidades</span>
                            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-gray-deep tracking-tighter text-balance">
                                Un abordaje <span className="text-primary italic font-medium">integral</span> para cada etapa.
                            </h2>
                        </div>
                        <p className="text-gray-voces font-medium max-w-sm border-l-4 border-primary/20 pl-6 leading-relaxed">
                            Contamos con especialistas coordinados para brindar el mejor plan terapéutico personalizado.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 bg-gray-50/50 rounded-[3rem] border-2 border-transparent hover:border-primary/10 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-500 text-primary">
                                    {React.cloneElement(s.icon as React.ReactElement, { size: 28 })}
                                </div>
                                <h3 className="font-display text-2xl font-black text-gray-deep mb-4 group-hover:text-primary transition-colors">{s.title}</h3>
                                <p className="text-gray-voces text-sm font-medium leading-relaxed mb-6 italic opacity-80 group-hover:opacity-100">
                                    {s.desc}
                                </p>
                                <div className="w-8 h-[2px] bg-gray-200 group-hover:w-full group-hover:bg-primary/20 transition-all duration-700" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-32 px-4 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <div className="relative inline-block mb-10">
                            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
                            <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-primary/5">
                                <ShieldCheck size={48} className="text-primary" />
                            </div>
                        </div>
                        <h2 className="font-display text-4xl md:text-6xl font-extrabold text-gray-deep mb-8 tracking-tighter">
                            Inclusión y <span className="text-primary italic font-medium">derechos</span>.
                        </h2>
                        <ul className="space-y-6">
                            {[
                                "Atención a pacientes con y sin CUD (Certificado Único de Discapacidad).",
                                "Asesoramiento integral para la gestión de coberturas.",
                                "Trabajamos con Obras Sociales (OSDE, IPS, Swiss Medical y más).",
                                "Abordaje comunitario y familiar en Cafayate y valles calchaquíes."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 size={16} className="text-primary" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-voces">{text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-12">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/5">
                                <p className="text-4xl font-black text-primary mb-2 tracking-tighter italic">2026</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Excelencia continua</p>
                            </div>
                            <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                                <p className="text-sm font-medium leading-relaxed opacity-80 italic">"Nuestra prioridad es que cada niño encuentre su voz y su potencial."</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Dirección VOCES</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl text-white">
                                <h4 className="text-lg font-black uppercase tracking-tighter mb-4">Interdisciplina</h4>
                                <p className="text-xs font-medium opacity-90 leading-relaxed">Trabajamos en equipo: médicos, terapeutas y familias unidos.</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/5 h-48 flex flex-col justify-end">
                                <Users size={32} className="text-gray-300 mb-auto" />
                                <p className="text-xs font-black text-gray-deep uppercase tracking-widest">Centro Referente en el Valle</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-10 px-4 mb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-gray-deep rounded-[4rem] p-10 md:p-24 overflow-hidden text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
                        {/* Background Decorations */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                        >
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] mb-6 block">Contacto Directo</span>
                            <h2 className="font-display text-4xl md:text-7xl font-extrabold text-white mb-10 tracking-tighter text-balance leading-tight">
                                ¿Tenés alguna consulta? <br />
                                <span className="text-primary italic">Hablemos</span> hoy.
                            </h2>
                            <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto font-medium">
                                Estamos para escucharte y asesorarte en Cafayate. Tu primera entrevista es el comienzo del cambio.
                            </p>

                            <div className="flex justify-center flex-col sm:flex-row gap-8">
                                <a href="https://wa.me/543868438285"
                                    className="group bg-white text-gray-deep px-12 py-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-4 hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl">
                                    <MessageCircle className="group-hover:scale-125 transition-transform" />
                                    <span>WhatsApp Directo</span>
                                </a>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Disponible ahora</span>
                                    <a href="tel:+543868438285" className="text-xl font-bold text-white tracking-tighter hover:text-primary relative group">
                                        3868-438285
                                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Scroll to Top Button */}
            <ScrollToTop />

            {/* Footer Attribution */}
            <footer className="py-12 px-4 border-t border-gray-100 bg-white/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="VOCES" className="h-8 w-auto grayscale opacity-50" />
                        <span className="h-4 w-[1px] bg-gray-200" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2026 Voces Cafayate – Derechos Reservados</p>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">Contacto</span>
                            <a href="tel:+543868438285" className="text-gray-deep hover:text-primary transition-all relative group py-1">
                                3868-438285
                                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </div>
                        <a href="#" className="hover:text-primary transition-colors flex items-end pb-1">Privacidad</a>
                        <a href="#" className="hover:text-primary transition-colors flex items-end pb-1">Inclusión</a>
                        <a href="#" className="hover:text-primary transition-colors flex items-end pb-1">Normativas</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 200) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            className={`fixed bottom-10 right-10 z-[100] p-4 bg-primary text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(249,119,0,0.3)] border border-primary/20 hover:bg-primary-hover transition-all hover:-translate-y-2 active:scale-95 ${!isVisible && 'pointer-events-none'}`}
            onClick={scrollToTop}
        >
            <ArrowRight className="-rotate-90" size={24} />
        </motion.button>
    );
};

export default Landing;
