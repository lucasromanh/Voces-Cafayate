import React from 'react';
import { Phone, MapPin, Instagram, Timer } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <img src="/logo.png" alt="VOCES Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <p className="text-sm text-gray-400 max-w-sm mb-6">
                            Atención Integral para Niños, Niñas y Adolescentes. Un espacio diseñado para el acompañamiento y crecimiento saludable.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com/VOCES20247" target="_blank" rel="noreferrer" className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <span className="font-bold text-xs">TT</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Contacto</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone size={16} className="text-primary" />
                                <span>3868-438285</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <MapPin size={16} className="text-primary" />
                                <span>Rivadavia 113 - Cafayate</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Timer size={16} className="text-primary" />
                                <span>Lunes a Viernes</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Servicios</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Psicología</li>
                            <li>Psicopedagogía</li>
                            <li>Fonoaudiología</li>
                            <li>Kinesiología</li>
                            <li>Neurología Infantil</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} VOCES Cafayate. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
