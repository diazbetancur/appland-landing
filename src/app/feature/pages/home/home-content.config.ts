import { ApprovedAsset, ApprovedDestination, CaseStudy, Client, HomeContent, Product } from './home-content.models';

/**
 * Nombre del parametro de consulta que selecciona un servicio concreto.
 *
 * La seccion de servicios es un componente de pestanas con un solo anclaje, asi que el
 * fragmento no puede identificar el servicio. Se define aqui y lo consumen tanto los enlaces
 * que lo escriben como el componente que lo lee, para que el nombre viva en un solo sitio.
 */
export const SERVICE_QUERY_PARAM = 'servicio';

function approvedAsset(src: string, width: number, height: number, altKey: string, decorative = false): ApprovedAsset {
  return { src, width, height, altKey, decorative, publicationStatus: 'approved' };
}

/**
 * Flags are local SVGs committed to the repository; never a remote flag service.
 *
 * They come from the MIT-licensed flag-icons square set, which is not a project dependency.
 * See `src/assets/images/home/flags/ATTRIBUTION.md`. The square source matches the circular
 * mask the cards apply, so the flag fills it without being cropped.
 */
function countryFlag(slug: string): ApprovedAsset {
  return approvedAsset(`assets/images/home/flags/${slug}.svg`, 60, 60, 'home.team.flagAlt');
}

const meetingAction = {
  id: 'meeting',
  labelKey: 'home.actions.meeting',
  intent: 'meeting',
  fallbackFragment: 'contacto',
} as const;

const whatsappAction = {
  id: 'whatsapp',
  labelKey: 'home.actions.whatsapp',
  intent: 'whatsapp',
} as const;

/**
 * Atajo a la seccion de contacto que usan las secciones intermedias de la Home.
 *
 * Antes estas secciones compartian objeto con el boton de la propia seccion de contacto.
 * Como ese objeto resuelve al fragmento `contacto`, el boton de la seccion de contacto
 * terminaba enlazando consigo mismo y no llevaba a ninguna parte. Son dos acciones
 * distintas y se declaran por separado.
 */
const contactAction = { ...meetingAction, labelKey: 'home.actions.meetingShort' } as const;

const navigation = [
  { id: 'nav-inicio', labelKey: 'nav.home', fragment: 'inicio', prominent: false },
  {
    id: 'nav-servicios',
    labelKey: 'nav.services',
    fragment: 'servicios',
    prominent: false,
  },
  {
    id: 'nav-casos',
    labelKey: 'nav.cases',
    fragment: 'casos',
    prominent: false,
  },
  {
    id: 'nav-nosotros',
    labelKey: 'nav.about',
    fragment: 'por-que-appland',
    prominent: false,
  },
  {
    id: 'nav-contacto',
    labelKey: 'nav.contact',
    fragment: 'contacto',
    prominent: false,
  },
] as const;

const contact = {
  titleKey: 'home.contact.title',
  bodyKey: 'home.contact.body',
  /**
   * El boton de la propia seccion de contacto abre WhatsApp, no un fragmento: un enlace al
   * fragmento `contacto` desde dentro de la seccion `contacto` no lleva a ningun sitio.
   *
   * Es el unico boton de la seccion. Hasta la ronda 4 lo acompanaba un segundo boton de
   * WhatsApp que abria el chat vacio del mismo numero, asi que ofrecia una eleccion que no lo
   * era. El mensaje precargado, aprobado por el usuario, conserva la intencion de reunion.
   */
  meetingAction: {
    id: 'contact-meeting',
    labelKey: 'home.actions.meetingShort',
    intent: 'whatsapp',
    approvedMessageKey: 'home.actions.whatsappMeetingMessage',
  },
  email: {
    kind: 'email',
    value: 'hello@applandtech.com',
    publicationStatus: 'approved',
    newContext: false,
  },
  phone: {
    kind: 'phone',
    value: '+50433349211',
    // Antes esta version legible estaba escrita a mano en las plantillas del pie y de la
    // seccion de contacto, asi que corregir el numero aqui dejaba las dos desactualizadas.
    displayValue: '+504 3334-9211',
    publicationStatus: 'approved',
    newContext: false,
  },
  // Recovered from the pre-redesign footer (commit 239d018^), so these are the
  // company's own live profiles rather than invented destinations.
  socialLinks: [
    {
      id: 'linkedin',
      labelKey: 'home.contact.social.linkedin',
      kind: 'external',
      value: 'https://www.linkedin.com/company/appland-inc/',
      publicationStatus: 'approved',
      newContext: true,
    },
    {
      id: 'instagram',
      labelKey: 'home.contact.social.instagram',
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
    altKey: 'home.clients.logoAlt',
    decorative: false,
    publicationStatus: 'approved',
  },
}));

