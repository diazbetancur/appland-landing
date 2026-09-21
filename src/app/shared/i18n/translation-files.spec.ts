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
