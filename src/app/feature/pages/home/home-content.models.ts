export type PublicationStatus = 'approved' | 'pending' | 'withdrawn';

export const HOME_SECTION_IDS = [
  'inicio',
  'clientes',
  'desafios',
  'servicios',
  'casos',
  'ia',
  'productos',
  'por-que-appland',
  'equipo-global',
  'contacto',
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];
export type ObservedRegionId = HomeSectionId | 'footer';

export interface ApprovedAsset {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly decorative: boolean;
  readonly publicationStatus: PublicationStatus;
}

export interface ApprovedDestination {
  readonly kind: 'fragment' | 'external' | 'email' | 'phone' | 'whatsapp';
  readonly value: string;
  readonly publicationStatus: PublicationStatus;
  readonly newContext: boolean;
}

export interface LabeledDestination extends ApprovedDestination {
  readonly id: string;
  readonly label: string;
}

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly fragment: HomeSectionId;
  readonly prominent: boolean;
}

export interface FragmentLink {
  readonly id: string;
  readonly label: string;
  readonly fragment: HomeSectionId;
}

export interface ConversionAction {
  readonly id: string;
  readonly label: string;
  readonly intent: 'meeting' | 'whatsapp' | 'services' | 'inquiry';
  readonly destination?: ApprovedDestination;
  readonly fallbackFragment?: HomeSectionId;
  readonly approvedMessage?: string;
}

export interface HeroContent {
  readonly title: string;
  readonly subtitle: string;
  readonly primaryAction: ConversionAction;
  readonly servicesAction: ConversionAction;
  readonly whatsappAction?: ConversionAction;
  readonly decorativeAsset?: ApprovedAsset;
}

export interface Client {
  readonly id: string;
  readonly name: string;
  readonly logo: ApprovedAsset;
  readonly publicationStatus: PublicationStatus;
}

export interface Challenge {
  readonly id: string;
  readonly problem: string;
  readonly response: string;
  readonly visualKey?: string;
  readonly media?: ApprovedAsset;
}

export interface ServiceHighlight {
  readonly id: string;
  readonly label: string;
  readonly iconKey: string;
}

export interface Service {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly visualKey?: string;
  readonly media?: ApprovedAsset;
  /** Derived from the approved summary; never new business copy. */
  readonly highlights?: readonly ServiceHighlight[];
}

export interface CaseStudy {
  readonly id: string;
  readonly name: string;
  readonly summary?: string;
  readonly media?: ApprovedAsset;
  readonly destination?: ApprovedDestination;
  readonly publicationStatus: PublicationStatus;
}

export interface AiApplication {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly visualKey?: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly summary?: string;
  readonly media?: ApprovedAsset;
  readonly publicationStatus: PublicationStatus;
  readonly inquiryAction: ConversionAction;
}

export interface Benefit {
  readonly id: string;
  readonly statement: string;
  readonly visualKey?: string;
}

export interface CountryPresence {
  readonly code: 'HN' | 'US' | 'CO' | 'PA' | 'BD' | 'GT';
  readonly name: string;
}

export interface ContactContent {
  readonly title: string;
  readonly body: string;
  readonly meetingAction: ConversionAction;
  readonly whatsappAction: ConversionAction;
  readonly email: ApprovedDestination;
  readonly phone: ApprovedDestination;
  readonly socialLinks: readonly LabeledDestination[];
}

export interface FooterContent {
  readonly brandSummary: string;
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
