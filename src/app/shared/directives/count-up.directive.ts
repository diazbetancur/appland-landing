import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective implements OnInit {
  @Input() endValue: number = 0;
  @Input() duration: number = 2000; // en milisegundos
  @Input() suffix: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCount();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(this.el.nativeElement);
  }

  private animateCount(): void {
    const startTime = performance.now();
    const startValue = 0;
    const endValue = this.endValue;
    const duration = this.duration;

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentValue = Math.floor(
        progress * (endValue - startValue) + startValue
      );
      this.renderer.setProperty(
        this.el.nativeElement,
        'textContent',
        `${currentValue}${this.suffix}`
      );
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
