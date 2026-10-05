import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { HomeSectionDirective } from './home-section.directive';
import { HomeSectionObserverService } from '../services/home-section-observer.service';

describe('HomeSectionDirective', () => {
  it('registers and unregisters safely when IntersectionObserver is unavailable', () => {
    const service = {
      registerRegion: vi.fn().mockName('HomeSectionObserverService.registerRegion'),
      unregisterRegion: vi.fn().mockName('HomeSectionObserverService.unregisterRegion'),
      notifyRegionVisibility: vi.fn().mockName('HomeSectionObserverService.notifyRegionVisibility'),
      activationLinePercent: 25,
      activationBandPercent: 1,
    };
    // La directiva obtiene sus dependencias con inject() desde el spec 006. Los dobles se
    // registran como proveedores y la instancia se crea en un contexto de inyeccion.
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new ElementRef(document.createElement('section')) },
        // Doble parcial: solo los tres metodos y la propiedad que la directiva consume.
        { provide: HomeSectionObserverService, useValue: service as unknown as HomeSectionObserverService },
      ],
    });
    const directive = TestBed.runInInjectionContext(() => new HomeSectionDirective());
    directive.regionId = 'inicio';
    const originalObserver = window.IntersectionObserver;
    (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver = undefined;
    directive.ngAfterViewInit();
    directive.ngOnDestroy();
    (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver = originalObserver;
    expect(service.registerRegion).toHaveBeenCalledWith('inicio');
    expect(service.unregisterRegion).toHaveBeenCalledWith('inicio');
  });
});

/**
 * Geometria del indicador de seccion.
 *
 * Esta es la prueba que faltaba, y su ausencia es la razon de que el fallo llegara a
 * produccion: las pruebas del servicio llamaban `notifyRegionVisibility(region, true)` pasando
 * el `true` a mano, y la unica prueba de la directiva cubria el caso en que
 * `IntersectionObserver` no existe. Nadie comprobaba la condicion que decide cual se activa.
 *
 * Medido en Chromium antes del arreglo: 26 callbacks en un recorrido completo de la Home y uno
 * solo cumplia la condicion, el inicial del hero. La banda observada media 130 px y todas las
 * secciones miden entre 308 y 1080 px, asi que ninguna llegaba a producir el callback que la
 * habria activado.
 */
@Component({
  selector: 'app-section-host',
  imports: [HomeSectionDirective],
  template: `
    <div style="height: 300px"></div>
    <section appHomeSection="inicio" style="height: 1200px; background: #101"></section>
    <section appHomeSection="casos" style="height: 1200px; background: #011"></section>
    <section appHomeSection="contacto" style="height: 1200px; background: #110"></section>
    <div style="height: 1200px"></div>
  `,
})
class SectionHostComponent {}

describe('HomeSectionDirective geometry', () => {
  let fixture: ComponentFixture<SectionHostComponent>;
  let service: HomeSectionObserverService;

  /** Deja al observador entregar sus callbacks, que llegan fuera del ciclo de deteccion. */
  const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 120));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHostComponent],
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();
    service = TestBed.inject(HomeSectionObserverService);
    fixture = TestBed.createComponent(SectionHostComponent);
    fixture.detectChanges();
    await settle();
  });

  afterEach(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });

  /**
   * Quien desplaza, que en esta pagina no es la ventana.
   *
   * El contenedor de pruebas deja el `body` con `overflow-y: auto`, asi que la propagacion al
   * viewport se cancela y es el `body` el que tiene el scroll. En la aplicacion real no lleva
   * ese estilo y desplaza la ventana, de ahi que aqui haga falta preguntarlo en vez de dar
   * `window.scrollTo` por hecho.
   */
  /**
   * `behavior: 'instant'` no es un detalle: el sitio declara `scroll-behavior: smooth` y eso
   * aplica tambien dentro del iframe donde corren las pruebas, asi que un `scrollTo` normal
   * anima y la asercion lee la posicion a mitad del viaje. Medido: pedir 2000 px devolvia 0 al
   * instante, 189 tras esperar y 1313 al segundo intento.
   */
  /**
   * Se recorre de a poco, no de un salto, y esto es lo que hace util la prueba.
   *
   * De un salto el navegador entrega la entrada con la seccion ya cruzando la banda, asi que
   * hasta el codigo roto acertaba: una primera version de esta prueba pasaba con el fallo
   * presente. Desplazandose de a poco la seccion entra en la banda con su borde superior por
   * debajo de la linea, que es el estado real en el que fallaba, y es como se desplaza una
   * persona.
   */
  const scrollTo = async (top: number): Promise<void> => {
    window.scrollTo({ top, behavior: 'instant' });
    await settle();
  };

  const activeWhileShowing = async (regionId: string): Promise<string | null> => {
    const section = fixture.nativeElement.querySelector(`[appHomeSection="${regionId}"]`) as HTMLElement;
    // se lleva el centro de la seccion al centro de la ventana: no hay duda de cual se mira
    const destino =
      window.scrollY + section.getBoundingClientRect().top + section.offsetHeight / 2 - window.innerHeight / 2;

    for (let y = window.scrollY; y < destino; y += 90) {
      await scrollTo(y);
    }
    await scrollTo(destino);

    return service.currentActiveFragment;
  };

  it('follows the section that fills the viewport, not the one before it', async () => {
    expect(await activeWhileShowing('casos')).toBe('casos');
    expect(await activeWhileShowing('contacto')).toBe('contacto');
    expect(await activeWhileShowing('inicio')).toBe('inicio');
  });

  /**
   * Una seccion mas alta que la banda observada tiene que activarse igual. Es exactamente el
   * caso que fallaba: todas las secciones de la Home lo son.
   */
  it('activates sections taller than the observed band', async () => {
    const section = fixture.nativeElement.querySelector('[appHomeSection="casos"]') as HTMLElement;
    expect(section.getBoundingClientRect().height).toBeGreaterThan(window.innerHeight);

    expect(await activeWhileShowing('casos')).toBe('casos');
  });
});
