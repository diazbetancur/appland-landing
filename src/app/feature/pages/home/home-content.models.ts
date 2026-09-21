export type PublicationStatus = 'approved' | 'pending' | 'withdrawn';

export const HOME_SECTION_IDS = [
  'inicio',
  'clientes',
  'servicios',
  'desafios',
  'casos',
  'ia',
  'por-que-appland',
  'equipo-global',
  'contacto',
  'productos',
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];
export type ObservedRegionId = HomeSectionId | 'footer';

export interface ApprovedAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /**
   * Clave de traduccion del texto alternativo, no el texto.
   *
   * Es contenido visible: lo unico que recibe quien navega con lector de pantalla. Dejarlo
   * en espanol en la version inglesa seria dejar el sitio sin traducir justo para esas
   * personas.
   *
   * Vacia en las imagenes decorativas, que no tienen nada que describir.
   */
  readonly altKey: string;
  readonly decorative: boolean;
  readonly publicationStatus: PublicationStatus;
}

export interface ApprovedDestination {
  readonly kind: 'fragment' | 'external' | 'email' | 'phone' | 'whatsapp';
  readonly value: string;
  /**
   * Texto con el que se muestra el destino, cuando no coincide con el valor.
   *
   * Un telefono se marca como `+50433349211` y se lee como `+504 3334-9211`. Antes la version
   * legible estaba escrita a mano en las dos plantillas que la pintan, asi que corregir el
   * numero en un sitio dejaba el otro desactualizado: es lo que paso en el commit f1ed2ba,
   * que cambio el valor del config y las plantillas siguieron con el numero anterior.
   *
   * No lleva clave de traduccion: un numero de telefono no se traduce.
   */
  readonly displayValue?: string;
  readonly publicationStatus: PublicationStatus;
  readonly newContext: boolean;
}

export interface LabeledDestination extends ApprovedDestination {
  readonly id: string;
  readonly labelKey: string;
}

export interface NavigationItem {
  readonly id: string;
  readonly labelKey: string;
  readonly fragment: HomeSectionId;
  readonly prominent: boolean;
}

export interface FragmentLink {
  readonly id: string;
  readonly labelKey: string;
  readonly fragment: HomeSectionId;
  /**
   * Parametros de consulta del enlace. La seccion de servicios es un componente de pestanas
   * con un solo anclaje, asi que el fragmento por si solo no puede seleccionar un servicio
   * concreto: eso lo hace un parametro que el componente lee de la URL.
   */
  readonly queryParams?: Readonly<Record<string, string>>;
}

export interface ConversionAction {
  readonly id: string;
  readonly labelKey: string;
  readonly intent: 'meeting' | 'whatsapp' | 'services' | 'inquiry';
  readonly destination?: ApprovedDestination;
  readonly fallbackFragment?: HomeSectionId;
  /**
   * Clave del mensaje que se precarga en WhatsApp. Se traduce: quien escribe desde la version
   * inglesa del sitio no deberia abrir el chat con un mensaje en espanol ya escrito.
   */
  readonly approvedMessageKey?: string;
}

export interface HeroContent {
  /**
   * El titulo se declara partido en dos porque el hero pinta su tramo final en cian.
   * Antes esa particion se deducia buscando una palabra literal dentro del titulo, asi que
   * cualquier cambio de copia que no la contuviera apagaba el resaltado sin avisar.
   */
  readonly titleLeadKey: string;
  readonly titleHighlightKey: string;
  readonly subtitleKey: string;
  readonly primaryAction: ConversionAction;
  readonly servicesAction: ConversionAction;
  readonly whatsappAction?: ConversionAction;
  readonly decorativeAsset?: ApprovedAsset;
}

export interface Client {
  readonly id: string;
  /** Nombre propio de la empresa. Sin clave: traducirlo seria renombrar al cliente. */
  readonly name: string;
  readonly logo: ApprovedAsset;
  readonly publicationStatus: PublicationStatus;
}

