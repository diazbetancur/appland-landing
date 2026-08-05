import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appHorizontalCarousel]',
  exportAs: 'appHorizontalCarousel',
})
export class HorizontalCarouselDirective implements AfterViewInit, OnDestroy {
  @Input() itemCount = 0;
  @Output() readonly positionChange = new EventEmitter<number>();

  currentIndex = 0;
  canMovePrevious = false;
  canMoveNext = false;
  private destroyed = false;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get positionLabel(): string {
    return this.itemCount ? `${this.currentIndex + 1} de ${this.itemCount}` : '';
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateState());
  }

  movePrevious(): void {
    this.move(-1);
  }

  moveNext(): void {
    this.move(1);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    this.move(event.key === 'ArrowLeft' ? -1 : 1);
  }

  @HostListener('scroll')
  @HostListener('window:resize')
  updateState(): void {
    if (this.destroyed) {
      return;
    }
    const element = this.elementRef.nativeElement;
    const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
    const step = this.cardStep();
    this.currentIndex = Math.min(
      Math.max(0, Math.round(element.scrollLeft / Math.max(step, 1))),
      Math.max(0, this.itemCount - 1)
    );
    this.canMovePrevious = element.scrollLeft > 2;
    this.canMoveNext = element.scrollLeft < maxScroll - 2;
    this.positionChange.emit(this.currentIndex);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.positionChange.complete();
  }

  private move(direction: -1 | 1): void {
    const element = this.elementRef.nativeElement;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({
      left: this.cardStep() * direction,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }

  private cardStep(): number {
    const element = this.elementRef.nativeElement;
    const firstCard = element.firstElementChild as HTMLElement | null;
    if (!firstCard) {
      return element.clientWidth;
    }
    const styles = getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
    return firstCard.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 0);
  }
}
