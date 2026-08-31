import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_SECTION_IDS, ObservedRegionId } from '../../feature/pages/home/home-content.models';
import { HomeSectionObserverService, mapObservedRegionToNavigationFragment } from './home-section-observer.service';

@Component({ template: '' })
class RouteStubComponent {}

describe('HomeSectionObserverService', () => {
  let service: HomeSectionObserverService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: RouteStubComponent },
          { path: 'about', component: RouteStubComponent },
          { path: 'service', component: RouteStubComponent },
        ]),
        RouteStubComponent,
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(HomeSectionObserverService);
  });

  it('maps all ten Home regions plus footer to an approved header fragment', () => {
    const regions: readonly ObservedRegionId[] = [...HOME_SECTION_IDS, 'footer'];
    expect(regions.map(mapObservedRegionToNavigationFragment)).toEqual([
      'inicio',
      'inicio',
      'servicios',
      'servicios',
      'casos',
      'servicios',
      'servicios',
      'por-que-appland',
      'por-que-appland',
      'contacto',
      'contacto',
    ]);
    expect(service.activationThresholdPx).toBe(140);
  });

  it('keeps only the most recently crossing registered region active on Home', fakeAsync(() => {
    router.navigateByUrl('/');
    tick();
    service.registerRegion('desafios');
    service.registerRegion('casos');
    service.notifyRegionVisibility('desafios', true);
    expect(service.currentActiveFragment).toBe('servicios');
    service.notifyRegionVisibility('casos', true);
    expect(service.currentActiveFragment).toBe('casos');
  }));

  ['/about', '/service'].forEach((url) => {
    it(`clears fragment active state on ${url} and ignores the footer`, fakeAsync(() => {
      router.navigateByUrl('/#casos');
      tick();
      expect(service.currentActiveFragment).toBe('casos');
      service.registerRegion('footer');
      router.navigateByUrl(url);
      tick();
      expect(service.currentActiveFragment).toBeNull();
      service.notifyRegionVisibility('footer', true);
      expect(service.currentActiveFragment).toBeNull();
    }));
  });
});
