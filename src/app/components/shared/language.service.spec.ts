import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService, TranslateService, TranslationObject } from '@ngx-translate/core';
import { LanguageService } from './language.service';

/**
 * Nota de alcance: al 2026-08-31 ningun componente inyecta LanguageService, asi que su
 * constructor no corre en la aplicacion real y esta logica no se ejecuta en produccion.
 * Estas pruebas documentan el comportamiento del archivo tal como esta, porque el spec 002
 * lo modifico (tipado de getTranslations). La decision sobre soporte multiidioma, y sobre
 * si este servicio debe conectarse o eliminarse, corresponde a su propio spec.
 */
describe('LanguageService', () => {
  const STORAGE_KEY = 'language';

  /** Define navigator.language como propiedad propia; se elimina en afterEach para restaurar el getter del prototipo. */
  const setBrowserLanguage = (value: string): void => {
    Object.defineProperty(navigator, 'language', { value, configurable: true });
  };

  /** Siembra traducciones antes de inyectar el servicio para que use() resuelva sin cargador. */
  const seedTranslations = (): TranslateService => {
    const translate = TestBed.inject(TranslateService);
    for (const lang of ['en', 'es', 'fr']) {
      translate.setTranslation(lang, { greeting: lang });
    }
    return translate;
  };

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService()],
    });
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    Reflect.deleteProperty(navigator, 'language');
  });

  describe('seleccion de idioma al construirse', () => {
    it('prefiere el idioma persistido en localStorage sobre el del navegador', () => {
      const translate = seedTranslations();
      localStorage.setItem(STORAGE_KEY, 'es');
      setBrowserLanguage('en-US');

      TestBed.inject(LanguageService);

      expect(translate.currentLang()).toBe('es');
    });

    it('usa el idioma del navegador cuando no hay nada persistido y es soportado', () => {
      const translate = seedTranslations();
      setBrowserLanguage('es-CO');

      TestBed.inject(LanguageService);

      expect(translate.currentLang()).toBe('es');
    });

    it('cae al ingles cuando el idioma del navegador no es en ni es', () => {
      const translate = seedTranslations();
      setBrowserLanguage('fr-FR');

      TestBed.inject(LanguageService);

      expect(translate.currentLang()).toBe('en');
    });
  });

  describe('changeLanguage', () => {
    it('cambia el idioma activo y lo persiste', () => {
      const translate = seedTranslations();
      setBrowserLanguage('en-US');
      const service = TestBed.inject(LanguageService);

      service.changeLanguage('es');

      expect(translate.currentLang()).toBe('es');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('es');
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
      seedTranslations();
      localStorage.setItem(STORAGE_KEY, 'es');
      setBrowserLanguage('en-US');
      const service = TestBed.inject(LanguageService);

      expect(service.getCurrentLanguage()).toBe('es');
    });
  });
});
