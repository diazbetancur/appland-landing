import { ApprovedAsset, ApprovedDestination, CaseStudy, Client, HomeContent, Product } from './home-content.models';

/**
 * Nombre del parametro de consulta que selecciona un servicio concreto.
 *
 * La seccion de servicios es un componente de pestanas con un solo anclaje, asi que el
 * fragmento no puede identificar el servicio. Se define aqui y lo consumen tanto los enlaces
 * que lo escriben como el componente que lo lee, para que el nombre viva en un solo sitio.
 */
export const SERVICE_QUERY_PARAM = 'servicio';

function approvedAsset(src: string, width: number, height: number, alt: string, decorative = false): ApprovedAsset {
  return { src, width, height, alt, decorative, publicationStatus: 'approved' };
}

/**
 * Flags are local SVGs committed to the repository; never a remote flag service.
 *
 * They come from the MIT-licensed flag-icons square set, which is not a project dependency.
 * See `src/assets/images/home/flags/ATTRIBUTION.md`. The square source matches the circular
 * mask the cards apply, so the flag fills it without being cropped.
 */
function countryFlag(slug: string, country: string): ApprovedAsset {
  return approvedAsset(`assets/images/home/flags/${slug}.svg`, 60, 60, `Bandera de ${country}`);
}

const meetingAction = {
  id: 'meeting',
  label: 'Agendar una reunión',
  intent: 'meeting',
  fallbackFragment: 'contacto',
} as const;

const whatsappAction = {
  id: 'whatsapp',
  label: 'Escribir por WhatsApp',
  intent: 'whatsapp',
} as const;

const navigation = [
  { id: 'nav-inicio', label: 'Inicio', fragment: 'inicio', prominent: false },
  {
    id: 'nav-servicios',
    label: 'Servicios',
    fragment: 'servicios',
    prominent: false,
  },
  {
    id: 'nav-casos',
    label: 'Casos de éxito',
    fragment: 'casos',
    prominent: false,
  },
  {
    id: 'nav-nosotros',
    label: 'Nosotros',
    fragment: 'por-que-appland',
    prominent: false,
  },
  {
    id: 'nav-contacto',
    label: 'Contacto',
    fragment: 'contacto',
    prominent: false,
  },
] as const;

const contact = {
  title: '¿Listo para transformar tu negocio?',
  body: 'Conversemos sobre tu proyecto y descubre cómo la tecnología, la automatización y la inteligencia artificial pueden ayudarte a crecer.',
  meetingAction: { ...meetingAction, label: 'Agendar reunión' },
  whatsappAction,
  email: {
    kind: 'email',
    value: 'hello@applandtech.com',
    publicationStatus: 'approved',
    newContext: false,
  },
  phone: {
    kind: 'phone',
    value: '+50433949211',
    publicationStatus: 'approved',
    newContext: false,
  },
  // Recovered from the pre-redesign footer (commit 239d018^), so these are the
  // company's own live profiles rather than invented destinations.
  socialLinks: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      kind: 'external',
      value: 'https://www.linkedin.com/company/appland-inc/',
      publicationStatus: 'approved',
      newContext: true,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      kind: 'external',
      value: 'https://www.instagram.com/appland.inc/',
      publicationStatus: 'approved',
      newContext: true,
    },
  ],
} as const;

const approvedClients: readonly Client[] = [
  ['ficohsa', 'Ficohsa', 'banco_ficohsa.png', 480, 173],
  ['grupo-terra', 'Grupo Terra', 'GrupoTerra.png', 1600, 526],
  ['tigo', 'Tigo', 'tigo.png', 2560, 1839],
  ['toyota', 'Toyota', 'logo-Toyota.png', 4128, 2322],
  ['avianca', 'Avianca', 'Avianca-logo.png', 5000, 3000],
].map(([id, name, file, width, height]) => ({
  id: String(id),
  name: String(name),
  publicationStatus: 'approved',
  logo: {
    src: `assets/images/clients/${file}`,
    width: Number(width),
    height: Number(height),
    alt: `Logo de ${name}`,
    decorative: false,
    publicationStatus: 'approved',
  },
}));

