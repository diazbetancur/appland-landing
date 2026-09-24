import { page } from 'vitest/browser';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { A11yModule } from '@angular/cdk/a11y';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeSectionObserverService } from '../../shared/services/home-section-observer.service';
import { MenuComponent } from './menu.component';
import { provideTranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

@Component({
  template: '',
  imports: [A11yModule],
})
class MenuRouteStubComponent {}

describe('MenuComponent navigation', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let service: HomeSectionObserverService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        A11yModule,
        RouterTestingModule.withRoutes([
          { path: '', component: MenuRouteStubComponent },
          { path: 'about', component: MenuRouteStubComponent },
          { path: 'service', component: MenuRouteStubComponent },
        ]),
        MenuComponent,
        MenuRouteStubComponent,
      ],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    router = TestBed.inject(Router);
    service = TestBed.inject(HomeSectionObserverService);
    fixture = TestBed.createComponent(MenuComponent);
    fixture.componentRef.setInput('items', HOME_CONTENT.navigation);
    fixture.componentRef.setInput('meetingAction', HOME_CONTENT.hero.primaryAction);
    fixture.detectChanges();
  });

  it('renders the five Spanish root-fragment links with Nosotros mapped to por-que-appland', () => {
    const links = fixture.debugElement.queryAll(By.css('.menu__desktop-links a'));
    expect(links.map((link) => link.nativeElement.textContent.trim())).toEqual([
      'Inicio',
      'Servicios',
      'Proyectos',
      'Nosotros',
      'Contacto',
    ]);
    expect(links[3].attributes['href']).toContain('#por-que-appland');
    expect(fixture.debugElement.query(By.css('[data-en]'))).toBeNull();
    // Aqui habia una asercion de que el menu no contuviera "EN", guardia contra la interfaz de
    // idioma de la maqueta, que no estaba aprobada. El usuario la aprobo el 2026-09-21 y ahora
    // existe: lo que ese selector debe cumplir lo fija menu-language.spec.ts.
  });

  it('shows exactly one matching visual and aria-current state on Home', fakeAsync(() => {
    router.navigateByUrl('/');
    tick();
    service.registerRegion('casos');
    service.notifyRegionVisibility('casos', true);
    fixture.detectChanges();
    const active = fixture.debugElement.queryAll(By.css('.menu__desktop-links [aria-current="location"]'));
    expect(active.length).toBe(1);
    expect(active[0].nativeElement.textContent.trim()).toBe('Proyectos');
    expect(active[0].classes['menu__link--active']).toBe(true);

    fixture.componentInstance.openMenu();
    fixture.detectChanges();
    const openMenuActive = fixture.debugElement.queryAll(By.css('[aria-current="location"]'));
    expect(openMenuActive.length).toBe(1);
    expect(openMenuActive[0].classes['compact-menu__link--active']).toBe(true);
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
  /**
   * Las etiquetas del menu no se parten por la mitad.
   *
   * `.menu__link` no fijaba `white-space`, asi que cuando el espacio horizontal apretaba el
   * navegador partia el texto donde cupiera: a 1024 "Casos de exito" caia en tres renglones
   * dentro de una barra de 84 px de alto y quedaba ilegible. Estaba latente desde antes, y lo
   * destapo el boton de conversion al pasar de "Agendar una reunion" a "Conversemos sobre tu
   * proyecto", que ocupa 68 px mas.
   *
   * Acortar el boton habria escondido el fallo en vez de arreglarlo: la barra seguiria
   * partiendo la siguiente etiqueta que creciera, en este idioma o en ingles.
   *
   * Se mide a 1024, que es el ancho mas estrecho en el que la barra de escritorio se pinta:
   * un pixel menos y manda el boton compacto.
   */
  it('never breaks a navigation label across lines at the narrowest desktop width', async () => {
    await page.viewport(1024, 800);

    const links = fixture.debugElement.queryAll(By.css('.menu__link'));
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      const range = document.createRange();
      range.selectNodeContents(link.nativeElement);
      const renglones = range.getClientRects().length;
      expect(renglones, `"${link.nativeElement.textContent.trim()}" se parte en ${renglones} renglones`).toBe(1);
    }

    await page.viewport(414, 896);
  });

  /**
   * Nada de la barra se sale por el filo.
   *
   * La prueba de arriba impide que una etiqueta se parta, pero no que el contenido desborde: al
   * pasar el boton de conversion de "Agendar una reunion" a "Conversemos sobre tu proyecto" la
   * barra crecio 68 px y empujo el selector de idioma fuera del contenedor, 81 px a 1024. Toda
   * la suite seguia en verde porque ninguna prueba miraba la geometria de la barra.
   *
   * Por eso el boton del encabezado usa la etiqueta corta y el texto completo vive en el hero,
   * la seccion de contacto y el dialogo del menu, que si tienen sitio.
   *
   * Se mide a 1024, el ancho mas estrecho en el que la barra de escritorio se pinta.
   */
  it('keeps every desktop header control inside the bar at the narrowest desktop width', async () => {
    await page.viewport(1024, 800);

    const inner = fixture.debugElement.query(By.css('.menu__inner')).nativeElement.getBoundingClientRect();
    const controles = ['.menu__brand', '.menu__desktop-links', '.menu__meeting--desktop', '.menu__language--desktop'];

    for (const selector of controles) {
      const elemento = fixture.debugElement.query(By.css(selector));
      expect(elemento, `no se encontro ${selector}`).not.toBeNull();

      const caja = elemento.nativeElement.getBoundingClientRect();
      expect(Math.round(caja.right), `${selector} se sale por la derecha`).toBeLessThanOrEqual(Math.round(inner.right));
      expect(Math.round(caja.left), `${selector} se sale por la izquierda`).toBeGreaterThanOrEqual(
        Math.round(inner.left),
      );
    }

    await page.viewport(414, 896);
  });
});
