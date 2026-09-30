import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { ObservedRegionId } from '../../feature/pages/home/home-content.models';
import { HomeSectionObserverService } from '../services/home-section-observer.service';

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
     * La raiz se estrecha hasta dejar una linea, asi que intersectarla es cruzarla.
     *
     * Antes la banda medía unos 130 px y la condicion se comprobaba a mano comparando `top` y
     * `bottom` contra la linea. Esa comprobacion no se cumplia nunca: con `threshold: 0` el
     * observador solo avisa al entrar y al salir de la banda, y una seccion mas alta que ella
     * entra con el borde superior por debajo de la linea y sale con el inferior por encima.
     * Nunca hay un aviso en el instante en que la cruza, que era el unico que la activaba.
     *
     * Con una linea, los dos avisos que interesan llegan solos: uno con `isIntersecting` en
     * falso para la seccion que deja de cruzarla y otro en cierto para la que empieza.
     */
    const { activationLinePercent: line, activationBandPercent: band } = this.sectionObserver;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.sectionObserver.notifyRegionVisibility(this.regionId, entry.isIntersecting);
        }
      },
      { rootMargin: `-${line}% 0px -${100 - line - band}% 0px`, threshold: 0 },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sectionObserver.unregisterRegion(this.regionId);
  }
}
