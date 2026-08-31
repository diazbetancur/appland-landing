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
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 },
    );
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.sectionObserver.unregisterRegion(this.regionId);
  }
}
