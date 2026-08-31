import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HomeSectionDirective } from './home-section.directive';
import { HomeSectionObserverService } from '../services/home-section-observer.service';

describe('HomeSectionDirective', () => {
  it('registers and unregisters safely when IntersectionObserver is unavailable', () => {
    const service = {
      registerRegion: vi.fn().mockName('HomeSectionObserverService.registerRegion'),
      unregisterRegion: vi.fn().mockName('HomeSectionObserverService.unregisterRegion'),
      notifyRegionVisibility: vi.fn().mockName('HomeSectionObserverService.notifyRegionVisibility'),
      activationThresholdPx: 140,
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
