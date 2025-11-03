
import { User, POE, AuditLog } from '../types';

export const initialUsers: User[] = [
    { id: 1, username: 'admin', email: 'admin@empresa.com', password: 'admin123', role: 'admin', registered: '2023-01-01', active: true },
    { id: 2, username: 'operador1', email: 'operador1@empresa.com', password: 'operador123', role: 'operator', registered: '2023-01-02', active: true },
    { id: 3, username: 'verificador1', email: 'verificador1@empresa.com', password: 'verificador123', role: 'verifier', registered: '2023-01-03', active: true },
    { id: 4, username: 'auditor1', email: 'auditor1@empresa.com', password: 'auditor123', role: 'auditor', registered: '2023-01-04', active: true }
];

export const initialPoes: POE[] = [
    {
        id: 1,
        establishment: 'Planta Principal',
        code: 'POE-LMP-001',
        title: 'POE de Limpieza de Superficies',
        applicationArea: 'Áreas de producción',
        responsible: 'Juan Pérez',
        frequency: 'Diaria',
        objective: 'Establecer el procedimiento para la limpieza y desinfección de superficies en áreas de producción',
        scope: 'Aplica a todo el personal de limpieza y operarios de las áreas de producción.',
        productsAndMaterials: 'Desinfectante clorado, Agua, Recipientes medidores, Paños de microfibra limpios, Guantes de nitrilo, Gafas de seguridad',
        description: 'Procedimiento detallado para la limpieza y desinfección de todas las superficies en contacto con alimentos y no contacto en las áreas de producción.',
        safetyInstructions: 'Uso obligatorio de guantes y gafas de seguridad. Ventilar el área durante la aplicación de productos químicos.',
        verification: 'El supervisor de turno verificará visualmente la limpieza y realizará pruebas de ATP semanalmente.',
        correctiveActions: 'En caso de no conformidad, repetir el procedimiento de limpieza y notificar al supervisor. Si persisten los problemas, re-capacitar al personal.',
        steps: [
            { id: 1, name: 'Preparación', text: 'Preparar la solución desinfectante según las indicaciones del fabricante.', image: null },
            { id: 2, name: 'Aplicación', text: 'Aplicar la solución en todas las superficies designadas utilizando un paño limpio.', image: null },
            { id: 3, name: 'Tiempo de Contacto', text: 'Dejar que la solución actúe sobre las superficies durante el tiempo de contacto requerido (10 minutos).', image: null },
            { id: 4, name: 'Enjuague', text: 'Enjuagar las superficies con agua potable si es requerido por el tipo de desinfectante.', image: null }
        ],
        attachments: [],
        status: 'approved',
        version: 1,
        createdBy: 'operador1',
        createdAt: '2023-06-01T10:30:00',
        approvedBy: 'verificador1',
        approvedAt: '2023-06-02T14:20:00',
        history: [
            { version: 1, changedBy: 'operador1', changeDate: '2023-06-01T10:30:00', changes: 'Creación inicial' }
        ]
    },
    {
        id: 2,
        establishment: 'Área de Procesamiento',
        code: 'POE-SAN-002',
        title: 'POE de Sanitización de Equipos',
        applicationArea: 'Equipos de procesamiento de alimentos',
        responsible: 'María González',
        frequency: 'Semanal',
        objective: 'Definir el proceso de sanitización de equipos de procesamiento para garantizar la inocuidad de los productos',
        scope: 'Aplica a todos los equipos de la línea de producción 2.',
        productsAndMaterials: 'Detergente alcalino, Sanitizante a base de amonio cuaternario, Cepillos de nylon, Tiras reactivas, Agua potable, Herramientas para desmontaje, Equipo de protección personal completo (guantes, botas, delantal impermeable, gafas).',
        description: 'Procedimiento para la sanitización de equipos de procesamiento, incluyendo desmontaje, limpieza, enjuague y aplicación de sanitizante.',
        safetyInstructions: 'Desconectar equipos de la fuente de energía antes de iniciar. Utilizar equipo de protección personal completo (guantes, botas, delantal impermeable, gafas).',
        verification: 'Inspección visual post-limpieza. Verificación de concentración de sanitizante con tiras reactivas.',
        correctiveActions: 'Si la concentración de sanitizante es incorrecta, ajustar la dilución. Si se observa suciedad residual, repetir el proceso de limpieza.',
        steps: [
            { id: 1, name: 'Desmontaje', text: 'Desmontar las partes removibles de los equipos según el manual del fabricante.', image: null },
            { id: 2, name: 'Limpieza Profunda', text: 'Lavar todas las partes con solución detergente y cepillos para remover residuos orgánicos.', image: null },
            { id: 3, name: 'Enjuague Inicial', text: 'Enjuagar abundantemente con agua potable para eliminar todo el detergente.', image: null },
            { id: 4, name: 'Sanitización', text: 'Aplicar la solución sanitizante en todas las superficies y verificar su concentración.', image: null },
            { id: 5, name: 'Montaje', text: 'Dejar secar al aire y volver a montar los equipos.', image: null }
        ],
        attachments: [],
        status: 'pending',
        version: 1,
        createdBy: 'operador1',
        createdAt: '2023-06-10T09:15:00',
        approvedBy: null,
        approvedAt: null,
        history: [
            { version: 1, changedBy: 'operador1', changeDate: '2023-06-10T09:15:00', changes: 'Creación inicial' }
        ]
    }
];

export const initialAuditLog: AuditLog[] = [
    { id: 1, timestamp: '2023-06-15T08:30:00', user: 'operador1', action: 'Crear POE', details: 'POE ID: 2' },
    { id: 2, timestamp: '2023-06-14T14:20:00', user: 'verificador1', action: 'Aprobar POE', details: 'POE ID: 1' },
    { id: 3, timestamp: '2023-06-13T11:45:00', user: 'operador1', action: 'Crear POE', details: 'POE ID: 1' },
    { id: 4, timestamp: '2023-06-12T16:10:00', user: 'admin', action: 'Registrar usuario', details: 'Usuario: auditor1' }
];