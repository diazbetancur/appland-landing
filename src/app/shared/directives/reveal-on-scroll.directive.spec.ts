import { ElementRef, Renderer2 } from '@angular/core';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

describe('RevealOnScrollDirective', () => {
  const originalObserver = window.IntersectionObserver;
  let renderer: jasmine.SpyObj<Renderer2>;
  let element: HTMLElement;

  beforeEach(() => {
    renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass', 'removeClass']);
    element = document.createElement('section');
  });

  afterEach(() => {
    (window as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver = originalObserver;
  });

  it('leaves content visible when the API is unavailable', () => {
    (window as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver = undefined;
    new RevealOnScrollDirective(new ElementRef(element), renderer).ngAfterViewInit();
    expect(renderer.addClass).not.toHaveBeenCalled();
  });

  it('leaves content visible when reduced motion is requested', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    new RevealOnScrollDirective(new ElementRef(element), renderer).ngAfterViewInit();
    expect(renderer.addClass).not.toHaveBeenCalled();
  });

  it('enhances supported content and reveals it when intersecting', () => {
    let callback!: IntersectionObserverCallback;
    const disconnect = jasmine.createSpy('disconnect');
    class ObserverStub {
      constructor(received: IntersectionObserverCallback) { callback = received; }
      observe = jasmine.createSpy('observe');
      disconnect = disconnect;
      unobserve = jasmine.createSpy('unobserve');
      takeRecords = () => [];
      root = null;
      rootMargin = '';
      thresholds = [];
    }
    (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver;
    const directive = new RevealOnScrollDirective(new ElementRef(element), renderer);
    directive.ngAfterViewInit();
    expect(renderer.addClass).toHaveBeenCalledWith(element, 'appland-reveal-pending');
    callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(renderer.removeClass).toHaveBeenCalledWith(element, 'appland-reveal-pending');
    expect(renderer.addClass).toHaveBeenCalledWith(element, 'appland-revealed');
    expect(disconnect).toHaveBeenCalled();
  });
});
