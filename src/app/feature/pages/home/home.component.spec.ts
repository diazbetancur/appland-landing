import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [HomeComponent],
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
    expect(fixture.debugElement.query(By.css('app-service'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-choose-us'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-our-team'))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('100K');
  });
});
