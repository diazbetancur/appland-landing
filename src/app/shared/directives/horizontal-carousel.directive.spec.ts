import { ElementRef } from '@angular/core';
import { HorizontalCarouselDirective } from './horizontal-carousel.directive';

describe('HorizontalCarouselDirective', () => {
  let element: HTMLElement;
  let directive: HorizontalCarouselDirective;
  let scrollBy: jasmine.Spy;

  beforeEach(() => {
    element = document.createElement('div');
    const card = document.createElement('article');
    element.appendChild(card);
    spyOn(card, 'getBoundingClientRect').and.returnValue({ width: 240 } as DOMRect);
    Object.defineProperties(element, {
      clientWidth: { configurable: true, value: 300 },
      scrollWidth: { configurable: true, value: 900 },
      scrollLeft: { configurable: true, writable: true, value: 0 },
    });
    scrollBy = spyOn(element, 'scrollBy');
    directive = new HorizontalCarouselDirective(new ElementRef(element));
    directive.itemCount = 3;
  });

  it('moves exactly one card step and has no autoplay timer', () => {
    directive.moveNext();
    expect(scrollBy).toHaveBeenCalledWith(jasmine.objectContaining({ left: 240 }));
    expect((directive as unknown as { timer?: unknown }).timer).toBeUndefined();
  });

  it('updates boundary and current-position state from native scrolling', () => {
    element.scrollLeft = 600;
    directive.updateState();
    expect(directive.currentIndex).toBe(2);
    expect(directive.positionLabel).toBe('3 de 3');
    expect(directive.canMovePrevious).toBeTrue();
    expect(directive.canMoveNext).toBeFalse();
  });

  it('supports arrow keys and prevents accidental page scrolling', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    spyOn(event, 'preventDefault').and.callThrough();
    directive.onKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(scrollBy).toHaveBeenCalled();
  });

  it('uses immediate movement when reduced motion is requested', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    directive.moveNext();
    expect(scrollBy).toHaveBeenCalledWith(jasmine.objectContaining({ behavior: 'auto' }));
  });

  it('completes its state output on destroy', () => {
    const complete = jasmine.createSpy('complete');
    directive.positionChange.subscribe({ complete });
    directive.ngOnDestroy();
    expect(complete).toHaveBeenCalled();
  });
});
