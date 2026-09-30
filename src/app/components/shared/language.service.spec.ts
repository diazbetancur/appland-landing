import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService, TranslateService, TranslationObject } from '@ngx-translate/core';
import { LANGUAGE_STORAGE_KEY, LanguageService, SUPPORTED_LANGUAGES } from './language.service';

/**
 * Desde el spec 009 este servicio si se ejecuta en la aplicacion: lo llama el inicializador de
 * `app.config.ts`. La resolucion del idioma dejo de ocurrir en el constructor y pasa a ser un
 * metodo explicito, asi que las pruebas la invocan en vez de provocarla inyectando el servicio.
 */
describe('LanguageService', () => {
  /** Define navigator.language como propiedad propia; se elimina en afterEach para restaurar el getter del prototipo. */
  const setBrowserLanguage = (value: string): void => {
    Object.defineProperty(navigator, 'language', { value, configurable: true });
  };

  /** Siembra traducciones antes de usar el servicio para que use() resuelva sin cargador. */
  const seedTranslations = (): TranslateService => {
    const translate = TestBed.inject(TranslateService);
    for (const lang of ['en', 'es', 'fr']) {
      translate.setTranslation(lang, { greeting: lang });
    }
    return translate;
  };

  beforeEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService()],
    });
  });

  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    Reflect.deleteProperty(navigator, 'language');
  });

  it('publica espanol e ingles, en ese orden', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['es', 'en']);
  });

  describe('resolveInitialLanguage', () => {
    it('prefiere el idioma persistido sobre el del navegador', () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
      setBrowserLanguage('en-US');

      expect(TestBed.inject(LanguageService).resolveInitialLanguage()).toBe('es');
    });

    it('usa el idioma del navegador cuando no hay nada persistido y es soportado', () => {
      setBrowserLanguage('es-CO');

      expect(TestBed.inject(LanguageService).resolveInitialLanguage()).toBe('es');
    });

    it('cae al ingles cuando el idioma del navegador no es en ni es', () => {
      setBrowserLanguage('fr-FR');

      expect(TestBed.inject(LanguageService).resolveInitialLanguage()).toBe('en');
    });

    it('ignora un idioma persistido que no esta soportado', () => {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');
      setBrowserLanguage('es-CO');

      expect(TestBed.inject(LanguageService).resolveInitialLanguage()).toBe('es');
    });

    /**
     * Este valor lo lee el inicializador de la aplicacion, asi que una excepcion de
     * localStorage impediria arrancar el sitio entero.
     */
    it('resuelve igual cuando localStorage lanza al leer', () => {
      setBrowserLanguage('es-CO');
      const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage bloqueado');
      });

      expect(TestBed.inject(LanguageService).resolveInitialLanguage()).toBe('es');

      getItem.mockRestore();
    });

    it('no toca el idioma activo: solo lo resuelve', () => {
      const translate = seedTranslations();
      translate.use('en');
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');

      TestBed.inject(LanguageService).resolveInitialLanguage();

      expect(translate.currentLang()).toBe('en');
    });
  });

  describe('initialize', () => {
    it('aplica el idioma resuelto', () => {
      const translate = seedTranslations();
      localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
      setBrowserLanguage('en-US');

      TestBed.inject(LanguageService).initialize().subscribe();

      expect(translate.currentLang()).toBe('es');
    });

    /** NFR-006: el arranque espera esto, asi que tiene que completar. */
    it('completa cuando la traduccion esta disponible', () => {
      seedTranslations();
      setBrowserLanguage('es-CO');
      let completed = false;

      TestBed.inject(LanguageService)
        .initialize()
        .subscribe({ complete: () => (completed = true) });

      expect(completed).toBe(true);
    });
  });

  describe('changeLanguage', () => {
    it('cambia el idioma activo y lo persiste', () => {
      const translate = seedTranslations();
      setBrowserLanguage('en-US');
      const service = TestBed.inject(LanguageService);

      service.changeLanguage('es');

      expect(translate.currentLang()).toBe('es');
      expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('es');
    });

    it('cambia el idioma aunque localStorage lance al escribir', () => {
      const translate = seedTranslations();
      setBrowserLanguage('en-US');
      const service = TestBed.inject(LanguageService);
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage bloqueado');
      });

      service.changeLanguage('es');

      expect(translate.currentLang()).toBe('es');
      setItem.mockRestore();
    });
  });

  describe('getTranslations', () => {
    it('pide el archivo de traduccion del idioma indicado y devuelve su contenido', () => {
      seedTranslations();
      setBrowserLanguage('en-US');
      const service = TestBed.inject(LanguageService);
      const http = TestBed.inject(HttpTestingController);
      const payload: TranslationObject = { greeting: 'Hola' };

      let received: TranslationObject | undefined;
      service.getTranslations('es').subscribe((result) => (received = result));

      const request = http.expectOne('assets/i18n/es.json');
      expect(request.request.method).toBe('GET');
      request.flush(payload);

      expect(received).toEqual(payload);
      http.verify();
    });
  });

  describe('getCurrentLanguage', () => {
    it('reporta el idioma activo', () => {
      const translate = seedTranslations();
      translate.use('es');

      expect(TestBed.inject(LanguageService).getCurrentLanguage()).toBe('es');
    });
  });
});
