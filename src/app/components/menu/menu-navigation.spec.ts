import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { A11yModule } from '@angular/cdk/a11y';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeSectionObserverService } from '../../shared/services/home-section-observer.service';
import { MenuComponent } from './menu.component';

@Component({
    template: '',
    standalone: false
})
class MenuRouteStubComponent {}

describe('MenuComponent navigation', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let service: HomeSectionObserverService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A11yModule, RouterTestingModule.withRoutes([
        { path: '', component: MenuRouteStubComponent },
        { path: 'about', component: MenuRouteStubComponent },
        { path: 'service', component: MenuRouteStubComponent },
      ])],
      declarations: [MenuComponent, MenuRouteStubComponent],
    }).compileComponents();
    router = TestBed.inject(Router);
    service = TestBed.inject(HomeSectionObserverService);
    fixture = TestBed.createComponent(MenuComponent);
    fixture.componentRef.setInput('items', HOME_CONTENT.navigation);
    fixture.componentRef.setInput('meetingAction', HOME_CONTENT.hero.primaryAction);
    fixture.detectChanges();
  });

  it('renders the five Spanish root-fragment links with Nosotros mapped to por-que-appland', () => {
    const links = fixture.debugElement.queryAll(By.css('.menu__desktop-links a'));
    expect(links.map((link) => link.nativeElement.textContent.trim())).toEqual(
      ['Inicio', 'Servicios', 'Casos de éxito', 'Nosotros', 'Contacto']
    );
    expect(links[3].attributes['href']).toContain('#por-que-appland');
    expect(fixture.debugElement.query(By.css('[data-en]'))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('EN');
  });

  it('shows exactly one matching visual and aria-current state on Home', fakeAsync(() => {
    router.navigateByUrl('/');
    tick();
    service.registerRegion('casos');
    service.notifyRegionVisibility('casos', true);
    fixture.detectChanges();
    const active = fixture.debugElement.queryAll(By.css('.menu__desktop-links [aria-current="location"]'));
    expect(active.length).toBe(1);
    expect(active[0].nativeElement.textContent.trim()).toBe('Casos de éxito');
    expect(active[0].classes['menu__link--active']).toBeTrue();

    fixture.componentInstance.openMenu();
    fixture.detectChanges();
    const openMenuActive = fixture.debugElement.queryAll(By.css('[aria-current="location"]'));
    expect(openMenuActive.length).toBe(1);
    expect(openMenuActive[0].classes['compact-menu__link--active']).toBeTrue();
  }));

  ['/about', '/service'].forEach((url) => {
    it(`removes every fragment-derived aria-current on ${url}`, fakeAsync(() => {
      service.registerRegion('footer');
      service.notifyRegionVisibility('footer', true);
      router.navigateByUrl(url);
      tick();
      service.notifyRegionVisibility('footer', true);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('[aria-current="location"]')).length).toBe(0);
    }));
  });
});
