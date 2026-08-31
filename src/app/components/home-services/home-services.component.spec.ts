import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HOME_CONTENT, SERVICE_QUERY_PARAM } from '../../feature/pages/home/home-content.config';
import { HomeServicesComponent } from './home-services.component';

describe('HomeServicesComponent', () => {
  let fixture: ComponentFixture<HomeServicesComponent>;
  let component: HomeServicesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeServicesComponent],
      // El componente lee el parametro de consulta que selecciona la pestana, asi que
      // necesita un router desde el spec 006 en adelante.
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeServicesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('services', HOME_CONTENT.services);
    fixture.detectChanges();
  });

  it('renders five related tabs and one selected panel', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabs.length).toBe(5);
    expect(tabs.filter((tab) => tab.attributes['aria-selected'] === 'true').length).toBe(1);
    const panel = fixture.debugElement.query(By.css('[role="tabpanel"]'));
    expect(panel.attributes['aria-labelledby']).toBe(tabs[0].attributes['id']);
    expect(tabs[0].attributes['aria-controls']).toBe(panel.attributes['id']);
  });

  it('keeps the panel visual decorative and hidden from assistive tech', () => {
    expect(fixture.debugElement.query(By.css('.services__visual')).attributes['aria-hidden']).toBe('true');
    const img = fixture.debugElement.query(By.css('.services__visual img'));
    expect(img.attributes['src']).toContain(HOME_CONTENT.services[0].media!.src);
    expect(img.attributes['alt']).toBe('');
  });

  it('swaps the panel visual and highlights when another service is selected', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    tabs[1].triggerEventHandler('click');
    fixture.detectChanges();
    const service = HOME_CONTENT.services[1];
    expect(fixture.debugElement.query(By.css('.services__visual img')).attributes['src']).toContain(service.media!.src);
    const labels = fixture.debugElement
      .queryAll(By.css('.services__highlight-label'))
      .map((node) => node.nativeElement.textContent.trim());
    expect(labels).toEqual(service.highlights!.map((highlight) => highlight.label));
  });

  /**
   * Guardia contra capacidades inventadas en los iconos.
   *
   * La version original de esta prueba exigia que la etiqueta de cada icono apareciera
   * dentro del resumen del servicio, usando el resumen como fuente de verdad. Ese mecanismo
   * dejo de ser viable cuando los resumenes pasaron a ser propuestas de valor en vez de
   * enumeraciones de capacidades, precisamente para no repetir lo que los iconos ya dicen.
   *
   * El proposito se conserva anclando las etiquetas aprobadas aqui: nadie puede anadir,
   * quitar ni renombrar una capacidad sin editar esta lista a proposito, que es exactamente
   * la barrera que el guardia original buscaba.
   */
  const APPROVED_HIGHLIGHTS: Readonly<Record<string, readonly string[]>> = {
    software: ['Apps móviles', 'Plataformas web', 'Sistemas empresariales'],
    'artificial-intelligence': ['Agentes IA', 'Automatización', 'Asistentes de voz', 'Asistentes de chat'],
    'staff-augmentation': ['Desarrolladores', 'QA', 'UX/UI', 'Equipos dedicados'],
    'process-automation': ['Optimización operativa', 'IA aplicada', 'Integraciones'],
    'technology-consulting': ['Transformación digital', 'Arquitectura tecnológica'],
  };

  it('exposes only approved capability labels on the service icons', () => {
    expect(HOME_CONTENT.services.map((service) => service.id).sort()).toEqual(Object.keys(APPROVED_HIGHLIGHTS).sort());

    HOME_CONTENT.services.forEach((service) => {
      expect(service.highlights?.map((highlight) => highlight.label)).toEqual(APPROVED_HIGHLIGHTS[service.id]);
    });
  });

  it('selects by click with a non-color active treatment', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    tabs[2].triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[2].id);
    expect(tabs[2].classes['services__tab--active']).toBe(true);
    expect(tabs[2].attributes['tabindex']).toBe('0');
  });

  it('supports ArrowLeft, ArrowRight, Home and End roving activation', () => {
    const preventDefault = vi.fn();
    component.onTabKeydown({ key: 'End', preventDefault } as unknown as KeyboardEvent, 0);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[4].id);
    component.onTabKeydown({ key: 'Home', preventDefault } as unknown as KeyboardEvent, 4);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[0].id);
    component.onTabKeydown({ key: 'ArrowLeft', preventDefault } as unknown as KeyboardEvent, 0);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[4].id);
    component.onTabKeydown({ key: 'ArrowRight', preventDefault } as unknown as KeyboardEvent, 4);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[0].id);
    expect(preventDefault).toHaveBeenCalledTimes(4);
  });

  it('opens the service requested through the URL instead of defaulting to the first one', async () => {
    // Los enlaces del pie de pagina llevaban a la seccion generica porque el fragmento no
    // puede identificar una pestana. Esta prueba fija que el parametro si la selecciona.
    const requestedId = HOME_CONTENT.services[2].id;
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HomeServicesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ [SERVICE_QUERY_PARAM]: requestedId })) },
        },
      ],
    }).compileComponents();

    const requested = TestBed.createComponent(HomeServicesComponent);
    requested.componentRef.setInput('services', HOME_CONTENT.services);
    requested.detectChanges();

    expect(requested.componentInstance.activeServiceId).toBe(requestedId);
    expect(requestedId).not.toBe(HOME_CONTENT.services[0].id);
  });

  it('lets a manual tab selection win over the service requested in the URL', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HomeServicesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ [SERVICE_QUERY_PARAM]: HOME_CONTENT.services[2].id })) },
        },
      ],
    }).compileComponents();

    const requested = TestBed.createComponent(HomeServicesComponent);
    requested.componentRef.setInput('services', HOME_CONTENT.services);
    requested.detectChanges();

    requested.componentInstance.select(HOME_CONTENT.services[4]);
    requested.detectChanges();

    expect(requested.componentInstance.activeServiceId).toBe(HOME_CONTENT.services[4].id);
  });
});
