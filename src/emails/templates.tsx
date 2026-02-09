import React from 'react';

// Email template for Initial Interview
export const EntrevistaInicialEmail = ({ tutorNombre, fecha, hora, profesional }: any) => (
    <div style={{ fontFamily: 'sans-serif', color: '#797476', backgroundColor: '#FEFEFE', padding: '20px' }}>
        <h1 style={{ color: '#F97700' }}>Confirmación de Entrevista Inicial – VOCES</h1>
        <p>Hola <strong>{tutorNombre}</strong>,</p>
        <p>Te confirmamos la entrevista sin cargo solicitada:</p>
        <ul>
            <li><strong>Fecha:</strong> {fecha}</li>
            <li><strong>Hora:</strong> {hora}hs</li>
            <li><strong>Profesional:</strong> {profesional}</li>
        </ul>
        <p><strong>Dirección:</strong> Rivadavia 113 – Cafayate.</p>
        <p>Por favor, asistir con estudios previos si los hubiera.</p>
        <p>¡Te esperamos!</p>
        <hr />
        <p><small>VOCES – Atención Integral para Niños, Niñas y Adolescentes</small></p>
    </div>
);

export const RecordatorioTurnoEmail = ({ pacienteNombre, fecha, hora, profesional }: any) => (
    <div style={{ fontFamily: 'sans-serif', color: '#797476', padding: '20px' }}>
        <h1 style={{ color: '#F97700' }}>Recordatorio de Turno – VOCES</h1>
        <p>Te recordamos el turno para <strong>{pacienteNombre}</strong>:</p>
        <p><strong>Fecha y Hora:</strong> {fecha} a las {hora}hs</p>
        <p><strong>Profesional:</strong> {profesional}</p>
        <p>Sugerimos llegar 10 minutos antes. En caso de no asistir, por favor avisar con anticipación.</p>
    </div>
);

export const NuevoInformeDisponibleEmail = ({ pacienteNombre }: any) => (
    <div style={{ fontFamily: 'sans-serif', color: '#797476', padding: '20px' }}>
        <h1 style={{ color: '#F97700' }}>Nuevo Informe Disponible – VOCES</h1>
        <p>Te informamos que ya se encuentra disponible un nuevo informe para <strong>{pacienteNombre}</strong> en el portal de familias.</p>
        <p>Podés ingresar con tu usuario y contraseña para leerlo y descargarlo.</p>
        <a href="#" style={{ display: 'inline-block', backgroundColor: '#F97700', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', marginTop: '10px' }}>Ver Informe</a>
    </div>
);

export const TallerInscripcionEmail = ({ tallerNombre, fecha, hora }: any) => (
    <div style={{ fontFamily: 'sans-serif', color: '#797476', padding: '20px' }}>
        <h1 style={{ color: '#F97700' }}>Confirmación de Inscripción a Taller – VOCES</h1>
        <p>¡Hola! Confirmamos tu inscripción al taller:</p>
        <p><strong>Taller:</strong> {tallerNombre}</p>
        <p><strong>Fecha y Hora:</strong> {fecha} a las {hora}hs</p>
        <p>Te esperamos para compartir este espacio de aprendizaje y juego.</p>
    </div>
);
