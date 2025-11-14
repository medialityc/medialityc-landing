export interface Proyecto {
  nombre: string;
  aportes: string;
}

export interface MiembroEquipo {
  id: number;
  nombre: string;
  cargo: string;
  proyectos: Proyecto[];
}

export interface EquipoData {
  miembros: MiembroEquipo[];
}

export const equipo: EquipoData = {
  miembros: [
    {
      id: 1,
      nombre: "Ing. Fermin Rivas Sotomayor",
      cargo: "CEO",
      proyectos: [
        {
          nombre: "Plataforma de Gestión Empresarial",
          aportes:
            "Liderazgo estratégico, definición de visión del producto, gestión de recursos y establecimiento de partnerships comerciales",
        },
        {
          nombre: "Sistema de Automatización de Procesos",
          aportes:
            "Diseño de arquitectura empresarial, planificación de roadmap tecnológico y gestión de stakeholders",
        },
        {
          nombre: "Expansión Internacional",
          aportes:
            "Dirección de estrategia de crecimiento global y establecimiento de alianzas internacionales",
        },
      ],
    },
    {
      id: 2,
      nombre: "Ing. Kristian Carreño Contino",
      cargo: "CTO",
      proyectos: [
        {
          nombre: "Arquitectura Microservicios",
          aportes:
            "Diseño e implementación de arquitectura escalable, implementación de DevOps y CI/CD pipelines",
        },
        {
          nombre: "Plataforma en la Nube",
          aportes:
            "Migración completa a infraestructura cloud, optimización de costos y rendimiento",
        },
        {
          nombre: "Sistema de Seguridad",
          aportes:
            "Implementación de protocolos de seguridad, encriptación de datos y sistemas de autenticación",
        },
      ],
    },
    {
      id: 3,
      nombre: "Ing. Fabian Alejandro Reyes Montero",
      cargo: "Encargado de Ventas",
      proyectos: [
        {
          nombre: "CRM Personalizado",
          aportes:
            "Diseño de flujos de ventas, automatización de procesos comerciales y capacitación del equipo",
        },
        {
          nombre: "Estrategia Comercial B2B",
          aportes:
            "Desarrollo de estrategias de penetración de mercado y establecimiento de canal de distribuidores",
        },
        {
          nombre: "Plataforma de Demo Interactiva",
          aportes:
            "Coordinación del desarrollo de demostraciones personalizadas para clientes potenciales",
        },
      ],
    },
    {
      id: 4,
      nombre: "Ing. Alejandro Aguirre Garcia",
      cargo: "Frontend Principal",
      proyectos: [
        {
          nombre: "Dashboard Administrativo",
          aportes:
            "Desarrollo de interfaz de usuario, implementación de componentes reutilizables y optimización de rendimiento",
        },
        {
          nombre: "Aplicación Móvil React Native",
          aportes:
            "Creación de interfaz responsive, implementación de animaciones y experiencia de usuario fluida",
        },
        {
          nombre: "Sistema de Design System",
          aportes:
            "Creación de librería de componentes unificada y documentación para desarrolladores",
        },
      ],
    },
    {
      id: 5,
      nombre: "Manuel Montero Crespo",
      cargo: "Backend Principal",
      proyectos: [
        {
          nombre: "API REST Scalable",
          aportes:
            "Desarrollo de endpoints, optimización de consultas a base de datos y implementación de caching",
        },
        {
          nombre: "Sistema de Notificaciones en Tiempo Real",
          aportes:
            "Implementación de WebSockets, servicios de mensajería y colas de procesamiento",
        },
        {
          nombre: "Motor de Búsqueda",
          aportes:
            "Desarrollo de algoritmos de búsqueda, indexación de datos y APIs de consulta avanzada",
        },
      ],
    },
    {
      id: 6,
      nombre: "Lic. Carlos Arturo Perez Cabrera",
      cargo: "Backend Principal",
      proyectos: [
        {
          nombre: "Sistema de Autenticación y Autorización",
          aportes:
            "Implementación de OAuth2, JWT tokens y gestión de permisos a nivel granular",
        },
        {
          nombre: "Plataforma de Análisis de Datos",
          aportes:
            "Desarrollo de ETL processes, APIs de analytics y generación de reportes automatizados",
        },
        {
          nombre: "Integración con Terceros",
          aportes:
            "Desarrollo de conectores API, webhooks y sistemas de sincronización de datos",
        },
      ],
    },
  ],
};

export function obtenerIniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
