# VOCES – Sistema de Atención Integral

Este proyecto es el frontend del sistema web para el centro **VOCES**, ubicado en Cafayate.

## Tecnologías
- **Frontend**: React + TypeScript + Vite.
- **Estilos**: Tailwind CSS con paleta de colores personalizada.
- **Iconos**: Lucide React.
- **Animaciones**: Framer Motion.
- **Capa de Datos**: `stitch-loop` (simulada vía `src/hooks/useData.ts`).
- **Emails**: Plantillas listas para backend en `src/emails/templates.tsx`.

## Configuración de Colores (Branding)
- **Primary**: `#F97700` (Naranja principal)
- **Accent**: `#E0791A` (Naranja secundario)
- **Gray**: `#797476` (Gris texto)
- **Background**: `#FEFEFE` (Fondo casi blanco)

## Roles y Usuarios de Prueba (Mocks)
Para probar los diferentes paneles, usá las siguientes credenciales en `/login`:

- **ADMIN**: `admin@voces.com` / `123`
- **PROFESIONAL**: `laura@voces.com` / `123`
- **FAMILIA**: `maria@gmail.com` / `123`

## Estructura de la Capa de Datos (`stitch-loop`)
Toda la lógica de datos está centralizada en `src/hooks/useData.ts`. Esta capa:
1. Inicializa los datos desde `src/mockData/index.ts`.
2. Persiste los cambios en `localStorage` (simulando una DB).
3. Expone funciones CRUD (`addPaciente`, `updateTurnoEstado`, etc.) que pueden ser reemplazadas por llamadas a la API en el futuro.

## Emails Transaccionales
Las plantillas en `src/emails/templates.tsx` están diseñadas para ser reutilizadas. Actualmente, las acciones en el frontend (como crear un turno) disparan un `console.log` simulando el envío.

## Ejecución Local
```bash
npm install
npm run dev
```