const productCandidates: readonly Product[] = [
  'Restaurantes',
  'Clínicas',
  'Hoteles',
  'Gimnasios',
  'Laboratorios',
  'Programas de Lealtad',
  'E-commerce',
].map((name, index) => ({
  id: `producto-${index + 1}`,
  name,
  publicationStatus: 'pending',
  inquiryAction: {
    id: `consulta-producto-${index + 1}`,
    label: 'Solicitar información',
    intent: 'inquiry',
    fallbackFragment: 'contacto',
  },
}));

export const HOME_CONTENT: HomeContent = {
  navigation,
  hero: {
    title: 'Transformamos procesos complejos en soluciones digitales inteligentes.',
    subtitle:
      'Desarrollo de software, Inteligencia Artificial, Automatización y Staff Augmentation para empresas que buscan crecer más rápido.',
    primaryAction: meetingAction,
    servicesAction: {
      id: 'services',
      label: 'Conocer nuestros servicios',
      intent: 'services',
      fallbackFragment: 'servicios',
    },
    whatsappAction,
  },
  clients: approvedClients,
  challenges: [
    {
      id: 'manual',
      problem: 'Procesos manuales que consumen tiempo',
      response: 'Automatizamos tareas repetitivas para aumentar productividad.',
      visualKey: 'automation',
      media: approvedAsset(
        'assets/images/home/challenges/manual.jpg',
        560,
        373,
        'Persona trabajando en una laptop con un panel de automatización de tareas.',
      ),
    },
    {
      id: 'disconnected',
      problem: 'Sistemas desconectados',
      response: 'Integramos plataformas, ERPs, CRMs y APIs.',
      visualKey: 'integration',
      media: approvedAsset(
        'assets/images/home/challenges/disconnected.jpg',
        560,
        373,
        'Íconos de servidores, base de datos, usuarios y configuración conectados a una nube central.',
      ),
    },
    {
      id: 'overloaded',
      problem: 'Equipos tecnológicos saturados',
      response: 'Incorporamos talento especializado rápidamente.',
      visualKey: 'team',
      media: approvedAsset(
        'assets/images/home/challenges/overloaded.jpg',
        560,
        280,
        'Desarrollador trabajando frente a dos monitores con código en una oficina.',
      ),
    },
    {
      id: 'support',
      problem: 'Atención al cliente ineficiente',
      response: 'Implementamos agentes de IA que operan 24/7.',
      visualKey: 'support',
      media: approvedAsset(
        'assets/images/home/challenges/support.jpg',
        560,
        373,
        'Persona sosteniendo un teléfono con una conversación de asistente de IA en pantalla.',
      ),
    },
    {
      id: 'platform',
      problem: 'Necesidad de lanzar una plataforma',
      response: 'Diseñamos y desarrollamos soluciones escalables.',
      visualKey: 'platform',
      media: approvedAsset(
        'assets/images/home/challenges/platform.jpg',
        560,
        373,
        'Laptop y teléfono mostrando el panel de una plataforma con métricas de usuarios y ventas.',
      ),
    },
  ],
  services: [
    {
      id: 'software',
      name: 'Desarrollo de Software',
      summary: 'Tecnología a la medida para resolver desafíos reales de tu negocio.',
      visualKey: 'code',
      media: approvedAsset('assets/images/home/services/software.png', 428, 380, '', true),
      highlights: [
        { id: 'software-mobile', label: 'Apps móviles', iconKey: 'mobile' },
        { id: 'software-web', label: 'Plataformas web', iconKey: 'web' },
        {
          id: 'software-enterprise',
          label: 'Sistemas empresariales',
          iconKey: 'stack',
        },
      ],
    },
    {
      id: 'artificial-intelligence',
      name: 'Inteligencia Artificial',
      summary: 'Soluciones inteligentes que automatizan procesos y mejoran la experiencia de tus clientes.',
      visualKey: 'ai',
      media: approvedAsset('assets/images/home/services/artificial-intelligence.png', 480, 256, '', true),
      highlights: [
        { id: 'ai-agents', label: 'Agentes IA', iconKey: 'chip' },
        { id: 'ai-automation', label: 'Automatización', iconKey: 'gear' },
        { id: 'ai-voice', label: 'Asistentes de voz', iconKey: 'mic' },
        { id: 'ai-chat', label: 'Asistentes de chat', iconKey: 'chat' },
      ],
    },
    {
      id: 'staff-augmentation',
      name: 'Staff Augmentation',
      summary: 'Incorpora talento especializado a tu equipo, cuando lo necesitas.',
      visualKey: 'people',
      media: approvedAsset('assets/images/home/services/staff-augmentation.png', 304, 380, '', true),
      highlights: [
        { id: 'staff-devs', label: 'Desarrolladores', iconKey: 'web' },
        { id: 'staff-qa', label: 'QA', iconKey: 'check' },
        { id: 'staff-ux', label: 'UX/UI', iconKey: 'pen' },
        { id: 'staff-teams', label: 'Equipos dedicados', iconKey: 'people' },
      ],
    },
    {
      id: 'process-automation',
      name: 'Automatización de Procesos',
      summary:
        'Convertimos tareas repetitivas en procesos más ágiles mediante optimización operativa, IA e integraciones conectadas.',
      visualKey: 'flow',
      media: approvedAsset('assets/images/home/services/process-automation.png', 480, 320, '', true),
      highlights: [
        {
          id: 'automation-operations',
          label: 'Optimización operativa',
          iconKey: 'gear',
        },
        { id: 'automation-ai', label: 'IA aplicada', iconKey: 'chip' },
        {
          id: 'automation-integrations',
          label: 'Integraciones',
          iconKey: 'nodes',
        },
      ],
    },
    {
      id: 'technology-consulting',
      name: 'Consultoría Tecnológica',
      summary: 'Alineamos tecnología, estrategia y negocio para impulsar tu crecimiento.',
      visualKey: 'strategy',
      media: approvedAsset('assets/images/home/services/technology-consulting.png', 317, 380, '', true),
      highlights: [
        {
          id: 'consulting-transformation',
          label: 'Transformación digital',
          iconKey: 'chart',
        },
        {
          id: 'consulting-architecture',
          label: 'Arquitectura tecnológica',
          iconKey: 'stack',
        },
      ],
    },
  ],
  cases: [
    {
      id: 'toyota',
      name: 'Toyota',
      summary: 'App móvil para clientes.',
      description: 'Plataforma móvil que centraliza servicios, productos, promociones y atención al cliente de Toyota.',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/toyota.jpg',
        width: 640,
        height: 800,
        alt: 'Pantalla principal de la app móvil de Toyota con menú de servicios.',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'dilo',
      name: 'Dilo',
      summary: 'Aplicación financiera.',
      description:
        'Plataforma digital para gestionar dinero, pagos, recargas y servicios financieros desde un solo lugar.',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/dilo.png',
        width: 640,
        height: 800,
        alt: 'Pantalla principal de la app financiera Dilo mostrando el saldo disponible.',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'tengo',
      name: 'Go',
      summary: 'Aplicación móvil financiera.',
      description:
        'Una experiencia móvil diseñada para gestionar servicios financieros de forma rápida, sencilla y segura.',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/tengo.jpg',
        width: 640,
        height: 800,
        alt: 'Pantalla de inicio de sesión de la app Tengo con Ficohsa.',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'tv-azteca',
      name: 'TV Azteca Honduras',
      summary: 'Plataforma web de noticias.',
      description:
        'Portal digital de noticias diseñado para ofrecer contenido nacional y de actualidad de forma dinámica y accesible.',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/tv-azteca.jpg',
        width: 800,
        height: 449,
        alt: 'Portal de noticias de TV Azteca Honduras.',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'avianca',
      name: 'Avianca',
      summary: 'Plataforma de gestión.',
      publicationStatus: 'pending',
    },
    {
      id: 'telemedicine',
      name: 'Telemedicine Platform',
      summary: 'Unión Europea.',
      publicationStatus: 'pending',
    },
    {
      id: 'espresso-americano',
      name: 'Espresso Americano',
      summary: 'App de fidelización.',
      publicationStatus: 'pending',
    },
  ],
  aiApplications: [
    {
      id: 'conversational',
      label: 'Agentes conversacionales',
      description: 'Asistentes inteligentes que entienden y responden a tus clientes.',
      visualKey: 'chat',
    },
    {
      id: 'reception',
      label: 'Recepción de clientes',
      description: 'Automatizamos la atención inicial y gestión de consultas al instante.',
      visualKey: 'reception',
    },
    {
      id: 'call-center',
      label: 'Call Center IA',
      description: 'Atención automatizada de llamadas con respuestas precisas y naturales.',
      visualKey: 'phone',
    },
    {
      id: 'whatsapp-ai',
      label: 'WhatsApp IA',
      description: 'Responde, gestiona y convierte clientes directamente desde WhatsApp.',
      visualKey: 'message',
    },
    {
      id: 'leads',
      label: 'Generación de Leads',
      description: 'Captura y califica leads de forma automática y eficiente.',
      visualKey: 'leads',
    },
    {
      id: 'appointments',
      label: 'Agendamiento de citas',
      description: 'Agenda citas automáticamente y reduce ausencias con recordatorios.',
      visualKey: 'calendar',
    },
    {
      id: 'support',
      label: 'Soporte 24/7',
      description: 'Brinda soporte continuo con agentes de IA disponibles todo el tiempo.',
      visualKey: 'support',
    },
    {
      id: 'documents',
      label: 'Automatización documental',
      description: 'Extrae, procesa y organiza documentos sin intervención humana.',
      visualKey: 'document',
    },
    {
      id: 'analytics',
      label: 'Análisis inteligente',
      description: 'Convierte datos en insights accionables para tomar mejores decisiones.',
      visualKey: 'chart',
    },
  ],
  products: productCandidates,
  benefits: [
    {
      id: 'experience',
      statement: 'Más de 13 años de experiencia',
      description: 'Solidez y conocimiento que se traducen en resultados.',
      visualKey: 'calendar',
    },
    {
      id: 'bilingual',
      statement: 'Equipo bilingüe',
      description: 'Comunicación clara y efectiva en tu idioma durante todo el proyecto.',
      visualKey: 'language',
    },
    {
      id: 'international',
      statement: 'Presencia internacional',
      description: 'Trabajamos con clientes en diferentes países y entendemos sus mercados.',
      visualKey: 'world',
    },
    {
      id: 'timezones',
      statement: 'Cobertura multizona horaria',
      description: 'Disponibilidad y coordinación sin importar la ubicación.',
      visualKey: 'clock',
    },
    {
      id: 'industries',
      statement: 'Experiencia en fintech, salud, retail y consumo masivo',
      description: 'Entendemos tu industria y sus desafíos específicos.',
      visualKey: 'industries',
    },
    {
      id: 'agile',
      statement: 'Metodologías ágiles',
      description: 'Entregamos valor de forma iterativa, rápida y eficiente.',
      visualKey: 'agile',
    },
    {
      id: 'scalable',
      statement: 'Soluciones escalables',
      description: 'Desarrollamos tecnología preparada para crecer junto a tu negocio.',
      visualKey: 'scale',
    },
  ],
  countries: [
    {
      code: 'HN',
      name: 'Honduras',
      flag: countryFlag('hn', 'Honduras'),
    },
    {
      code: 'US',
      name: 'Estados Unidos',
      flag: countryFlag('us', 'Estados Unidos'),
    },
    {
      code: 'CO',
      name: 'Colombia',
      flag: countryFlag('co', 'Colombia'),
    },
    {
      code: 'PA',
      name: 'Panamá',
      flag: countryFlag('pa', 'Panamá'),
    },
    {
      code: 'GT',
      name: 'Guatemala',
      flag: countryFlag('gt', 'Guatemala'),
    },
    {
      code: 'MX',
      name: 'México',
      flag: countryFlag('mx', 'México'),
    },
    {
      code: 'SV',
      name: 'El Salvador',
      flag: countryFlag('sv', 'El Salvador'),
    },
    {
      code: 'PE',
      name: 'Perú',
      flag: countryFlag('pe', 'Perú'),
    },
    {
      code: 'EC',
      name: 'Ecuador',
      flag: countryFlag('ec', 'Ecuador'),
    },
  ],
  contact,
  footer: {
    brandSummary:
      'Desarrollo de software, Inteligencia Artificial, Automatización y Staff Augmentation para empresas que buscan crecer más rápido.',
    navigation,
    services: [
      {
        id: 'footer-software',
        queryParams: { [SERVICE_QUERY_PARAM]: 'software' },
        label: 'Desarrollo de Software',
        fragment: 'servicios',
      },
      {
        id: 'footer-ai',
        queryParams: { [SERVICE_QUERY_PARAM]: 'artificial-intelligence' },
        label: 'Inteligencia Artificial',
        fragment: 'ia',
      },
      {
        id: 'footer-staff',
        queryParams: { [SERVICE_QUERY_PARAM]: 'staff-augmentation' },
        label: 'Staff Augmentation',
        fragment: 'servicios',
      },
      {
        id: 'footer-automation',
        queryParams: { [SERVICE_QUERY_PARAM]: 'process-automation' },
        label: 'Automatización de Procesos',
        fragment: 'servicios',
      },
      {
        id: 'footer-consulting',
        queryParams: { [SERVICE_QUERY_PARAM]: 'technology-consulting' },
        label: 'Consultoría Tecnológica',
        fragment: 'servicios',
      },
    ],
    cases: [
      { id: 'footer-toyota', label: 'Toyota', fragment: 'casos' },
      { id: 'footer-dilo', label: 'Dilo', fragment: 'casos' },
    ],
    contact,
    socialLinks: [],
    legalLinks: [],
    copyrightOwner: 'APPLAND',
  },
};

