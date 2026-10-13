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
      'por-que-appland',
      'por-que-appland',
      'contacto',
      'servicios',
      'contacto',
    ]);
  });

  it('activates the registered region that takes up the most of the screen', fakeAsync(() => {
    router.navigateByUrl('/');
    tick();
    service.registerRegion('desafios');
    service.registerRegion('casos');
    service.notifyRegionVisibility('desafios', 600);
    service.notifyRegionVisibility('casos', 200);
    expect(service.currentActiveFragment).toBe('servicios');

    // la de abajo pasa a ocupar mas: cambia aunque la de arriba siga a la vista
    service.notifyRegionVisibility('desafios', 390);
    service.notifyRegionVisibility('casos', 410);
    expect(service.currentActiveFragment).toBe('casos');

    // y vuelve si se sube
    service.notifyRegionVisibility('desafios', 500);
    expect(service.currentActiveFragment).toBe('servicios');
  }));

  it('keeps the last active region while nothing registered is on screen', fakeAsync(() => {
    router.navigateByUrl('/');
    tick();
    service.registerRegion('casos');
    service.notifyRegionVisibility('casos', 300);
    service.notifyRegionVisibility('casos', 0);
    expect(service.currentActiveFragment).toBe('casos');
  }));

  it('forgets an unregistered region so it cannot win anymore', fakeAsync(() => {
    router.navigateByUrl('/');
    tick();
    service.registerRegion('desafios');
    service.registerRegion('casos');
    service.notifyRegionVisibility('casos', 700);
    service.notifyRegionVisibility('desafios', 100);
    service.unregisterRegion('casos');
    service.notifyRegionVisibility('desafios', 100);
    expect(service.currentActiveFragment).toBe('servicios');
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
      service.notifyRegionVisibility('footer', 400);
      expect(service.currentActiveFragment).toBeNull();
    }));
  });
});
