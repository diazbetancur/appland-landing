import {
  ApprovedAsset,
  ApprovedDestination,
  CaseStudy,
  Client,
  HomeContent,
  Product,
} from './home-content.models';

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

const pendingClients: readonly Client[] = [
  ['ficohsa', 'Ficohsa', 'banco_ficohsa.png', 480, 173],
  ['grupo-terra', 'Grupo Terra', 'GrupoTerra.png', 1600, 526],
  ['tigo', 'Tigo', 'tigo.png', 2560, 1839],
  ['toyota', 'Toyota', 'logo-Toyota.png', 4128, 2322],
  ['avianca', 'Avianca', 'Avianca-logo.png', 5000, 3000],
].map(([id, name, file, width, height]) => ({
  id: String(id),
  name: String(name),
  publicationStatus: 'pending',
  logo: {
    src: `assets/images/clients/${file}`,
    width: Number(width),
    height: Number(height),
    alt: `Logo de ${name}`,
    decorative: false,
    publicationStatus: 'pending',
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
  clients: pendingClients,
  challenges: [
    { id: 'manual', problem: 'Procesos manuales que consumen tiempo', response: 'Automatizamos tareas repetitivas para aumentar productividad.', visualKey: 'automation' },
    { id: 'disconnected', problem: 'Sistemas desconectados', response: 'Integramos plataformas, ERPs, CRMs y APIs.', visualKey: 'integration' },
    { id: 'overloaded', problem: 'Equipos tecnológicos saturados', response: 'Incorporamos talento especializado rápidamente.', visualKey: 'team' },
    { id: 'support', problem: 'Atención al cliente ineficiente', response: 'Implementamos agentes de IA que operan 24/7.', visualKey: 'support' },
    { id: 'platform', problem: 'Necesidad de lanzar una plataforma', response: 'Diseñamos y desarrollamos soluciones escalables.', visualKey: 'platform' },
  ],
  services: [
    { id: 'software', name: 'Desarrollo de Software', summary: 'Apps móviles, plataformas web y sistemas empresariales.', visualKey: 'code' },
    { id: 'artificial-intelligence', name: 'Inteligencia Artificial', summary: 'Agentes IA, automatización, asistentes de voz y chat.', visualKey: 'ai' },
    { id: 'staff-augmentation', name: 'Staff Augmentation', summary: 'Desarrolladores, QA, UX/UI y equipos dedicados.', visualKey: 'people' },
    { id: 'process-automation', name: 'Automatización de Procesos', summary: 'Optimización operativa mediante IA e integraciones.', visualKey: 'flow' },
    { id: 'technology-consulting', name: 'Consultoría Tecnológica', summary: 'Transformación digital y arquitectura tecnológica.', visualKey: 'strategy' },
  ],
  cases: [
    { id: 'toyota', name: 'Toyota', summary: 'App móvil para clientes.', publicationStatus: 'approved' },
    { id: 'avianca', name: 'Avianca', summary: 'Plataforma de gestión.', publicationStatus: 'approved' },
    { id: 'dilo', name: 'Dilo', summary: 'Aplicación financiera.', publicationStatus: 'approved' },
    { id: 'telemedicine', name: 'Telemedicine Platform', summary: 'Unión Europea.', publicationStatus: 'approved' },
    { id: 'espresso-americano', name: 'Espresso Americano', summary: 'App de fidelización.', publicationStatus: 'approved' },
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
      { id: 'footer-avianca', label: 'Avianca', fragment: 'casos' },
      { id: 'footer-dilo', label: 'Dilo', fragment: 'casos' },
      { id: 'footer-telemedicine', label: 'Telemedicine Platform', fragment: 'casos' },
      { id: 'footer-espresso', label: 'Espresso Americano', fragment: 'casos' },
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
