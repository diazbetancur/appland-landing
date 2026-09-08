import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SERVICE_QUERY_PARAM } from '../../feature/pages/home/home-content.config';
import { Service } from '../../feature/pages/home/home-content.models';

/** Intervalo aprobado por el usuario entre un servicio y el siguiente. */
const ROTATION_INTERVAL_MS = 6000;

@Component({
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: ['./home-services.component.scss'],
})
export class HomeServicesComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() services: readonly Service[] = [];
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChild('tabStrip') tabStrip?: ElementRef<HTMLElement>;

  activeServiceId = '';

  /**
   * Las cinco causas que pueden detener la rotacion automatica.
   *
   * Se modelan por separado, y no como un unico booleano, porque se revierten de forma
   * distinta: `stoppedPermanently` no vuelve atras en toda la visita, mientras que las otras
   * tres si. Fundirlas haria que salir del hover reanudara algo que una seleccion manual
   * habia detenido para siempre.
   */
  reducedMotion = false;
  pausedByControl = false;
  pausedByInteraction = false;
  stoppedPermanently = false;

  /**
   * Arranca en visible a proposito. El observador la corrige en cuanto entra en juego, y el
   * primer avance no ocurre hasta pasados seis segundos, asi que no hay ventana en la que un
   * valor optimista provoque un cambio indebido. Ademas deja la seccion funcionando donde no
   * haya `IntersectionObserver`.
   */
  inView = true;

  /** Hay pestanas fuera de vista, asi que hace falta declarar cuantas soluciones existen. */
  tabsOverflowing = false;

  private readonly route = inject(ActivatedRoute);
  private readonly ngZone = inject(NgZone);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly subscriptions = new Subscription();
  private rotationTimer?: ReturnType<typeof setTimeout>;
  private visibilityObserver?: IntersectionObserver;

  /**
   * Servicio pedido desde la URL. La seccion es un componente de pestanas con un solo
   * anclaje, asi que un enlace no puede apuntar a un servicio concreto solo con el
   * fragmento: lo identifica este parametro, que escriben los enlaces del pie de pagina.
   */
  private requestedServiceId: string | null = null;

  get activeService(): Service | undefined {
    return this.services.find((service) => service.id === this.activeServiceId);
  }

  get activeIndex(): number {
    return this.services.findIndex((service) => service.id === this.activeServiceId);
  }

  /**
   * El panel se pinta con un bloque `@for` sobre esta lista de un solo elemento.
   *
   * El proyecto no depende de `@angular/animations`, y una transicion CSS no se dispara al
   * cambiar el contenido de un nodo que persiste. Al recorrer una lista con `track` por id,
   * Angular destruye y recrea el nodo en cada cambio de servicio, y con el corre la animacion
   * de entrada.
   */
  get activePanel(): readonly Service[] {
    const active = this.activeService;
    return active ? [active] : [];
  }

  /** El control no tiene nada que ofrecer cuando ya no hay rotacion posible que gobernar. */
  get rotationControlVisible(): boolean {
    return this.services.length > 1 && !this.reducedMotion && !this.stoppedPermanently;
  }

  /** Rotar con un solo servicio no comunica variedad alguna, que es el proposito. */
  get rotating(): boolean {
    return (
      this.services.length > 1 &&
      !this.reducedMotion &&
      !this.stoppedPermanently &&
      !this.pausedByControl &&
      !this.pausedByInteraction &&
      this.inView
    );
  }

  ngOnInit(): void {
    this.reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.subscriptions.add(
      this.route.queryParamMap.subscribe((params) => {
        this.requestedServiceId = params.get(SERVICE_QUERY_PARAM);
        this.applySelection();
      }),
    );

    this.scheduleRotation();
  }

  /**
   * Sin umbral: para una seccion mas alta que la ventana, exigir un porcentaje visible
   * significaria no considerarla nunca visible en pantallas pequenas.
   */
  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.visibilityObserver = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      this.ngZone.run(() => this.setInView(visible));
    });
    this.visibilityObserver.observe(this.elementRef.nativeElement);

    // Medir aqui mismo cambiaria, ya terminada la comprobacion de la vista, un valor que la
    // plantilla acaba de leer: NG0100. Se aplaza un microtask, igual que HorizontalCarouselDirective.
    queueMicrotask(() => this.refreshOverflow());
  }

  @HostListener('window:resize')
  refreshOverflow(): void {
    const strip = this.tabStrip?.nativeElement;
    if (!strip) {
      return;
    }
    this.tabsOverflowing = strip.scrollWidth > strip.clientWidth + 1;
  }

  ngOnChanges(): void {
    this.applySelection();
    this.scheduleRotation();
  }

  ngOnDestroy(): void {
    this.visibilityObserver?.disconnect();
    this.clearRotation();
    this.subscriptions.unsubscribe();
  }

  /**
   * Seleccion hecha por la persona, sea con el raton o con el teclado.
   *
   * Detiene la rotacion para el resto de la visita: devolver el control y volver a
   * quitarselo unos segundos despues es de las cosas que mas molestan de un carrusel.
   * El avance automatico no pasa por aqui, precisamente para no detenerse a si mismo.
   */
  select(service: Service): void {
    this.stoppedPermanently = true;
    this.clearRotation();
    // Una seleccion manual manda sobre lo que pidiera la URL: si no se olvidara, el
    // parametro volveria a imponerse en la siguiente deteccion de cambios.
    this.requestedServiceId = null;
    this.activeServiceId = service.id;
    this.keepActiveTabVisible();
  }

  setInView(inView: boolean): void {
    this.inView = inView;
    this.scheduleRotation();
  }

  setInteractionPause(paused: boolean): void {
    this.pausedByInteraction = paused;
    this.scheduleRotation();
  }

  togglePause(): void {
    this.pausedByControl = !this.pausedByControl;
    this.scheduleRotation();
  }

  /**
   * Programa el siguiente avance, o lo cancela si algo detiene la rotacion.
   *
   * Se encadena un `setTimeout` por avance en vez de usar un `setInterval` para que al
   * reanudar tras una pausa se conceda el intervalo completo: con un intervalo fijo, quien
   * vuelve puede caer en un tic que ya estaba a punto de dispararse.
   *
   * El temporizador vive fuera de la zona de Angular. Dentro, un tic cada seis segundos
   * dispararia deteccion de cambios en toda la aplicacion mientras la Home este abierta; solo
   * se vuelve a entrar para aplicar el cambio de servicio, que es lo unico que la necesita.
   */
  private scheduleRotation(): void {
    this.clearRotation();
    if (!this.rotating) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.rotationTimer = setTimeout(() => {
        this.ngZone.run(() => {
          this.advance();
          this.scheduleRotation();
        });
      }, ROTATION_INTERVAL_MS);
    });
  }

  private clearRotation(): void {
    if (this.rotationTimer !== undefined) {
      clearTimeout(this.rotationTimer);
      this.rotationTimer = undefined;
    }
  }

  /**
   * Avance automatico. No pasa por `select` a proposito: esa via marca la rotacion como
   * detenida para siempre, asi que el primer avance se detendria a si mismo.
   */
  private advance(): void {
    const current = this.services.findIndex((service) => service.id === this.activeServiceId);
    const next = this.services[(current + 1) % this.services.length];
    if (next) {
      this.activeServiceId = next.id;
      this.keepActiveTabVisible();
    }
  }

  /**
   * Centra la pestana activa dentro de la tira cuando hay pestanas fuera de vista.
   *
   * Se desplaza el contenedor y no se usa `scrollIntoView`: ese escala por los ancestros y
   * puede arrastrar la pagina entera, que es justo lo que no debe pasar cuando el cambio no
   * lo ha pedido nadie.
   */
  private keepActiveTabVisible(): void {
    const strip = this.tabStrip?.nativeElement;
    const tab = this.tabButtons?.get(this.activeIndex)?.nativeElement;
    if (!this.tabsOverflowing || !strip || !tab) {
      return;
    }

    const centered = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, centered), behavior: this.reducedMotion ? 'auto' : 'smooth' });
  }

  private applySelection(): void {
    const requested = this.services.find((service) => service.id === this.requestedServiceId);
    if (requested) {
      this.activeServiceId = requested.id;
      // Pedir un servicio concreto desde la URL es una intencion explicita del visitante, y
      // la rotacion no se la quita, igual que no se la quita tras una seleccion manual.
      this.stoppedPermanently = true;
      this.clearRotation();
      return;
    }

    if (!this.services.some((service) => service.id === this.activeServiceId)) {
      this.activeServiceId = this.services[0]?.id ?? '';
    }
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    let nextIndex: number;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % this.services.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + this.services.length) % this.services.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = this.services.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    this.select(this.services[nextIndex]);
    this.tabButtons.get(nextIndex)?.nativeElement.focus();
  }
}
