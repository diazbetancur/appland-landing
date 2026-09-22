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

  /**
   * Desde el spec 009 el contenido guarda claves, asi que aqui se fija a que claves apunta el
   * hero. El texto en si lo fija `translation-files.spec.ts`, que es donde ahora vive.
   */
  it('pins the approved hero copy keys so any rewiring is deliberate', () => {
    expect(HOME_CONTENT.hero.titleLeadKey).toBe('home.hero.titleLead');
    expect(HOME_CONTENT.hero.titleHighlightKey).toBe('home.hero.titleHighlight');
    expect(HOME_CONTENT.hero.subtitleKey).toBe('home.hero.subtitle');
    expect(HOME_CONTENT.hero.servicesAction.labelKey).toBe('home.actions.services');
  });

  it('keeps the page-wide contact shortcut separate from the contact section button', () => {
    // Compartir un solo objeto hacia que el boton de la seccion de contacto enlazara consigo
    // mismo. Son dos acciones distintas y esta prueba impide que vuelvan a fundirse.
    expect(HOME_CONTENT.contactAction.intent).toBe('meeting');
    expect(HOME_CONTENT.contactAction.fallbackFragment).toBe('contacto');

    expect(HOME_CONTENT.contact.meetingAction.intent).toBe('whatsapp');
    expect(HOME_CONTENT.contact.meetingAction.approvedMessageKey).toBe('home.actions.whatsappMeetingMessage');
    expect(HOME_CONTENT.contact.meetingAction.fallbackFragment).toBeUndefined();
  });

  /**
   * Guardia sobre los paises publicados.
   *
   * Las tres pruebas de TeamCoverageComponent comparan contra `HOME_CONTENT.countries`, asi
   * que pasan con la lista que sea: ninguna detecta que se anada, quite o renombre un pais.
   * Anclarla aqui obliga a editar esta lista a proposito, que es la barrera que faltaba.
   */
  // Desde el spec 009 el config guarda la clave del nombre, no el nombre: Mexico, Panama y
  // Peru cambian de forma en ingles. El texto lo comprueba la prueba de la seccion.
  const APPROVED_COUNTRIES: readonly { code: string; nameKey: string }[] = [
    { code: 'HN', nameKey: 'home.team.countries.HN' },
    { code: 'AR', nameKey: 'home.team.countries.AR' },
    { code: 'CO', nameKey: 'home.team.countries.CO' },
    { code: 'PA', nameKey: 'home.team.countries.PA' },
    { code: 'GT', nameKey: 'home.team.countries.GT' },
    { code: 'MX', nameKey: 'home.team.countries.MX' },
    { code: 'SV', nameKey: 'home.team.countries.SV' },
    { code: 'PE', nameKey: 'home.team.countries.PE' },
    { code: 'EC', nameKey: 'home.team.countries.EC' },
  ];

  it('publishes exactly the approved countries, in the approved order', () => {
    expect(HOME_CONTENT.countries.map(({ code, nameKey }) => ({ code, nameKey }))).toEqual(APPROVED_COUNTRIES);
  });

  /**
   * Sin esto, declarar un pais nuevo apuntando por error al SVG de otro pasaria verde: las
   * pruebas de la seccion solo comprueban que la ruta empiece por `assets/`.
   */
  it('points every flag at the local asset named after its own country code', () => {
    HOME_CONTENT.countries.forEach((country) => {
      expect(country.flag.src).toBe(`assets/images/home/flags/${country.code.toLowerCase()}.svg`);
      // Todas las banderas comparten una clave con parametro; el pais lo pone la plantilla.
      expect(country.flag.altKey).toBe('home.team.flagAlt');
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
    const about = HOME_CONTENT.navigation.find((item) => item.labelKey === 'nav.about');
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
    expect(visible.map((item) => item.name)).toEqual(['Dilo', 'Toyota', 'Tengo', 'TV Azteca Honduras']);
    expect(visible.every((item) => Boolean(item.media))).toBe(true);
  });

  /**
   * Dilo y Tengo son las dos aplicaciones financieras y se parecen: mismo mockup de telefono y
   * resumenes casi identicos, "Aplicacion financiera" y "Aplicacion movil financiera". Puestas
   * una al lado de la otra el carrusel parecia repetir la misma tarjeta, asi que Toyota va
   * entre ellas. La prueba fija el motivo, no la posicion: lo que no puede volver a pasar es
   * que queden contiguas.
   */
  it('never places the two finance apps side by side', () => {
    const ids = selectVisibleCases().map((item) => item.id);
    const dilo = ids.indexOf('dilo');
    const tengo = ids.indexOf('tengo');

    expect(dilo, 'Dilo no esta publicado').toBeGreaterThanOrEqual(0);
    expect(tengo, 'Tengo no esta publicado').toBeGreaterThanOrEqual(0);
    expect(Math.abs(dilo - tengo), 'Dilo y Tengo quedaron contiguas').toBeGreaterThan(1);
  });

  /**
   * El nombre que se pinta es un literal del contenido, no una clave, asi que nada lo ataba al
   * caso que describe: el commit 4a500ca lo cambio de "Tengo" a "Go" al aprobar el caso y el
   * sitio llevaba una ronda entera anunciando una marca que no es la de la app. El texto
   * alternativo de la captura, que si venia de traduccion, decia "Tengo" todo el tiempo.
   */
  it('names each case the same way its own screenshot describes it', () => {
    const tengo = selectVisibleCases().find((item) => item.id === 'tengo');

    expect(tengo?.name).toBe('Tengo');
    expect(tengo?.media?.altKey).toBe('home.cases.tengo.alt');
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

      const summary = service.summaryKey.toLowerCase();
      const echoed = highlights.filter((highlight) => summary.includes(highlight.labelKey.toLowerCase()));

      expect(echoed.length).toBeLessThan(highlights.length);
    }
  });
});
