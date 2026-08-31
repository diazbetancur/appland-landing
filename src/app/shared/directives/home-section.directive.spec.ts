import { ElementRef } from '@angular/core';
import { HomeSectionDirective } from './home-section.directive';
import { HomeSectionObserverService } from '../services/home-section-observer.service';

describe('HomeSectionDirective', () => {
  it('registers and unregisters safely when IntersectionObserver is unavailable', () => {
    const service = jasmine.createSpyObj<HomeSectionObserverService>(
      'HomeSectionObserverService',
      ['registerRegion', 'unregisterRegion', 'notifyRegionVisibility'],
      { activationThresholdPx: 140 },
    );
    const directive = new HomeSectionDirective(new ElementRef(document.createElement('section')), service);
    directive.regionId = 'inicio';
    const originalObserver = window.IntersectionObserver;
    (window as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver = undefined;
    directive.ngAfterViewInit();
    directive.ngOnDestroy();
    (window as unknown as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver =
      originalObserver;
    expect(service.registerRegion).toHaveBeenCalledWith('inicio');
    expect(service.unregisterRegion).toHaveBeenCalledWith('inicio');
  });
});
