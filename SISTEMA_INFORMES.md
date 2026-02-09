# Sistema de Informes Clínicos - Voces Cafayate

## Descripción General

El sistema de informes está diseñado para profesionales de la salud que trabajan con niños, niñas y adolescentes. Permite crear informes técnicos específicos por especialidad e informes generales para familias, con soporte para interconsultas entre profesionales.

## Especialidades Soportadas

1. **Psicología**
2. **Psicopedagogía**
3. **Fonoaudiología**
4. **Kinesiología**
5. **Neurología Infantil**

## Estructura de Informes

### 1. Informe Técnico (Específico por Especialidad)

Cada especialidad tiene campos específicos adaptados a su práctica profesional:

#### Psicología
- Motivo de consulta
- Antecedentes
- Observaciones conductuales
- Pruebas aplicadas y resultados
- Diagnóstico presuntivo
- Plan terapéutico
- Objetivos terapéuticos
- Técnicas utilizadas
- Evolución
- Pronóstico

#### Psicopedagogía
- Motivo de consulta
- Antecedentes escolares
- Nivel pedagógico
- Áreas evaluadas
- Lectoescritura
- Matemática
- Atención y concentración
- Memoria
- Funciones ejecutivas
- Estrategias de aprendizaje
- Adaptaciones curriculares
- Plan de intervención

#### Fonoaudiología
- Motivo de consulta
- Antecedentes
- Desarrollo del lenguaje
- Lenguaje comprensivo y expresivo
- Articulación
- Fluidez verbal
- Voz y resonancia
- Deglución
- Audición
- Praxias bucofonatorias
- Diagnóstico fonoaudiológico
- Plan terapéutico

#### Kinesiología
- Motivo de consulta
- Antecedentes
- Evaluación postural
- Rango de movilidad
- Fuerza muscular
- Tono
- Equilibrio y coordinación
- Marcha
- Desarrollo motor
- Dolor y limitaciones
- Diagnóstico kinésico
- Objetivos terapéuticos
- Plan de tratamiento

#### Neurología Infantil
- Motivo de consulta
- Antecedentes pre/peri/postnatales
- Desarrollo psicomotor
- Examen neurológico completo
- Pares craneales
- Reflejos
- Tono, fuerza, sensibilidad
- Coordinación y marcha
- Lenguaje
- Conducta y cognitivo
- Estudios complementarios
- Diagnóstico neurológico
- Tratamiento indicado
- Seguimiento

### 2. Informe General (Para Familias)

Lenguaje accesible y comprensible para las familias:

- **Situación Actual**: Descripción general del estado del paciente
- **Progreso Observado**: Avances y mejoras
- **Áreas de Fortaleza**: Aspectos positivos
- **Áreas a Trabajar**: Aspectos que requieren atención
- **Recomendaciones para la Familia**: Sugerencias prácticas
- **Actividades para Casa**: Ejercicios y actividades
- **Próximos Pasos**: Plan de acción
- **Observaciones Adicionales**: Información relevante adicional

## Funcionalidades Principales

### Auto-generación de Informe General

El sistema puede auto-generar el informe general a partir del informe técnico:

1. El profesional completa el informe técnico con terminología especializada
2. Presiona el botón "Auto-generar Informe para Familia"
3. El sistema traduce automáticamente la información técnica a lenguaje accesible
4. El profesional puede editar y personalizar el informe general según necesite

**Ventajas:**
- Ahorra tiempo al profesional
- Garantiza coherencia entre ambos informes
- Permite personalización adicional
- Facilita la comunicación con las familias

### Sistema de Interconsultas

Los profesionales pueden solicitar interconsultas con otros especialistas:

1. Al crear un informe, marcar "Requiere interconsulta"
2. Seleccionar las especialidades a consultar
3. El sistema notifica a los profesionales correspondientes
4. Los profesionales consultados pueden responder con sus observaciones
5. Se mantiene un registro completo de la interconsulta

**Estados de Interconsulta:**
- **PENDIENTE**: Solicitud enviada, esperando respuesta
- **EN_REVISION**: El profesional consultado está revisando
- **COMPLETADA**: Interconsulta respondida

## Tipos de Informes

- **EVALUACION_INICIAL**: Primera evaluación del paciente
- **SEGUIMIENTO**: Informes periódicos de evolución
- **INFORME_INTERDISCIPLINARIO**: Informe conjunto entre varios profesionales
- **INTERCONSULTA**: Consulta específica a otro profesional
- **ALTA**: Informe de finalización del tratamiento

## Flujo de Trabajo

### Crear un Nuevo Informe

1. Click en "Nuevo Informe Clínico"
2. Seleccionar el paciente
3. Elegir el tipo de informe
4. Completar el informe técnico (campos específicos de la especialidad)
5. Auto-generar el informe general (opcional)
6. Editar y personalizar el informe general
7. Marcar si requiere interconsulta
8. Decidir si será visible para la familia
9. Guardar

### Visualizar Informes

- Los informes se muestran en la pestaña "Informes"
- Se puede ver un resumen de cada informe
- Botones para ver detalles completos o editar

## Privacidad y Seguridad

- **Informe Técnico**: Solo visible para profesionales
- **Informe General**: Puede compartirse con familias (configurable)
- **Interconsultas**: Solo visibles para profesionales involucrados
- **Control de acceso**: Cada profesional solo ve sus propios informes y los compartidos con él

## Beneficios del Sistema

### Para Profesionales
- Formularios adaptados a cada especialidad
- Auto-completado inteligente
- Facilita la comunicación interdisciplinaria
- Reduce tiempo de documentación
- Mantiene registro completo y organizado

### Para Familias
- Informes en lenguaje comprensible
- Recomendaciones claras y accionables
- Transparencia en el proceso terapéutico
- Actividades concretas para realizar en casa

### Para la Institución
- Estandarización de documentación
- Facilita trabajo interdisciplinario
- Mejora la calidad de atención
- Registro completo para auditorías
- Trazabilidad de interconsultas

## Próximas Mejoras

- [ ] Plantillas personalizables por profesional
- [ ] Exportación a PDF
- [ ] Firma digital de informes
- [ ] Notificaciones automáticas de interconsultas
- [ ] Historial de versiones de informes
- [ ] Gráficos de evolución del paciente
- [ ] Integración con calendario para seguimientos
