import {
  ApprovedAsset,
  ApprovedDestination,
  CaseStudy,
  Client,
  HomeContent,
  Product,
} from './home-content.models';

function approvedAsset(src: string, width: number, height: number, alt: string, decorative = false): ApprovedAsset {
  return { src, width, height, alt, decorative, publicationStatus: 'approved' };
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
  { id: 'nav-servicios', label: 'Servicios', fragment: 'servicios', prominent: false },
  { id: 'nav-casos', label: 'Casos de éxito', fragment: 'casos', prominent: false },
  { id: 'nav-nosotros', label: 'Nosotros', fragment: 'por-que-appland', prominent: false },
  { id: 'nav-contacto', label: 'Contacto', fragment: 'contacto', prominent: false },
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
  socialLinks: [],
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
    subtitle: 'Desarrollo de software, Inteligencia Artificial, Automatización y Staff Augmentation para empresas que buscan crecer más rápido.',
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
      media: approvedAsset('assets/images/home/challenges/manual.jpg', 560, 373, 'Persona trabajando en una laptop con un panel de automatización de tareas.'),
    },
    {
      id: 'disconnected',
      problem: 'Sistemas desconectados',
      response: 'Integramos plataformas, ERPs, CRMs y APIs.',
      visualKey: 'integration',
      media: approvedAsset('assets/images/home/challenges/disconnected.jpg', 560, 373, 'Íconos de servidores, base de datos, usuarios y configuración conectados a una nube central.'),
    },
    {
      id: 'overloaded',
      problem: 'Equipos tecnológicos saturados',
      response: 'Incorporamos talento especializado rápidamente.',
      visualKey: 'team',
      media: approvedAsset('assets/images/home/challenges/overloaded.jpg', 560, 280, 'Desarrollador trabajando frente a dos monitores con código en una oficina.'),
    },
    {
      id: 'support',
      problem: 'Atención al cliente ineficiente',
      response: 'Implementamos agentes de IA que operan 24/7.',
      visualKey: 'support',
      media: approvedAsset('assets/images/home/challenges/support.jpg', 560, 373, 'Persona sosteniendo un teléfono con una conversación de asistente de IA en pantalla.'),
    },
    {
      id: 'platform',
      problem: 'Necesidad de lanzar una plataforma',
      response: 'Diseñamos y desarrollamos soluciones escalables.',
      visualKey: 'platform',
      media: approvedAsset('assets/images/home/challenges/platform.jpg', 560, 373, 'Laptop y teléfono mostrando el panel de una plataforma con métricas de usuarios y ventas.'),
    },
  ],
  services: [
    {
      id: 'software',
      name: 'Desarrollo de Software',
      summary: 'Apps móviles, plataformas web y sistemas empresariales.',
      visualKey: 'code',
      media: approvedAsset('assets/images/home/services/software.png', 428, 380, '', true),
      highlights: [
        { id: 'software-mobile', label: 'Apps móviles', iconKey: 'mobile' },
        { id: 'software-web', label: 'Plataformas web', iconKey: 'web' },
        { id: 'software-enterprise', label: 'Sistemas empresariales', iconKey: 'stack' },
      ],
    },
    {
      id: 'artificial-intelligence',
      name: 'Inteligencia Artificial',
      summary: 'Agentes IA, automatización, asistentes de voz y chat.',
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
      summary: 'Desarrolladores, QA, UX/UI y equipos dedicados.',
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
      summary: 'Optimización operativa mediante IA e integraciones.',
      visualKey: 'flow',
      media: approvedAsset('assets/images/home/services/process-automation.png', 480, 320, '', true),
      highlights: [
        { id: 'automation-operations', label: 'Optimización operativa', iconKey: 'gear' },
        { id: 'automation-ai', label: 'IA aplicada', iconKey: 'chip' },
        { id: 'automation-integrations', label: 'Integraciones', iconKey: 'nodes' },
      ],
    },
    {
      id: 'technology-consulting',
      name: 'Consultoría Tecnológica',
      summary: 'Transformación digital y arquitectura tecnológica.',
      visualKey: 'strategy',
      media: approvedAsset('assets/images/home/services/technology-consulting.png', 317, 380, '', true),
      highlights: [
        { id: 'consulting-transformation', label: 'Transformación digital', iconKey: 'chart' },
        { id: 'consulting-architecture', label: 'Arquitectura tecnológica', iconKey: 'stack' },
      ],
    },
  ],
  cases: [
    {
      id: 'toyota',
      name: 'Toyota',
      summary: 'App móvil para clientes.',
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
      name: 'Tengo',
      publicationStatus: 'pending',
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
      name: 'TV Azteca',
      publicationStatus: 'pending',
      media: {
        src: 'assets/images/home/cases/tv-azteca.jpg',
        width: 800,
        height: 449,
        alt: 'Portal de noticias de TV Azteca Honduras.',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    { id: 'avianca', name: 'Avianca', summary: 'Plataforma de gestión.', publicationStatus: 'pending' },
    { id: 'telemedicine', name: 'Telemedicine Platform', summary: 'Unión Europea.', publicationStatus: 'pending' },
    { id: 'espresso-americano', name: 'Espresso Americano', summary: 'App de fidelización.', publicationStatus: 'pending' },
  ],
  aiApplications: [
    { id: 'conversational', label: 'Agentes conversacionales', visualKey: 'chat' },
    { id: 'reception', label: 'Recepción de clientes', visualKey: 'reception' },
    { id: 'call-center', label: 'Call Center IA', visualKey: 'phone' },
    { id: 'whatsapp-ai', label: 'WhatsApp IA', visualKey: 'message' },
    { id: 'leads', label: 'Generación de Leads', visualKey: 'leads' },
    { id: 'appointments', label: 'Agendamiento de citas', visualKey: 'calendar' },
    { id: 'support', label: 'Soporte 24/7', visualKey: 'support' },
    { id: 'documents', label: 'Automatización documental', visualKey: 'document' },
  ],
  products: productCandidates,
  benefits: [
    { id: 'experience', statement: 'Más de 13 años de experiencia', visualKey: 'calendar' },
    { id: 'bilingual', statement: 'Equipo bilingüe', visualKey: 'language' },
    { id: 'international', statement: 'Presencia internacional', visualKey: 'world' },
    { id: 'timezones', statement: 'Cobertura multizona horaria', visualKey: 'clock' },
    { id: 'industries', statement: 'Experiencia en fintech, salud, retail y consumo masivo', visualKey: 'industries' },
    { id: 'agile', statement: 'Metodologías ágiles', visualKey: 'agile' },
    { id: 'scalable', statement: 'Soluciones escalables', visualKey: 'scale' },
  ],
  countries: [
    { code: 'HN', name: 'Honduras' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PA', name: 'Panamá' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'GT', name: 'Guatemala' },
  ],
  contact,
  footer: {
    brandSummary: 'Desarrollo de software, Inteligencia Artificial, Automatización y Staff Augmentation para empresas que buscan crecer más rápido.',
    navigation,
    services: [
      { id: 'footer-software', label: 'Desarrollo de Software', fragment: 'servicios' },
      { id: 'footer-ai', label: 'Inteligencia Artificial', fragment: 'ia' },
      { id: 'footer-staff', label: 'Staff Augmentation', fragment: 'servicios' },
      { id: 'footer-automation', label: 'Automatización de Procesos', fragment: 'servicios' },
      { id: 'footer-consulting', label: 'Consultoría Tecnológica', fragment: 'servicios' },
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
      asset.height > 0
  );
}

function isApprovedDestination(destination: ApprovedDestination | undefined): destination is ApprovedDestination {
  return Boolean(destination && destination.publicationStatus === 'approved' && destination.value.trim());
}

export function selectVisibleClients(content: HomeContent = HOME_CONTENT): readonly Client[] {
  return content.clients.filter(
    (client) => client.publicationStatus === 'approved' && isApprovedAsset(client.logo)
  );
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
    .map((item) => ({ ...item, media: isApprovedAsset(item.media) ? item.media : undefined }));
}
