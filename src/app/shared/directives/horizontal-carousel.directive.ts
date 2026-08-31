import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appHorizontalCarousel]',
  exportAs: 'appHorizontalCarousel',
})
export class HorizontalCarouselDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() itemCount = 0;

  /**
   * Recorrido circular: desde la ultima tarjeta, avanzar vuelve a la primera, y desde la
   * primera, retroceder lleva a la ultima. Con el activado los controles no se deshabilitan
   * en los extremos, porque dejan de existir extremos desde los que no se pueda seguir.
   */
  @Input() loop = false;

  @Output() readonly positionChange = new EventEmitter<number>();

  currentIndex = 0;
  canMovePrevious = false;
  canMoveNext = false;

  /** Extremos reales del scroll, al margen de lo que `loop` deje pulsable. */
  private atStart = true;
  private atEnd = false;
  private destroyed = false;

  get positionLabel(): string {
    return this.itemCount ? `${this.currentIndex + 1} de ${this.itemCount}` : '';
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateState());
  }

  movePrevious(): void {
    if (this.loop && this.atStart) {
      this.jumpTo(this.maxScroll());
      return;
    }
    this.move(-1);
  }

  moveNext(): void {
    if (this.loop && this.atEnd) {
      this.jumpTo(0);
      return;
    }
    this.move(1);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    if (event.key === 'ArrowLeft') {
      this.movePrevious();
    } else {
      this.moveNext();
    }
  }

  @HostListener('scroll')
  @HostListener('window:resize')
  updateState(): void {
    if (this.destroyed) {
      return;
    }
    const element = this.elementRef.nativeElement;
    const maxScroll = this.maxScroll();
    const step = this.cardStep();
    this.currentIndex = Math.min(
      Math.max(0, Math.round(element.scrollLeft / Math.max(step, 1))),
      Math.max(0, this.itemCount - 1),
    );
    this.atStart = element.scrollLeft <= 2;
    this.atEnd = element.scrollLeft >= maxScroll - 2;
    this.canMovePrevious = this.loop || !this.atStart;
    this.canMoveNext = this.loop || !this.atEnd;
    this.positionChange.emit(this.currentIndex);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.positionChange.complete();
  }

  private move(direction: -1 | 1): void {
    const element = this.elementRef.nativeElement;
    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({
      left: this.cardStep() * direction,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }

  /**
   * El salto circular es instantaneo a proposito. Con desplazamiento suave, volver de la
   * ultima tarjeta a la primera recorreria todo el track hacia atras a la vista, que es
   * mareante; el paso normal entre tarjetas si conserva la animacion.
   */
  private jumpTo(left: number): void {
    this.elementRef.nativeElement.scrollTo({ left, behavior: 'auto' });
    this.updateState();
  }

  private maxScroll(): number {
    const element = this.elementRef.nativeElement;
    return Math.max(0, element.scrollWidth - element.clientWidth);
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
