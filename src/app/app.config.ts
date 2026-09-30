import { ViewportScroller } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { catchError, of } from 'rxjs';
import { LanguageService } from './components/shared/language.service';
import { routes } from './app.routes';

/**
 * Desplazamiento vertical que el router aplica al saltar a un anclaje de seccion.
 *
 * Compensa la altura del header fijo: sin el, los anclajes de la Home caen debajo del header
 * y la seccion queda parcialmente oculta.
 *
 * Se exporta para que la configuracion y su prueba lean el mismo valor, en vez de repetir el
 * literal en dos sitios donde podrian divergir sin que nada lo note.
 */
export const SECTION_SCROLL_OFFSET: [number, number] = [0, 104];

/**
 * Opciones de scroll en memoria del router.
 *
 * Se extraen a una constante porque `ROUTER_SCROLLER`, el token donde
 * `withInMemoryScrolling` deja el scroller construido con estas opciones, no es publico.
 * Al no poder leer la configuracion efectiva desde una prueba, la constante es la unica
 * fuente comun entre configuracion y verificacion.
 */
export const IN_MEMORY_SCROLLING: InMemoryScrollingOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withInMemoryScrolling(IN_MEMORY_SCROLLING)),
    /**
     * `withInMemoryScrolling` solo acepta `anchorScrolling` y `scrollPositionRestoration`.
     * El `scrollOffset` que `RouterModule.forRoot` aceptaba no tiene equivalente en la API
     * standalone: el camino NgModule lo aplicaba llamando `ViewportScroller.setOffset` desde
     * `provideRouterScroller`, y `withInMemoryScrolling` nunca lo hace.
     *
     * Este inicializador replica ese comportamiento de forma explicita. Sin el, la migracion
     * a standalone perderia el offset en silencio.
     */
    provideAppInitializer(() => {
      inject(ViewportScroller).setOffset(SECTION_SCROLL_OFFSET);
    }),
    provideHttpClient(withInterceptorsFromDi()),
    /**
     * No se fija `lang` aqui. Ese literal era lo que mantenia el sitio en espanol para todo
     * el mundo: el idioma lo resuelve el inicializador de abajo a partir de lo que el
     * visitante eligio antes y, si no hay nada, de su navegador.
     *
     * `fallbackLang` si se queda en espanol. Es la red para una clave que falte en ingles:
     * antes de mostrar la clave cruda, se muestra el texto en espanol.
     */
    provideTranslateService({
      fallbackLang: 'es',
      loader: provideTranslateHttpLoader(),
    }),
    /**
     * Resuelve el idioma y espera a que su traduccion este cargada antes del primer render.
     *
     * Las traducciones llegan por HTTP, asi que sin esta espera la primera pintura mostraria
     * las claves crudas y el texto aparecerian un instante despues.
     *
     * Un fallo de carga no impide arrancar. Si `es.json` no llega, el sitio se pinta con las
     * claves, que es malo pero legible; dejar que el error propague dejaria la pagina en
     * blanco, que es peor.
     */
    provideAppInitializer(() =>
      inject(LanguageService)
        .initialize()
        .pipe(catchError(() => of({}))),
    ),
  ],
};
