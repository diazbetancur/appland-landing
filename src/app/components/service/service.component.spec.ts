import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ServiceComponent } from './service.component';
import { ServiceDescription } from './card-template/card-template';

describe('ServiceComponent regression smoke', () => {
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [ServiceComponent],
      providers: [provideTranslateService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ServiceComponent);
    fixture.detectChanges();
  });

  it('still instantiates its existing internal page', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.services).toEqual([]);
  });

  it('keeps a non-array translation from reaching the card list', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', { ourServiceDescription: 'not an array' });
    translate.use('es');

    const rendered = TestBed.createComponent(ServiceComponent);
    rendered.detectChanges();

    expect(rendered.componentInstance.services).toEqual([]);
  });

  it('exposes translated descriptions with the four fields the card template consumes', () => {
    // Sin anotar el literal: ngx-translate exige un tipo con indice de string, y una
    // interface no lo recibe implicitamente. La anotacion vive en `expected`, que sigue
    // rompiendo la compilacion si ServiceDescription cambia de forma.
    const entry = {
      key: 'develop',
      image: 'develop.png',
      title: 'Desarrollo:',
      description: 'Creamos soluciones digitales a medida.',
    };
    const expected: ServiceDescription = entry;

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', { ourServiceDescription: [entry] });
    translate.use('es');

    const rendered = TestBed.createComponent(ServiceComponent);
    rendered.detectChanges();

    expect(rendered.componentInstance.services).toEqual([expected]);
    expect(Object.keys(rendered.componentInstance.services[0]).sort()).toEqual([
      'description',
      'image',
      'key',
      'title',
    ]);
  });
});