/**
 * Los nombres son categorias de negocio, no marcas, asi que llevan clave: "Restaurantes" es
 * "Restaurants" en ingles.
 */
const productCandidates: readonly Product[] = [
  'home.products.restaurants',
  'home.products.clinics',
  'home.products.hotels',
  'home.products.gyms',
  'home.products.labs',
  'home.products.loyalty',
  'home.products.ecommerce',
].map((nameKey, index) => ({
  id: `producto-${index + 1}`,
  nameKey,
  publicationStatus: 'pending',
  inquiryAction: {
    id: `consulta-producto-${index + 1}`,
    labelKey: 'home.actions.productInquiry',
    intent: 'inquiry',
    fallbackFragment: 'contacto',
  },
}));

export const HOME_CONTENT: HomeContent = {
  navigation,
  contactAction,
  hero: {
    titleLeadKey: 'home.hero.titleLead',
    titleHighlightKey: 'home.hero.titleHighlight',
    subtitleKey: 'home.hero.subtitle',
    primaryAction: meetingAction,
    servicesAction: {
      id: 'services',
      labelKey: 'home.actions.services',
      intent: 'services',
      fallbackFragment: 'servicios',
    },
    whatsappAction,
  },
  clients: approvedClients,
  challenges: [
    {
      id: 'manual',
      problemKey: 'home.challenges.manual.problem',
      responseKey: 'home.challenges.manual.response',
      visualKey: 'automation',
      media: approvedAsset('assets/images/home/challenges/manual.jpg', 560, 373, 'home.challenges.manual.alt'),
    },
    {
      id: 'disconnected',
      problemKey: 'home.challenges.disconnected.problem',
      responseKey: 'home.challenges.disconnected.response',
      visualKey: 'integration',
      media: approvedAsset(
        'assets/images/home/challenges/disconnected.jpg',
        560,
        373,
        'home.challenges.disconnected.alt',
      ),
    },
    {
      id: 'overloaded',
      problemKey: 'home.challenges.overloaded.problem',
      responseKey: 'home.challenges.overloaded.response',
      visualKey: 'team',
      media: approvedAsset('assets/images/home/challenges/overloaded.jpg', 560, 280, 'home.challenges.overloaded.alt'),
    },
    {
      id: 'support',
      problemKey: 'home.challenges.support.problem',
      responseKey: 'home.challenges.support.response',
      visualKey: 'support',
      media: approvedAsset('assets/images/home/challenges/support.jpg', 560, 373, 'home.challenges.support.alt'),
    },
    {
      id: 'platform',
      problemKey: 'home.challenges.platform.problem',
      responseKey: 'home.challenges.platform.response',
      visualKey: 'platform',
      media: approvedAsset('assets/images/home/challenges/platform.jpg', 560, 373, 'home.challenges.platform.alt'),
    },
  ],
  services: [
    {
      id: 'software',
      nameKey: 'home.services.software.name',
      summaryKey: 'home.services.software.summary',
      visualKey: 'code',
      media: approvedAsset('assets/images/home/services/software.png', 428, 380, '', true),
      highlights: [
        { id: 'software-mobile', labelKey: 'home.services.software.mobile', iconKey: 'mobile' },
        { id: 'software-web', labelKey: 'home.services.software.web', iconKey: 'web' },
        {
          id: 'software-enterprise',
          labelKey: 'home.services.software.enterprise',
          iconKey: 'stack',
        },
      ],
    },
    {
      id: 'artificial-intelligence',
      nameKey: 'home.services.ai.name',
      summaryKey: 'home.services.ai.summary',
      visualKey: 'ai',
      media: approvedAsset('assets/images/home/services/artificial-intelligence.png', 480, 256, '', true),
      highlights: [
        { id: 'ai-agents', labelKey: 'home.services.ai.agents', iconKey: 'chip' },
        { id: 'ai-automation', labelKey: 'home.services.ai.automation', iconKey: 'gear' },
        { id: 'ai-voice', labelKey: 'home.services.ai.voice', iconKey: 'mic' },
        { id: 'ai-chat', labelKey: 'home.services.ai.chat', iconKey: 'chat' },
      ],
    },
    {
      id: 'staff-augmentation',
      nameKey: 'home.services.staff.name',
      summaryKey: 'home.services.staff.summary',
      visualKey: 'people',
      media: approvedAsset('assets/images/home/services/staff-augmentation.png', 304, 380, '', true),
      highlights: [
        { id: 'staff-devs', labelKey: 'home.services.staff.devs', iconKey: 'web' },
        { id: 'staff-qa', labelKey: 'home.services.staff.qa', iconKey: 'check' },
        { id: 'staff-ux', labelKey: 'home.services.staff.ux', iconKey: 'pen' },
        { id: 'staff-teams', labelKey: 'home.services.staff.teams', iconKey: 'people' },
      ],
    },
    {
      id: 'process-automation',
      nameKey: 'home.services.automation.name',
      summaryKey: 'home.services.automation.summary',
      visualKey: 'flow',
      media: approvedAsset('assets/images/home/services/process-automation.png', 480, 320, '', true),
      highlights: [
        {
          id: 'automation-operations',
          labelKey: 'home.services.automation.operations',
          iconKey: 'gear',
        },
        { id: 'automation-ai', labelKey: 'home.services.automation.ai', iconKey: 'chip' },
        {
          id: 'automation-integrations',
          labelKey: 'home.services.automation.integrations',
          iconKey: 'nodes',
        },
      ],
    },
    {
      id: 'technology-consulting',
      nameKey: 'home.services.consulting.name',
      summaryKey: 'home.services.consulting.summary',
      visualKey: 'strategy',
      media: approvedAsset('assets/images/home/services/technology-consulting.png', 317, 380, '', true),
      highlights: [
        {
          id: 'consulting-transformation',
          labelKey: 'home.services.consulting.transformation',
          iconKey: 'chart',
        },
        {
          id: 'consulting-architecture',
          labelKey: 'home.services.consulting.architecture',
          iconKey: 'stack',
        },
      ],
    },
  ],
  cases: [
    {
      id: 'toyota',
      name: 'Toyota',
      summaryKey: 'home.cases.toyota.summary',
      descriptionKey: 'home.cases.toyota.description',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/toyota.jpg',
        width: 640,
        height: 800,
        altKey: 'home.cases.toyota.alt',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'dilo',
      name: 'Dilo',
      summaryKey: 'home.cases.dilo.summary',
      descriptionKey: 'home.cases.dilo.description',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/dilo.png',
        width: 640,
        height: 800,
        altKey: 'home.cases.dilo.alt',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'tengo',
      name: 'Go',
      summaryKey: 'home.cases.tengo.summary',
      descriptionKey: 'home.cases.tengo.description',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/tengo.jpg',
        width: 640,
        height: 800,
        altKey: 'home.cases.tengo.alt',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'tv-azteca',
      name: 'TV Azteca Honduras',
      summaryKey: 'home.cases.tvAzteca.summary',
      descriptionKey: 'home.cases.tvAzteca.description',
      publicationStatus: 'approved',
      media: {
        src: 'assets/images/home/cases/tv-azteca.jpg',
        width: 800,
        height: 449,
        altKey: 'home.cases.tvAzteca.alt',
        decorative: false,
        publicationStatus: 'approved',
      },
    },
    {
      id: 'avianca',
      name: 'Avianca',
      summaryKey: 'home.cases.avianca.summary',
      publicationStatus: 'pending',
    },
    {
      id: 'telemedicine',
      name: 'Telemedicine Platform',
      summaryKey: 'home.cases.telemedicine.summary',
      publicationStatus: 'pending',
    },
    {
      id: 'espresso-americano',
      name: 'Espresso Americano',
      summaryKey: 'home.cases.espresso.summary',
      publicationStatus: 'pending',
    },
  ],
  aiApplications: [
    {
      id: 'conversational',
      labelKey: 'home.ai.conversational.label',
      descriptionKey: 'home.ai.conversational.description',
      visualKey: 'chat',
    },
    {
      id: 'reception',
      labelKey: 'home.ai.reception.label',
      descriptionKey: 'home.ai.reception.description',
      visualKey: 'reception',
    },
    {
      id: 'call-center',
      labelKey: 'home.ai.callCenter.label',
      descriptionKey: 'home.ai.callCenter.description',
      visualKey: 'phone',
    },
    {
      id: 'whatsapp-ai',
      labelKey: 'home.ai.whatsapp.label',
      descriptionKey: 'home.ai.whatsapp.description',
      visualKey: 'message',
    },
    {
      id: 'leads',
      labelKey: 'home.ai.leads.label',
      descriptionKey: 'home.ai.leads.description',
      visualKey: 'leads',
    },
    {
      id: 'appointments',
      labelKey: 'home.ai.appointments.label',
      descriptionKey: 'home.ai.appointments.description',
      visualKey: 'calendar',
    },
    {
      id: 'support',
      labelKey: 'home.ai.support.label',
      descriptionKey: 'home.ai.support.description',
      visualKey: 'support',
    },
    {
      id: 'documents',
      labelKey: 'home.ai.documents.label',
      descriptionKey: 'home.ai.documents.description',
      visualKey: 'document',
    },
    {
      id: 'analytics',
      labelKey: 'home.ai.analytics.label',
      descriptionKey: 'home.ai.analytics.description',
      visualKey: 'chart',
    },
  ],
  products: productCandidates,
  benefits: [
    {
      id: 'experience',
      statementKey: 'home.why.experience.statement',
      descriptionKey: 'home.why.experience.description',
      visualKey: 'calendar',
    },
    {
      id: 'bilingual',
      statementKey: 'home.why.bilingual.statement',
      descriptionKey: 'home.why.bilingual.description',
      visualKey: 'language',
    },
    {
      id: 'international',
      statementKey: 'home.why.international.statement',
      descriptionKey: 'home.why.international.description',
      visualKey: 'world',
    },
    {
      id: 'timezones',
      statementKey: 'home.why.timezones.statement',
      descriptionKey: 'home.why.timezones.description',
      visualKey: 'clock',
    },
    {
      id: 'industries',
      statementKey: 'home.why.industries.statement',
      descriptionKey: 'home.why.industries.description',
      visualKey: 'industries',
    },
    {
      id: 'agile',
      statementKey: 'home.why.agile.statement',
      descriptionKey: 'home.why.agile.description',
      visualKey: 'agile',
    },
    {
      id: 'scalable',
      statementKey: 'home.why.scalable.statement',
      descriptionKey: 'home.why.scalable.description',
      visualKey: 'scale',
    },
  ],
  countries: [
    {
      code: 'HN',
      nameKey: 'home.team.countries.HN',
      flag: countryFlag('hn'),
    },
    {
      code: 'AR',
      nameKey: 'home.team.countries.AR',
      flag: countryFlag('ar'),
    },
    {
      code: 'CO',
      nameKey: 'home.team.countries.CO',
      flag: countryFlag('co'),
    },
    {
      code: 'PA',
      nameKey: 'home.team.countries.PA',
      flag: countryFlag('pa'),
    },
    {
      code: 'GT',
      nameKey: 'home.team.countries.GT',
      flag: countryFlag('gt'),
    },
    {
      code: 'MX',
      nameKey: 'home.team.countries.MX',
      flag: countryFlag('mx'),
    },
    {
      code: 'SV',
      nameKey: 'home.team.countries.SV',
      flag: countryFlag('sv'),
    },
    {
      code: 'PE',
      nameKey: 'home.team.countries.PE',
      flag: countryFlag('pe'),
    },
    {
      code: 'EC',
      nameKey: 'home.team.countries.EC',
      flag: countryFlag('ec'),
    },
  ],
  contact,
  footer: {
    brandSummaryKey: 'footer.brandSummary',
    navigation,
    services: [
      {
        id: 'footer-software',
        queryParams: { [SERVICE_QUERY_PARAM]: 'software' },
        labelKey: 'home.services.software.name',
        fragment: 'servicios',
      },
      {
        id: 'footer-ai',
        queryParams: { [SERVICE_QUERY_PARAM]: 'artificial-intelligence' },
        labelKey: 'home.services.ai.name',
        // `servicios` y no `ia`: el parametro de arriba elige una pestana de la seccion de
        // servicios, asi que bajar a la seccion de IA cambiaba una pestana que el visitante
        // no llegaba a ver. La seccion de IA es otra cosa y tiene su propio enlace.
        fragment: 'servicios',
      },
      {
        id: 'footer-staff',
        queryParams: { [SERVICE_QUERY_PARAM]: 'staff-augmentation' },
        labelKey: 'home.services.staff.name',
        fragment: 'servicios',
      },
      {
        id: 'footer-automation',
        queryParams: { [SERVICE_QUERY_PARAM]: 'process-automation' },
        labelKey: 'home.services.automation.name',
        fragment: 'servicios',
      },
      {
        id: 'footer-consulting',
        queryParams: { [SERVICE_QUERY_PARAM]: 'technology-consulting' },
        labelKey: 'home.services.consulting.name',
        fragment: 'servicios',
      },
    ],
    cases: [
      { id: 'footer-toyota', labelKey: 'home.cases.toyota.name', fragment: 'casos' },
      { id: 'footer-dilo', labelKey: 'home.cases.dilo.name', fragment: 'casos' },
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
