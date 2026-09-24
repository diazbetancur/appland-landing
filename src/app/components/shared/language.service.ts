import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { InterpolatableTranslationObject, TranslateService, TranslationObject } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Idiomas que el sitio publica. El orden es el que usa el selector de la barra.
 *
 * Se exporta para que el selector, el servicio y sus pruebas lean la misma lista en vez de
 * repetir los dos literales en tres sitios donde podrian divergir sin que nada lo note.
 */
export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Clave de `localStorage` donde se recuerda la eleccion del visitante. */
export const LANGUAGE_STORAGE_KEY = 'language';

/**
 * Idioma al que se cae cuando el navegador no esta ni en espanol ni en ingles.
 *
 * Es el que el archivo ya tenia antes del spec 009, y se conserva a proposito: cambiarlo a
 * espanol es una decision de producto, no de implementacion.
 */
const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

function isSupported(value: string | null): value is SupportedLanguage {
  return value !== null && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  private http = inject(HttpClient);

  /**
   * Idioma inicial, sin aplicarlo.
   *
   * La resolucion vive en un metodo propio y el constructor no hace nada. Antes ocurria al
   * construirse, lo que obligaba a que alguien inyectara el servicio para que pasara algo, y
   * esa es exactamente la razon por la que nunca se ejecuto: ningun componente lo inyectaba.
   * Ahora la llama el inicializador de `app.config.ts`, de forma explicita.
   */
  resolveInitialLanguage(): SupportedLanguage {
    const stored = this.readStoredLanguage();
    if (isSupported(stored)) {
      return stored;
    }

    const browser = this.readBrowserLanguage();
    return isSupported(browser) ? browser : FALLBACK_LANGUAGE;
  }

  /**
   * Resuelve el idioma inicial y deja cargada su traduccion.
   *
   * Devuelve el observable de `use` sin suscribirse para que el inicializador pueda esperarlo:
   * las traducciones llegan por HTTP, asi que sin esa espera el primer render mostraria las
   * claves crudas.
   */
  initialize(): Observable<InterpolatableTranslationObject> {
    return this.translate.use(this.resolveInitialLanguage());
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.writeStoredLanguage(lang);
  }

  getTranslations(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`assets/i18n/${lang}.json`);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang() ?? FALLBACK_LANGUAGE;
  }

  /**
   * `localStorage` lanza en lugar de devolver vacio cuando el navegador tiene el almacenamiento
   * bloqueado o en algunos modos privados. Este valor lo lee el inicializador de la aplicacion,
   * asi que una excepcion aqui impediria arrancar: se trata como "no hay nada guardado".
   */
  private readStoredLanguage(): string | null {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /** Por la misma razon que la lectura: no poder recordar la eleccion no debe romper el cambio. */
  private writeStoredLanguage(lang: string): void {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Sin almacenamiento, la eleccion vale para esta visita y no se recuerda en la siguiente.
    }
  }

  private readBrowserLanguage(): string | null {
    if (typeof navigator === 'undefined' || !navigator.language) {
      return null;
    }
    return navigator.language.split('-')[0];
  }
}
