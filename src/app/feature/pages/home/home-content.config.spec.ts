import { HOME_CONTENT, selectVisibleCases, selectVisibleClients, selectVisibleProducts } from './home-content.config';
import { HOME_SECTION_IDS } from './home-content.models';

describe('HOME_CONTENT', () => {
  it('preserves the complete stable section id contract', () => {
    expect(HOME_SECTION_IDS).toEqual([
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
    ]);
  });

  it('pins the approved hero copy so any wording change is deliberate', () => {
    expect(HOME_CONTENT.hero.titleLead).toBe('Impulsamos tu negocio ');
    expect(HOME_CONTENT.hero.titleHighlight).toBe('con tecnología inteligente.');
    expect(HOME_CONTENT.hero.subtitle).toBe(
      'Desarrollo de software, Inteligencia Artificial, SaaS Automatización y Staff Augmentation para empresas que buscan crecer mejor y más rápido.',
    );
    expect(HOME_CONTENT.hero.servicesAction.label).toBe('Nuestros servicios');
  });

  it('keeps the page-wide contact shortcut separate from the contact section button', () => {
    // Compartir un solo objeto hacia que el boton de la seccion de contacto enlazara consigo
    // mismo. Son dos acciones distintas y esta prueba impide que vuelvan a fundirse.
    expect(HOME_CONTENT.contactAction.intent).toBe('meeting');
    expect(HOME_CONTENT.contactAction.fallbackFragment).toBe('contacto');

    expect(HOME_CONTENT.contact.meetingAction.intent).toBe('whatsapp');
    expect(HOME_CONTENT.contact.meetingAction.approvedMessage).toBe('Hola, quiero agendar una reunión.');
    expect(HOME_CONTENT.contact.meetingAction.fallbackFragment).toBeUndefined();

    expect(HOME_CONTENT.contact.whatsappAction.approvedMessage).toBeUndefined();
  });

  /**
   * Guardia sobre los paises publicados.
   *
   * Las tres pruebas de TeamCoverageComponent comparan contra `HOME_CONTENT.countries`, asi
   * que pasan con la lista que sea: ninguna detecta que se anada, quite o renombre un pais.
   * Anclarla aqui obliga a editar esta lista a proposito, que es la barrera que faltaba.
   */
  const APPROVED_COUNTRIES: readonly { code: string; name: string }[] = [
    { code: 'HN', name: 'Honduras' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PA', name: 'Panamá' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'MX', name: 'México' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'PE', name: 'Perú' },
    { code: 'EC', name: 'Ecuador' },
  ];

  it('publishes exactly the approved countries, in the approved order', () => {
    expect(HOME_CONTENT.countries.map(({ code, name }) => ({ code, name }))).toEqual(APPROVED_COUNTRIES);
  });

  /**
   * Sin esto, declarar un pais nuevo apuntando por error al SVG de otro pasaria verde: las
   * pruebas de la seccion solo comprueban que la ruta empiece por `assets/`.
   */
  it('points every flag at the local asset named after its own country code', () => {
    HOME_CONTENT.countries.forEach((country) => {
      expect(country.flag.src).toBe(`assets/images/home/flags/${country.code.toLowerCase()}.svg`);
      expect(country.flag.alt).toBe(`Bandera de ${country.name}`);
      expect(country.flag.publicationStatus).toBe('approved');
    });
  });

  it('contains exactly the approved business entity counts', () => {
    expect(HOME_CONTENT.challenges.length).toBe(5);
    expect(HOME_CONTENT.services.length).toBe(5);
    expect(HOME_CONTENT.cases.length).toBe(7);
    expect(HOME_CONTENT.aiApplications.length).toBe(9);
    expect(HOME_CONTENT.benefits.length).toBe(7);
    expect(HOME_CONTENT.countries.length).toBe(9);
  });

  it('maps Nosotros only to por-que-appland', () => {
    const about = HOME_CONTENT.navigation.find((item) => item.label === 'Nosotros');
    expect(about?.fragment).toBe('por-que-appland');
  });

  it('denies pending products by default', () => {
    expect(selectVisibleProducts()).toEqual([]);
  });

  it('shows the five approved client logos', () => {
    const visible = selectVisibleClients();
    expect(visible.map((client) => client.name)).toEqual(['Ficohsa', 'Grupo Terra', 'Tigo', 'Toyota', 'Avianca']);
    expect(visible.every((client) => Boolean(client.logo))).toBe(true);
  });

  it('shows only cases with approved copy and media, in approved order', () => {
    const visible = selectVisibleCases();
    expect(visible.map((item) => item.name)).toEqual(['Toyota', 'Dilo', 'Go', 'TV Azteca Honduras']);
    expect(visible.every((item) => Boolean(item.media))).toBe(true);
  });

  it('contains no testimonial or provisional public copy', () => {
    const visibleCopy = JSON.stringify({
      hero: HOME_CONTENT.hero,
      challenges: HOME_CONTENT.challenges,
      services: HOME_CONTENT.services,
      cases: selectVisibleCases(),
      ai: HOME_CONTENT.aiApplications,
      benefits: HOME_CONTENT.benefits,
      countries: HOME_CONTENT.countries,
      contact: HOME_CONTENT.contact,
    }).toLowerCase();
    expect(visibleCopy).not.toContain('testimonial');
    expect(visibleCopy).not.toContain('placeholder');
    expect(visibleCopy).not.toContain('coming soon');
  });

  it('keeps every service summary from being just a restatement of its own icon labels', () => {
    // Cada servicio muestra sus capacidades como iconos con etiqueta. Si el resumen se limita
    // a enumerar esas mismas etiquetas, el texto no aporta nada y duplica lo que ya se ve.
    for (const service of HOME_CONTENT.services) {
      const highlights = service.highlights ?? [];
      if (!highlights.length) {
        continue;
      }

      const summary = service.summary.toLowerCase();
      const echoed = highlights.filter((highlight) => summary.includes(highlight.label.toLowerCase()));

      expect(echoed.length).toBeLessThan(highlights.length);
    }
  });
});
