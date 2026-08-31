import type { Mock } from 'vitest';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HorizontalCarouselDirective } from './horizontal-carousel.directive';

describe('HorizontalCarouselDirective', () => {
  let element: HTMLElement;
  let directive: HorizontalCarouselDirective;
  let scrollBy: Mock;

  beforeEach(() => {
    element = document.createElement('div');
    const card = document.createElement('article');
    element.appendChild(card);
    vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({ width: 240 } as DOMRect);
    Object.defineProperties(element, {
      clientWidth: { configurable: true, value: 300 },
      scrollWidth: { configurable: true, value: 900 },
      scrollLeft: { configurable: true, writable: true, value: 0 },
    });
    scrollBy = vi.spyOn(element, 'scrollBy');
    // La directiva obtiene ElementRef con inject() desde el spec 006, asi que se instancia
    // dentro de un contexto de inyeccion con el elemento de prueba como proveedor.
    TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: new ElementRef(element) }],
    });
    directive = TestBed.runInInjectionContext(() => new HorizontalCarouselDirective());
    directive.itemCount = 3;
  });

  it('moves exactly one card step and has no autoplay timer', () => {
    directive.moveNext();
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 240 }));
    expect(
      (
        directive as unknown as {
          timer?: unknown;
        }
      ).timer,
    ).toBeUndefined();
  });

  it('updates boundary and current-position state from native scrolling', () => {
    element.scrollLeft = 600;
    directive.updateState();
    expect(directive.currentIndex).toBe(2);
    expect(directive.positionLabel).toBe('3 de 3');
    expect(directive.canMovePrevious).toBe(true);
    expect(directive.canMoveNext).toBe(false);
  });

  it('supports arrow keys and prevents accidental page scrolling', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    vi.spyOn(event, 'preventDefault');
    directive.onKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(scrollBy).toHaveBeenCalled();
  });

  it('uses immediate movement when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    directive.moveNext();
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
  });

  it('completes its state output on destroy', () => {
    const complete = vi.fn();
    directive.positionChange.subscribe({ complete });
    directive.ngOnDestroy();
    expect(complete).toHaveBeenCalled();
  });
});
