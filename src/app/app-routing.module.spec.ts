import { TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ROUTER_CONFIGURATION, Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/about/about.component';
import { ServiceComponent } from './components/service/service.component';
import { HomeComponent } from './feature/pages/home/home.component';

/**
 * Estas pruebas importan el AppRoutingModule real a proposito.
 *
 * La version anterior construia RouterTestingModule.withRoutes([...]) con una copia
 * escrita a mano de las tres rutas y asserteaba contra esa copia, asi que pasaba aunque
 * app-routing.module.ts se borrara. Era la unica cobertura de routing del proyecto.
 */
describe('Application routing contract', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      providers: [provideLocationMocks()],
    });
  });

  it('preserves only the existing Home, About and Service route ownership', () => {
    const routes = TestBed.inject(Router).config;

    expect(routes.map((route) => route.path)).toEqual(['', 'about', 'service']);
    expect(routes[0].component).toBe(HomeComponent);
    expect(routes[1].component).toBe(AboutComponent);
    expect(routes[2].component).toBe(ServiceComponent);
  });

  /**
   * Guardias de la configuracion de scroll.
   *
   * Las tres opciones son lo que hace que la navegacion a secciones de la Home funcione, y
   * viven solo en app-routing.module.ts. El spec 006 convierte RouterModule.forRoot en
   * provideRouter, y sin estas pruebas esa conversion podria descartarlas en silencio.
   *
   * Se leen desde ROUTER_CONFIGURATION, que es el token donde el router guarda sus
   * ExtraOptions efectivas, en vez de reproducir los valores esperados en el propio test.
   */
  describe('scroll configuration', () => {
    it('keeps anchor scrolling enabled so fragment navigation reaches the section', () => {
      expect(TestBed.inject(ROUTER_CONFIGURATION).anchorScrolling).toBe('enabled');
    });

    it('keeps scroll position restoration enabled so back navigation returns to place', () => {
      expect(TestBed.inject(ROUTER_CONFIGURATION).scrollPositionRestoration).toBe('enabled');
    });

    it('keeps the fixed header offset so section anchors do not land under the header', () => {
      expect(TestBed.inject(ROUTER_CONFIGURATION).scrollOffset).toEqual([0, 104]);
    });
  });
});
