import { TestBed } from '@angular/core/testing';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { SupportedLanguage } from '../../components/shared/language.service';

/**
 * Carga en el TestBed las traducciones **reales** del idioma indicado.
 *
 * Deliberadamente no usa un doble que devuelva la clave. El spec 009 existe porque una
 * correccion de copia aprobada no llego al sitio y ninguna prueba lo noto: una prueba contra
 * un doble vacio verificaria que el pipe esta puesto, no que el texto es el correcto, y
 * volveria a dejar la copia sin vigilancia.
 *
 * Se piden por HTTP, que es como los carga la aplicacion, asi que lo que se verifica es el
 * archivo que se publica y no una copia compilada aparte.
 *
 * Requiere que el modulo de pruebas ya tenga `provideTranslateService`. No hace falta cargador
 * ni HttpClient: al sembrar la traduccion antes de `use`, se resuelve de memoria.
 */
export async function useTranslations(lang: SupportedLanguage = 'es'): Promise<void> {
  const response = await fetch(`/assets/i18n/${lang}.json`);
  if (!response.ok) {
    throw new Error(`No se pudo leer assets/i18n/${lang}.json en la prueba`);
  }
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation(lang, (await response.json()) as TranslationObject);
  translate.use(lang);
}
