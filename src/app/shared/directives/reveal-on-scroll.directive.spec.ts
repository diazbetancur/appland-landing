import type { Mock } from 'vitest';
import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

describe('RevealOnScrollDirective', () => {
  const originalObserver = window.IntersectionObserver;
  // Doble parcial: solo los dos metodos que la directiva usa. El cast en cada
  // punto de uso hace explicito lo que jasmine.createSpyObj hacia implicitamente.
  let renderer: { addClass: Mock; removeClass: Mock };
  let element: HTMLElement;

  /**
   * La directiva paso a obtener sus dependencias con inject() en el spec 006, asi que ya no
   * acepta parametros de constructor. Se instancia dentro de un contexto de inyeccion, con
   * los dobles registrados como proveedores, conservando la intencion original de la prueba.
   */
  const createDirective = (): RevealOnScrollDirective =>
    TestBed.runInInjectionContext(() => new RevealOnScrollDirective());

  beforeEach(() => {
    renderer = {
      addClass: vi.fn().mockName('Renderer2.addClass'),
      removeClass: vi.fn().mockName('Renderer2.removeClass'),
    };
    element = document.createElement('section');
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: new ElementRef(element) },
        { provide: Renderer2, useValue: renderer as unknown as Renderer2 },
      ],
    });
  });

  afterEach(() => {
    (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver = originalObserver;
  });

  it('leaves content visible when the API is unavailable', () => {
    (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver = undefined;
    createDirective().ngAfterViewInit();
    expect(renderer.addClass).not.toHaveBeenCalled();
  });

  it('leaves content visible when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    createDirective().ngAfterViewInit();
    expect(renderer.addClass).not.toHaveBeenCalled();
  });

  it('enhances supported content and reveals it when intersecting', () => {
    let callback!: IntersectionObserverCallback;
    const disconnect = vi.fn();
    class ObserverStub {
      constructor(received: IntersectionObserverCallback) {
        callback = received;
      }
      observe = vi.fn();
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin = '';
      thresholds = [];
    }
    (
      window as unknown as {
        IntersectionObserver: typeof IntersectionObserver;
      }
    ).IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver;
    const directive = createDirective();
    directive.ngAfterViewInit();
    expect(renderer.addClass).toHaveBeenCalledWith(element, 'appland-reveal-pending');
    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(renderer.removeClass).toHaveBeenCalledWith(element, 'appland-reveal-pending');
    expect(renderer.addClass).toHaveBeenCalledWith(element, 'appland-revealed');
    expect(disconnect).toHaveBeenCalled();
  });
});
