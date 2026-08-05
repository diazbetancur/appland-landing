import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({ selector: '[appRevealOnScroll]' })
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const element = this.elementRef.nativeElement;
    this.renderer.addClass(element, 'appland-reveal-pending');
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        this.renderer.removeClass(element, 'appland-reveal-pending');
        this.renderer.addClass(element, 'appland-revealed');
        this.observer?.disconnect();
        this.observer = undefined;
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
