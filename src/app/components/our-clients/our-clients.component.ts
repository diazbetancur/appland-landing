import { Component, InjectionToken, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Client } from '../../feature/pages/home/home-content.models';

/**
 * Ancho por debajo del cual la marquesina tiene sentido, identico al del mismo componente en
 * `our-clients.component.scss`. Se declara aqui para que la plantilla y los estilos no puedan
 * discrepar: si se cambia uno hay que cambiar el otro, y la constante lo deja a la vista.
 */
export const CLIENTS_MARQUEE_VIEWPORT = '(max-width: 1023px)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Cuantos logotipos entran quietos en una fila de escritorio. Con mas, las columnas se
 * encogerian hasta volver ilegibles los logos, asi que la marquesina vuelve a correr a
 * cualquier ancho.
 */
export const CLIENTS_STATIC_LIMIT = 5;

/**
 * Segundos que tarda en pasar cada logotipo. Con cinco daba los 34 s que tenia fijos la
 * marquesina; fijar la vuelta entera en vez de esto haria que, al sumar marcas, cada logo
 * pasara mas rapido hasta no poder leerse.
 */
export const CLIENTS_SECONDS_PER_LOGO = 6.8;

/** Fuente de azar del orden de los logotipos. Las pruebas la sustituyen por una fija. */
export const CLIENTS_RANDOM = new InjectionToken<() => number>('CLIENTS_RANDOM', {
  providedIn: 'root',
  factory: () => Math.random,
});

/**
 * Fisher-Yates sobre una copia. Se mezcla una sola vez, al recibir la lista: mezclar mientras
 * la marquesina corre haria saltar los logos, y las dos copias de la pista tienen que ir en el
 * mismo orden para que la vuelta no deje una costura visible.
 */
function shuffle<T>(items: readonly T[], random: () => number): readonly T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
  imports: [TranslatePipe],
})
export class OurClientsComponent implements OnInit, OnDestroy {
  private readonly random = inject(CLIENTS_RANDOM);
  private orderedClients: readonly Client[] = [];

  /**
   * El orden se mezcla en cada visita para que no sean siempre las mismas marcas las que se
   * ven primero.
   */
  @Input()
  set clients(value: readonly Client[]) {
    this.orderedClients = shuffle(value, this.random);
  }
  get clients(): readonly Client[] {
    return this.orderedClients;
  }

  pausedByUser = false;
  pausedByInteraction = false;
  reducedMotion = false;
  narrowViewport = false;

  private viewportQuery: MediaQueryList | undefined;

  private readonly onViewportChange = (event: MediaQueryListEvent): void => {
    this.narrowViewport = event.matches;
  };

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    this.viewportQuery = window.matchMedia(CLIENTS_MARQUEE_VIEWPORT);
    this.narrowViewport = this.viewportQuery.matches;
    this.viewportQuery.addEventListener('change', this.onViewportChange);
  }

  ngOnDestroy(): void {
    this.viewportQuery?.removeEventListener('change', this.onViewportChange);
  }

  /** Duracion de una vuelta de la marquesina, proporcional al largo de la pista. */
  get marqueeSeconds(): number {
    return this.clients.length * CLIENTS_SECONDS_PER_LOGO;
  }

  /** Si caben todos en una fila de escritorio. Los estilos lo leen por la clase `clients--fits`. */
  get fitsInOneRow(): boolean {
    return this.clients.length <= CLIENTS_STATIC_LIMIT;
  }

  /**
   * A partir de 1024 px, y mientras sean pocos, los logotipos entran completos en una sola
   * fila, asi que desplazarlos no resuelve ningun problema de espacio y si crea uno de
   * lectura: cada logo pasa de largo y se corta contra el degradado de los bordes. Ahi la
   * marquesina no corre. Con mas de `CLIENTS_STATIC_LIMIT` ya no caben y vuelve a correr
   * tambien en escritorio. Esta bandera es la unica senal de que corre o no: de ella dependen
   * el control de pausa y el estado que anuncia.
   */
  get carouselActive(): boolean {
    return (this.narrowViewport || !this.fitsInOneRow) && !this.reducedMotion;
  }

  get paused(): boolean {
    return !this.carouselActive || this.pausedByUser || this.pausedByInteraction;
  }

  /**
   * Sin animacion no hay nada que gobernar, asi que el control sobra.
   *
   * No se exige un numero minimo de logotipos: la marquesina duplica el grupo y se desplaza
   * igual con uno solo. Es distinto del control de la seccion de servicios, que si lo exige
   * porque rotar entre un unico servicio no comunica nada.
   */
  get pauseControlVisible(): boolean {
    return this.carouselActive;
  }

  togglePause(): void {
    this.pausedByUser = !this.pausedByUser;
  }

  setInteractionPause(paused: boolean): void {
    this.pausedByInteraction = paused;
  }
}
