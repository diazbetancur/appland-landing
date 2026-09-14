import { ViewportScroller } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ServiceComponent } from './components/service/service.component';
import { HomeComponent } from './feature/pages/home/home.component';
import { IN_MEMORY_SCROLLING, SECTION_SCROLL_OFFSET, appConfig } from './app.config';
import { routes } from './app.routes';

/**
 * Contrato de configuracion de la aplicacion.
 *
 * Sustituye a app-routing.module.spec.ts, que desaparecio con el NgModule de routing en el
 * spec 006. Aquella prueba nacio en el spec 005 para reemplazar un falso positivo que
 * asserteaba contra su propia copia de las rutas.
 */
describe('Application configuration contract', () => {
  it('preserves only the existing Home, About and Service route ownership', () => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideLocationMocks()] });

    const configured = TestBed.inject(Router).config;

    expect(configured.map((route) => route.path)).toEqual(['', 'about', 'service']);
    expect(configured[0].component).toBe(HomeComponent);
    expect(configured[1].component).toBe(AboutComponent);
    expect(configured[2].component).toBe(ServiceComponent);
    expect(configured).toEqual(routes);
  });

  describe('scroll configuration', () => {
    /**
     * Este es el guardia fuerte del spec 006.
     *
     * `withInMemoryScrolling` no acepta `scrollOffset`, asi que el offset del header fijo
     * dejo de viajar con la configuracion del router y pasa a aplicarse mediante un
     * inicializador que llama `ViewportScroller.setOffset`. La prueba ejecuta los
     * inicializadores de la configuracion real y verifica ese efecto, no la forma de un
     * objeto de opciones.
     */
    it('applies the fixed header offset to the viewport scroller at startup', async () => {
      const setOffset = vi.fn();
      // El doble se registra despues de appConfig.providers para sustituir al scroller real:
      // asi el espia existe antes de que corran los inicializadores, que es cuando se aplica.
      TestBed.configureTestingModule({
        providers: [
          ...appConfig.providers,
          provideLocationMocks(),
          { provide: ViewportScroller, useValue: { setOffset } as unknown as ViewportScroller },
        ],
      });

      await TestBed.inject(ApplicationInitStatus).donePromise;

      expect(setOffset).toHaveBeenCalledWith(SECTION_SCROLL_OFFSET);
    });

    it('keeps the fixed header offset at the height the layout expects', () => {
      expect(SECTION_SCROLL_OFFSET).toEqual([0, 104]);
    });

    /**
     * Limitacion declarada: `ROUTER_SCROLLER`, donde `withInMemoryScrolling` deja el scroller
     * construido con estas opciones, no es un export publico de `@angular/router`. No hay
     * forma soportada de leer las opciones efectivas desde una prueba.
     *
     * Este guardia es por tanto mas debil que el que existia con `RouterModule.forRoot`:
     * detecta que alguien cambie los valores, pero no detectaria que alguien elimine por
     * completo `withInMemoryScrolling` de la configuracion.
     */
    it('keeps anchor scrolling and scroll position restoration enabled', () => {
      expect(IN_MEMORY_SCROLLING.anchorScrolling).toBe('enabled');
      expect(IN_MEMORY_SCROLLING.scrollPositionRestoration).toBe('enabled');
    });
  });
});
