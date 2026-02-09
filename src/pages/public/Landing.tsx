import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, GraduationCap, Calendar, MessageCircle, ArrowRight, Star } from 'lucide-react';

const Landing = () => {
    const services = [
        { title: 'Psicología', icon: <Heart className="text-orange-500" /> },
        { title: 'Psicopedagogía', icon: <GraduationCap className="text-orange-500" /> },
        { title: 'Fonoaudiología', icon: <Users className="text-orange-500" /> },
        { title: 'Kinesiología', icon: <Calendar className="text-orange-500" /> },
        { title: 'Neurología Infantil', icon: <Star className="text-orange-500" /> },
        { title: 'Pediatría', icon: <Heart className="text-orange-500" /> },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-10 pb-20 md:pt-20 md:pb-32 px-4 bg-gradient-to-b from-[#FFF5EC] to-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-orange-100 rounded-full">
                            Atención Integral en Cafayate
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-[#4A4447]">
                            Creciendo <span className="text-primary italic">juntos</span> con alegría.
                        </h1>
                        <p className="text-lg text-gray-400 mb-10 max-w-lg">
                            Ofrecemos un espacio especializado para el desarrollo de niños, niñas y adolescentes con un enfoque interdisciplinario y humano.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="https://wa.me/543868438285" className="btn-primary flex items-center justify-center space-x-2 py-4 px-8 text-lg">
                                <span>Solicitar Entrevista</span>
                                <ArrowRight size={20} />
                            </a>
                            <button
                                onClick={() => {
                                    document.getElementById('servicios')?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }}
                                className="px-8 py-4 rounded-full border border-gray-100 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Ver Servicios
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -10, 0] // Persistent floating
                        }}
                        transition={{
                            duration: 0.8,
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        whileHover={{ rotateY: 10, rotateX: -5, scale: 1.02 }} // 3D tilt effect on hover
                        style={{ perspective: 1000 }}
                    >
                        <div className="aspect-square bg-white rounded-[60px] overflow-hidden rotate-3 shadow-2xl relative flex items-center justify-center p-12 border border-orange-50">
                            <img src="/logo.png" alt="VOCES Logo" className="w-full h-auto object-contain" />
                        </div>

                        {/* Float Cards */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-orange-50 flex items-center space-x-4"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Equipo Profesional</p>
                                <p className="font-bold text-gray-voces">+10 Especialistas</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="py-24 px-4 bg-white scroll-mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#4A4447]">Nuestras Especialidades</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-medium">Contamos con un equipo interdisciplinario para brindar el mejor apoyo a cada familia.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {services.map((s, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8, scale: 1.05 }}
                                className="bg-white p-6 rounded-3xl shadow-soft flex flex-col items-center text-center group cursor-default border border-gray-50 hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#FFF5EC] flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                                    {React.cloneElement(s.icon as React.ReactElement, {
                                        size: 28,
                                        className: "text-primary transition-colors duration-300 group-hover:text-white"
                                    })}
                                </div>
                                <h3 className="text-sm font-bold text-gray-voces leading-tight">{s.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Info Block */}
            <section className="py-20 px-4 bg-[#FFF5EC]">
                <div className="max-w-4xl mx-auto text-center bg-white p-12 rounded-[40px] shadow-soft">
                    <h2 className="text-2xl font-bold mb-6 text-primary">Pacientes con y sin CUD</h2>
                    <p className="text-lg text-gray-voces leading-relaxed mb-8">
                        En VOCES trabajamos con pacientes particulares y a través de diversas obras sociales.
                        Brindamos acompañamiento en la gestión del <strong>Certificado Único de Discapacidad</strong> para asegurar el acceso a las prestaciones.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                        <span className="px-4 py-2 bg-orange-50 rounded-lg">OSDE</span>
                        <span className="px-4 py-2 bg-orange-50 rounded-lg">IPS</span>
                        <span className="px-4 py-2 bg-orange-50 rounded-lg">Swiss Medical</span>
                        <span className="px-4 py-2 bg-orange-50 rounded-lg">Particulares</span>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary rounded-[50px] p-8 md:p-20 relative overflow-hidden text-center text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">¿Tenes alguna consulta?</h2>
                        <p className="text-xl mb-12 opacity-90 relative z-10">Estamos para escucharte y asesorarte en Cafayate.</p>

                        <div className="flex justify-center flex-col sm:flex-row gap-6 relative z-10">
                            <a href="https://wa.me/543868438285" className="bg-white text-primary px-10 py-4 rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-gray-100 transition-all">
                                <MessageCircle />
                                <span>WhatsApp 3868-438285</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
