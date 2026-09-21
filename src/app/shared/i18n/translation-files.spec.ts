import { SUPPORTED_LANGUAGES } from '../../components/shared/language.service';

/**
 * Contrato de los archivos de traduccion.
 *
 * El spec 009 existe porque una correccion de copia aprobada se aplico a la maqueta de
 * referencia y no al sitio, y nada podia detectarlo. Estas pruebas son el guardia de la forma
 * de los archivos: que los dos idiomas declaren exactamente las mismas claves y que ninguna
 * quede vacia. Una clave que exista solo en espanol es un hueco en el sitio en ingles.
 *
 * Los archivos se piden por HTTP en vez de importarse porque es asi como los carga la
 * aplicacion: lo que se verifica es el archivo que se publica, no una copia compilada.
 */
describe('Translation files', () => {
  type Translations = Record<string, unknown>;

  const flatten = (value: Translations, prefix = ''): Map<string, unknown> => {
    const entries = new Map<string, unknown>();
    for (const [key, child] of Object.entries(value)) {
      const path = `${prefix}${key}`;
      if (child !== null && typeof child === 'object' && !Array.isArray(child)) {
        for (const [nested, nestedValue] of flatten(child as Translations, `${path}.`)) {
          entries.set(nested, nestedValue);
        }
        continue;
      }
      entries.set(path, child);
    }
    return entries;
  };

  const load = async (lang: string): Promise<Map<string, unknown>> => {
    const response = await fetch(`/assets/i18n/${lang}.json`);
    expect(response.ok, `no se pudo leer assets/i18n/${lang}.json`).toBe(true);
    return flatten((await response.json()) as Translations);
  };

  it('declares the same keys in every supported language', async () => {
    const [spanish, english] = await Promise.all(SUPPORTED_LANGUAGES.map((lang) => load(lang)));

    const onlyInSpanish = [...spanish.keys()].filter((key) => !english.has(key));
    const onlyInEnglish = [...english.keys()].filter((key) => !spanish.has(key));

    expect(onlyInSpanish, 'claves sin traducir al ingles').toEqual([]);
    expect(onlyInEnglish, 'claves que sobran en ingles').toEqual([]);
  });

  it('has no empty values in any supported language', async () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const entries = await load(lang);
      const empty = [...entries].filter(([, value]) => typeof value === 'string' && !value.trim());
      expect(
        empty.map(([key]) => key),
        `claves vacias en ${lang}`,
      ).toEqual([]);
    }
  });

  /**
   * Guardia contra textos sin traducir.
   *
   * Una clave cuyo valor en ingles es identico al espanol casi siempre significa que alguien
   * anadio copia nueva y solo la escribio en un idioma. Las excepciones legitimas se declaran
   * aqui una por una, asi que sumar una nueva obliga a justificarla.
   */
  it('has no untranslated leftovers between Spanish and English', async () => {
    /** Nombres propios, codigos, siglas y cifras: iguales en los dos idiomas a proposito. */
    const IDENTICAL_ON_PURPOSE = new Set([
      'footer.whatsapp',
      'home.cases.dilo.name',
      'home.cases.toyota.name',
      'home.contact.social.instagram',
      'home.contact.social.linkedin',
      'home.hero.cardMetric',
      'home.products.ecommerce',
      'home.services.staff.name',
      'home.services.staff.qa',
      'home.services.staff.ux',
      'home.team.countries.AR',
      'home.team.countries.CO',
      'home.team.countries.EC',
      'home.team.countries.GT',
      'home.team.countries.HN',
      'home.team.countries.SV',
      // El nombre de cada idioma va en su propio idioma en las dos versiones, para que quien
      // cayo en el que no entiende reconozca el suyo.
      'menu.language.en.code',
      'menu.language.en.name',
      'menu.language.es.code',
      'menu.language.es.name',
    ]);

    const [spanish, english] = await Promise.all([load('es'), load('en')]);

    const untranslated = [...spanish.keys()]
      .filter((key) => key.includes('.'))
      .filter((key) => !IDENTICAL_ON_PURPOSE.has(key))
      .filter((key) => spanish.get(key) === english.get(key));

    expect(untranslated, 'claves con el mismo texto en los dos idiomas').toEqual([]);
  });

  /**
   * Fija la copia aprobada del hero en espanol.
   *
   * Venia de `home-content.config.spec.ts`, donde el texto vivia antes del spec 009. El
   * proposito es el mismo: que un cambio de redaccion sea deliberado y no un descuido.
   *
   * El subtitulo dice "SaaS Automatizacion" sin coma. Esta fijado tal cual a proposito: es el
   * punto 03 de la auditoria UX/UI y no esta resuelto, asi que cambiarlo tiene que ser una
   * decision, no un arreglo de paso.
   */
  it('pins the approved Spanish hero copy', async () => {
    const spanish = await load('es');

    expect(spanish.get('home.hero.titleLead')).toBe('Impulsamos tu negocio ');
    expect(spanish.get('home.hero.titleHighlight')).toBe('con tecnología inteligente.');
    expect(spanish.get('home.hero.subtitle')).toBe(
      'Desarrollo de software, Inteligencia Artificial, SaaS Automatización y Staff Augmentation ' +
        'para empresas que buscan crecer mejor y más rápido.',
    );
    expect(spanish.get('home.actions.services')).toBe('Nuestros servicios');
  });

  /**
   * El titulo del hero se pinta partido en dos campos porque el tramo final va en cian. Si uno
   * de los dos quedara vacio en un idioma, ese idioma perderia media frase o el resaltado.
   */
  it('keeps both halves of the hero title in every language', async () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const entries = await load(lang);
      expect(entries.get('home.hero.titleLead'), `titleLead en ${lang}`).toBeTruthy();
      expect(entries.get('home.hero.titleHighlight'), `titleHighlight en ${lang}`).toBeTruthy();
    }
  });
});
