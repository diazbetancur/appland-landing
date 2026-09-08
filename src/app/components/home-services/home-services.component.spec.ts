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

  /**
   * Rotacion automatica (spec 007).
   *
   * Las cinco causas que pueden detener la rotacion se prueban por separado a proposito: se
   * revierten de forma distinta, y colapsarlas en un solo booleano haria que salir del hover
   * reanudara algo que una seleccion manual habia detenido para siempre.
   */
  describe('rotación automática', () => {
    it('rota cuando hay varios servicios y la sección está visible', () => {
      expect(component.services.length).toBeGreaterThan(1);
      expect(component.rotating).toBe(true);
    });

    it('no rota si solo hay un servicio que mostrar', () => {
      fixture.componentRef.setInput('services', HOME_CONTENT.services.slice(0, 1));
      fixture.detectChanges();
      expect(component.rotating).toBe(false);
    });

    it('no rota cuando se pide movimiento reducido', () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
      const reduced = TestBed.createComponent(HomeServicesComponent);
      reduced.componentRef.setInput('services', HOME_CONTENT.services);
      reduced.detectChanges();

      expect(reduced.componentInstance.reducedMotion).toBe(true);
      expect(reduced.componentInstance.rotating).toBe(false);
    });

    it('suspende la rotación fuera del viewport y la retoma al volver', () => {
      component.setInView(false);
      expect(component.rotating).toBe(false);
      component.setInView(true);
      expect(component.rotating).toBe(true);
    });

    it('suspende la rotación mientras hay interacción y la retoma al terminar', () => {
      component.setInteractionPause(true);
      expect(component.rotating).toBe(false);
      component.setInteractionPause(false);
      expect(component.rotating).toBe(true);
    });

    it('el control de pausa alterna en los dos sentidos', () => {
      component.togglePause();
      expect(component.pausedByControl).toBe(true);
      expect(component.rotating).toBe(false);

      component.togglePause();
      expect(component.pausedByControl).toBe(false);
      expect(component.rotating).toBe(true);
    });

    it('una selección manual detiene la rotación de forma permanente', () => {
      component.select(HOME_CONTENT.services[2]);
      expect(component.rotating).toBe(false);

      // Ninguna causa reversible puede revivirla: ese es el sentido de "permanente".
      component.setInView(true);
      component.setInteractionPause(false);
      component.togglePause();
      component.togglePause();

      expect(component.rotating).toBe(false);
    });

    it('la navegación por teclado también la detiene de forma permanente', () => {
      component.onTabKeydown({ key: 'ArrowRight', preventDefault: vi.fn() } as unknown as KeyboardEvent, 0);
      expect(component.rotating).toBe(false);
    });
  });

  describe('avance automático', () => {
    const INTERVAL = 6000;
    let rotating: ComponentFixture<HomeServicesComponent>;

    const idAt = (index: number) => HOME_CONTENT.services[index].id;
    const activeId = () => rotating.componentInstance.activeServiceId;

    beforeEach(() => {
      // Los temporizadores falsos se instalan antes de crear el componente: el primer avance
      // se programa ya en la inicializacion.
      vi.useFakeTimers();
      rotating = TestBed.createComponent(HomeServicesComponent);
      rotating.componentRef.setInput('services', HOME_CONTENT.services);
      rotating.detectChanges();
    });

    afterEach(() => {
      rotating.destroy();
      vi.useRealTimers();
    });

    it('avanza al siguiente servicio pasados seis segundos', () => {
      expect(activeId()).toBe(idAt(0));
      vi.advanceTimersByTime(INTERVAL);
      expect(activeId()).toBe(idAt(1));
    });

    it('recorre los cinco servicios y vuelve al primero', () => {
      const recorrido = HOME_CONTENT.services.map(() => {
        vi.advanceTimersByTime(INTERVAL);
        return activeId();
      });

      expect(recorrido).toEqual([idAt(1), idAt(2), idAt(3), idAt(4), idAt(0)]);
    });

    it('no avanza mientras la rotación está detenida', () => {
      rotating.componentInstance.setInView(false);
      vi.advanceTimersByTime(INTERVAL * 3);
      expect(activeId()).toBe(idAt(0));
    });

    it('concede el intervalo completo al reanudar, sin heredar el tiempo ya transcurrido', () => {
      vi.advanceTimersByTime(INTERVAL - 1000);
      rotating.componentInstance.setInteractionPause(true);
      rotating.componentInstance.setInteractionPause(false);

      vi.advanceTimersByTime(INTERVAL - 1000);
      expect(activeId()).toBe(idAt(0));

      vi.advanceTimersByTime(1000);
      expect(activeId()).toBe(idAt(1));
    });

    it('deja de avanzar tras una selección manual', () => {
      rotating.componentInstance.select(HOME_CONTENT.services[3]);
      vi.advanceTimersByTime(INTERVAL * 3);
      expect(activeId()).toBe(idAt(3));
    });

    it('libera el temporizador al destruir el componente', () => {
      rotating.destroy();
      vi.advanceTimersByTime(INTERVAL * 3);
      expect(activeId()).toBe(idAt(0));
    });

    it('un avance automático actualiza aria-selected y tabindex igual que uno manual', () => {
      vi.advanceTimersByTime(INTERVAL);
      rotating.detectChanges();

      const tabs = rotating.debugElement.queryAll(By.css('[role="tab"]'));
      expect(tabs.filter((tab) => tab.attributes['aria-selected'] === 'true').length).toBe(1);
      expect(tabs[1].attributes['aria-selected']).toBe('true');
      expect(tabs[1].attributes['tabindex']).toBe('0');
      expect(tabs[0].attributes['tabindex']).toBe('-1');
    });

    /**
     * Un panel que rota solo no debe ser region viva: anunciaria cada cambio e interrumpiria
     * al lector de pantalla cada seis segundos sin que nadie lo haya pedido.
     */
    it('no convierte el panel en una región aria-live', () => {
      const panel = rotating.debugElement.query(By.css('[role="tabpanel"]'));
      expect(panel.attributes['aria-live']).toBeUndefined();
    });
  });

  describe('visibilidad de la sección', () => {
    const nativeObserver = window.IntersectionObserver;
    let notify!: IntersectionObserverCallback;
    let disconnect: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      disconnect = vi.fn();
      class ObserverStub {
        readonly root = null;
        readonly rootMargin = '';
        readonly thresholds: number[] = [];
        constructor(received: IntersectionObserverCallback) {
          notify = received;
        }
        observe = vi.fn();
        unobserve = vi.fn();
        takeRecords = vi.fn(() => []);
        disconnect = disconnect;
      }
      window.IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
      window.IntersectionObserver = nativeObserver;
    });

    const build = () => {
      const created = TestBed.createComponent(HomeServicesComponent);
      created.componentRef.setInput('services', HOME_CONTENT.services);
      created.detectChanges();
      return created;
    };

    it('deja de rotar cuando la sección sale del viewport y retoma al volver', () => {
      const observed = build();
      expect(observed.componentInstance.rotating).toBe(true);

      notify([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
      expect(observed.componentInstance.rotating).toBe(false);

      notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      expect(observed.componentInstance.rotating).toBe(true);
    });

    it('suelta el observador al destruir el componente', () => {
      build().destroy();
      expect(disconnect).toHaveBeenCalled();
    });
  });

  describe('control de pausa', () => {
    const control = () => fixture.debugElement.query(By.css('.services__pause'));

    it('se muestra y alterna su estado declarado', () => {
      expect(control()).not.toBeNull();
      expect(control().attributes['aria-pressed']).toBe('false');

      control().triggerEventHandler('click');
      fixture.detectChanges();

      expect(control().attributes['aria-pressed']).toBe('true');
      expect(component.rotating).toBe(false);
    });

    it('lleva un nombre accesible que refleja lo que hará al pulsarse', () => {
      const pausar = control().attributes['aria-label'];
      control().triggerEventHandler('click');
      fixture.detectChanges();

      expect(pausar).toBeTruthy();
      expect(control().attributes['aria-label']).not.toBe(pausar);
    });

    // Una vez detenida para siempre, el control no tiene nada que pausar ni que reanudar.
    it('desaparece cuando la rotación ya está detenida de forma permanente', () => {
      component.select(HOME_CONTENT.services[1]);
      fixture.detectChanges();
      expect(control()).toBeNull();
    });

    it('pausa mientras el puntero o el foco están dentro de la sección', () => {
      const region = fixture.debugElement.query(By.css('.services'));

      region.triggerEventHandler('mouseenter');
      expect(component.rotating).toBe(false);
      region.triggerEventHandler('mouseleave');
      expect(component.rotating).toBe(true);

      region.triggerEventHandler('focusin');
      expect(component.rotating).toBe(false);
      region.triggerEventHandler('focusout');
      expect(component.rotating).toBe(true);
    });
  });

  describe('fundido y desborde de la tira', () => {
    const tabs = () => fixture.debugElement.queryAll(By.css('[role="tab"]'));
    const panel = () => fixture.debugElement.query(By.css('[role="tabpanel"]')).nativeElement as HTMLElement;

    /**
     * Sin `@angular/animations`, una transicion CSS no se dispara al cambiar el contenido de
     * un nodo que persiste. El fundido depende de que el panel se recree en cada cambio, asi
     * que lo que se prueba es ese mecanismo y no la animacion en si.
     */
    it('recrea el nodo del panel al cambiar de servicio', () => {
      const before = panel();
      tabs()[2].triggerEventHandler('click');
      fixture.detectChanges();

      expect(panel()).not.toBe(before);
    });

    it('conserva el mismo nodo mientras el servicio activo no cambia', () => {
      const before = panel();
      fixture.detectChanges();

      expect(panel()).toBe(before);
    });

    /**
     * El ancho del navegador de pruebas no es el del visitante, asi que la prueba no puede
     * suponer si la tira desborda: fuerza cada condicion sobre el elemento real y comprueba
     * que la medicion la sigue.
     */
    it('mide la tira en vez de suponer si hay pestañas fuera de vista', () => {
      const strip = fixture.debugElement.query(By.css('.services__tabs')).nativeElement as HTMLElement;
      strip.style.flexWrap = 'nowrap';
      strip.style.overflowX = 'auto';
      // Sin esto el contenedor flexible encoge la tira y el ancho fijado no llega a aplicarse.
      strip.style.flexShrink = '0';

      strip.style.width = '4000px';
      component.refreshOverflow();
      fixture.detectChanges();
      expect(component.tabsOverflowing).toBe(false);
      expect(fixture.debugElement.query(By.css('.services__count'))).toBeNull();

      strip.style.width = '80px';
      component.refreshOverflow();
      fixture.detectChanges();
      expect(component.tabsOverflowing).toBe(true);
      expect(fixture.debugElement.query(By.css('.services__count'))).not.toBeNull();
    });

    it('declara cuántas soluciones hay cuando la tira desborda', () => {
      component.tabsOverflowing = true;
      fixture.detectChanges();

      const count = fixture.debugElement.query(By.css('.services__count'));
      expect(count).not.toBeNull();
      expect(count.nativeElement.textContent.replace(/\s+/g, ' ').trim()).toBe(`1 / ${HOME_CONTENT.services.length}`);
      // El tablist ya expone posicion y total a la tecnologia de asistencia; repetirlo aqui
      // solo generaria ruido, y con rotacion automatica seria ruido cada seis segundos.
      expect(count.attributes['aria-hidden']).toBe('true');
    });

    it('mantiene visible la pestaña activa desplazando solo la tira, nunca la página', () => {
      component.tabsOverflowing = true;
      fixture.detectChanges();

      const strip = fixture.debugElement.query(By.css('.services__tabs')).nativeElement as HTMLElement;
      const scrollTo = vi.spyOn(strip, 'scrollTo').mockImplementation(() => undefined);
      const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => undefined);

      tabs()[3].triggerEventHandler('click');
      fixture.detectChanges();

      expect(scrollTo).toHaveBeenCalled();
      // `scrollIntoView` escala por los ancestros y arrastraria la pagina entera.
      expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it('no toca el scroll de la tira cuando no hay nada fuera de vista', () => {
      component.tabsOverflowing = false;
      const strip = fixture.debugElement.query(By.css('.services__tabs')).nativeElement as HTMLElement;
      const scrollTo = vi.spyOn(strip, 'scrollTo').mockImplementation(() => undefined);

      tabs()[3].triggerEventHandler('click');
      fixture.detectChanges();

      expect(scrollTo).not.toHaveBeenCalled();
    });
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

    // Pedir un servicio concreto es una intencion explicita: la rotacion no se la quita.
    expect(requested.componentInstance.stoppedPermanently).toBe(true);
    expect(requested.componentInstance.rotating).toBe(false);
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
