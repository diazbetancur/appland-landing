import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { ObservedRegionId } from '../../feature/pages/home/home-content.models';
import { HomeSectionObserverService } from '../services/home-section-observer.service';

@Directive({
    selector: '[appHomeSection]',
    standalone: false
})
export class HomeSectionDirective implements AfterViewInit, OnDestroy {
  @Input('appHomeSection') regionId!: ObservedRegionId;

  private observer?: IntersectionObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly sectionObserver: HomeSectionObserverService
  ) {}

  ngAfterViewInit(): void {
    this.sectionObserver.registerRegion(this.regionId);
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const crossesLine =
            entry.isIntersecting &&
            entry.boundingClientRect.top <= this.sectionObserver.activationThresholdPx &&
            entry.boundingClientRect.bottom > this.sectionObserver.activationThresholdPx;
          this.sectionObserver.notifyRegionVisibility(this.regionId, crossesLine);
        }
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 }
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sectionObserver.unregisterRegion(this.regionId);
  }
}
