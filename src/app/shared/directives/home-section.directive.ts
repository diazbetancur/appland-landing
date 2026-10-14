import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { ObservedRegionId } from '../../feature/pages/home/home-content.models';
import { HomeSectionObserverService } from '../services/home-section-observer.service';

/** De 0 a 1 en pasos de 0.01. */
const VISIBILITY_THRESHOLDS = Array.from({ length: 101 }, (_, step) => step / 100);

@Directive({ selector: '[appHomeSection]' })
export class HomeSectionDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sectionObserver = inject(HomeSectionObserverService);

  @Input('appHomeSection') regionId!: ObservedRegionId;

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.sectionObserver.registerRegion(this.regionId);
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    /**
     * Se informa cuanto alto se ve de la seccion y el servicio elige la que mas ocupa.
     *
     * Los umbrales van de 1% en 1% para que el aviso llegue mientras la seccion se desplaza y no
     * solo al entrar y salir: con `threshold: 0` el observador callaba todo el tramo intermedio,
     * que es justo donde una seccion pasa a ocupar la mayor parte de la pantalla. La barra fija
     * se descuenta con el margen superior, porque lo que queda debajo de ella no se ve.
     */
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--appland-header-height'));

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.sectionObserver.notifyRegionVisibility(
            this.regionId,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }
      },
      { rootMargin: `-${header || 0}px 0px 0px 0px`, threshold: VISIBILITY_THRESHOLDS },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sectionObserver.unregisterRegion(this.regionId);
  }
}
