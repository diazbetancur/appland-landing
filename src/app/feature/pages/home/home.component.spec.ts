import { CommonModule } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    // Al pasar a standalone, HomeComponent importa sus doce hijos reales en vez de
    // apoyarse en las declaraciones de un NgModule. Varios de esos hijos usan routerLink
    // y el pipe translate, asi que ahora se instancian de verdad y exigen sus proveedores.
    // Antes NO_ERRORS_SCHEMA los ignoraba como atributos desconocidos.
    await TestBed.configureTestingModule({
      imports: [CommonModule, HomeComponent],
      providers: [provideRouter([]), provideLocationMocks(), provideTranslateService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('renders the final applicable regions in approved relative order', () => {
    const ids = fixture.debugElement.queryAll(By.css('section')).map((section) => section.attributes['id']);
    expect(ids).toEqual([
      'inicio',
      'clientes',
      'desafios',
      'servicios',
      'casos',
      'ia',
      'por-que-appland',
      'equipo-global',
      'contacto',
    ]);
  });

  it('renders clients now that logos are approved, but fully omits products while none is approved', () => {
    expect(fixture.debugElement.query(By.css('#clientes'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#productos'))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('pendiente');
  });

  it('does not render the inherited Home composition or metrics', () => {
    // Este caso protegia tambien la ausencia de app-choose-us y app-our-team. El spec 005
    // elimino esos componentes del proyecto por estar muertos, asi que asserear su ausencia
    // dejo de poder fallar. Las dos aserciones se retiraron en vez de conservarse vacuas.
    // app-service sigue existiendo, propiedad de la ruta /service, asi que su ausencia en la
    // Home si sigue siendo una condicion verificable.
    expect(fixture.debugElement.query(By.css('app-service'))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('100K');
  });
});