export interface Challenge {
  readonly id: string;
  readonly problemKey: string;
  readonly responseKey: string;
  readonly visualKey?: string;
  readonly media?: ApprovedAsset;
}

export interface ServiceHighlight {
  readonly id: string;
  readonly labelKey: string;
  readonly iconKey: string;
}

export interface Service {
  readonly id: string;
  readonly nameKey: string;
  readonly summaryKey: string;
  readonly visualKey?: string;
  readonly media?: ApprovedAsset;
  /** Derived from the approved summary; never new business copy. */
  readonly highlights?: readonly ServiceHighlight[];
}

export interface CaseStudy {
  readonly id: string;
  /** Nombre propio del proyecto. Sin clave: traducirlo seria renombrar el trabajo. */
  readonly name: string;
  readonly summaryKey?: string;
  readonly descriptionKey?: string;
  readonly media?: ApprovedAsset;
  readonly destination?: ApprovedDestination;
  readonly publicationStatus: PublicationStatus;
}

export interface AiApplication {
  readonly id: string;
  readonly labelKey: string;
  readonly descriptionKey: string;
  readonly visualKey?: string;
}

export interface Product {
  readonly id: string;
  /** Categoria de negocio, no marca: "Restaurantes" es "Restaurants" en ingles. */
  readonly nameKey: string;
  readonly summaryKey?: string;
  readonly media?: ApprovedAsset;
  readonly publicationStatus: PublicationStatus;
  readonly inquiryAction: ConversionAction;
}

export interface Benefit {
  readonly id: string;
  readonly statementKey: string;
  readonly descriptionKey: string;
  readonly visualKey?: string;
}

/**
 * Al incorporar un pais nuevo hay que anadir su codigo aqui y su bandera SVG local en
 * `src/assets/images/home/flags/`, cuyo ATTRIBUTION.md explica de donde salen los archivos.
 */
export interface CountryPresence {
  readonly code: 'HN' | 'AR' | 'CO' | 'PA' | 'GT' | 'MX' | 'SV' | 'PE' | 'EC';
  /** Lleva clave: Mexico, Panama y Peru cambian de forma en ingles. */
  readonly nameKey: string;
  readonly flag: ApprovedAsset;
}

export interface ContactContent {
  readonly titleKey: string;
  readonly bodyKey: string;
  readonly meetingAction: ConversionAction;
  readonly whatsappAction: ConversionAction;
  readonly email: ApprovedDestination;
  readonly phone: ApprovedDestination;
  readonly socialLinks: readonly LabeledDestination[];
}

export interface FooterContent {
  readonly brandSummaryKey: string;
  readonly navigation: readonly NavigationItem[];
  readonly services: readonly FragmentLink[];
  readonly cases: readonly FragmentLink[];
  readonly contact: ContactContent;
  readonly socialLinks: readonly LabeledDestination[];
  readonly legalLinks: readonly LabeledDestination[];
  readonly copyrightOwner: string;
}

export interface HomeContent {
  readonly navigation: readonly NavigationItem[];
  /**
   * Accion que baja a la seccion de contacto desde el resto de la pagina.
   *
   * Vive aqui y no dentro de `contact` porque no pertenece a esa seccion: la usan las
   * secciones intermedias para llevar hasta ella. El boton de la propia seccion de contacto
   * es `contact.meetingAction`, y hace algo distinto.
   */
  readonly contactAction: ConversionAction;
  readonly hero: HeroContent;
  readonly clients: readonly Client[];
  readonly challenges: readonly Challenge[];
  readonly services: readonly Service[];
  readonly cases: readonly CaseStudy[];
  readonly aiApplications: readonly AiApplication[];
  readonly products: readonly Product[];
  readonly benefits: readonly Benefit[];
  readonly countries: readonly CountryPresence[];
  readonly contact: ContactContent;
  readonly footer: FooterContent;
}

export interface ResolvedAction {
  readonly kind: 'router' | 'href';
  readonly href?: string;
  readonly fragment?: HomeSectionId;
  readonly target?: '_blank';
  readonly rel?: 'noopener noreferrer';
}