function isApprovedAsset(asset: ApprovedAsset | undefined): asset is ApprovedAsset {
  return Boolean(
    asset &&
    asset.publicationStatus === 'approved' &&
    asset.src.startsWith('assets/') &&
    asset.width > 0 &&
    asset.height > 0,
  );
}

function isApprovedDestination(destination: ApprovedDestination | undefined): destination is ApprovedDestination {
  return Boolean(destination && destination.publicationStatus === 'approved' && destination.value.trim());
}

export function selectVisibleClients(content: HomeContent = HOME_CONTENT): readonly Client[] {
  return content.clients.filter((client) => client.publicationStatus === 'approved' && isApprovedAsset(client.logo));
}

export function selectVisibleCases(content: HomeContent = HOME_CONTENT): readonly CaseStudy[] {
  return content.cases
    .filter((item) => item.publicationStatus === 'approved')
    .map((item) => ({
      ...item,
      media: isApprovedAsset(item.media) ? item.media : undefined,
      destination: isApprovedDestination(item.destination) ? item.destination : undefined,
    }));
}

export function selectVisibleProducts(content: HomeContent = HOME_CONTENT): readonly Product[] {
  return content.products
    .filter((item) => item.publicationStatus === 'approved')
    .map((item) => ({
      ...item,
      media: isApprovedAsset(item.media) ? item.media : undefined,
    }));
}
