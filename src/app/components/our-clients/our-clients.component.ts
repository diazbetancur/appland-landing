import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Client } from '../../feature/pages/home/home-content.models';

/**
 * Ancho por debajo del cual la marquesina tiene sentido, identico al del mismo componente en
 * `our-clients.component.scss`. Se declara aqui para que la plantilla y los estilos no puedan
 * discrepar: si se cambia uno hay que cambiar el otro, y la constante lo deja a la vista.
 */
export const CLIENTS_MARQUEE_VIEWPORT = '(max-width: 1023px)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
  imports: [TranslatePipe],
})
export class OurClientsComponent implements OnInit, OnDestroy {
  @Input() clients: readonly Client[] = [];

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

  /**
   * A partir de 1024 px los logotipos entran completos en una sola fila, asi que desplazarlos
   * no resuelve ningun problema de espacio y si crea uno de lectura: cada logo pasa de largo y
   * se corta contra el degradado de los bordes. Ahi la marquesina no corre, y esta bandera es
   * la unica senal de que corre o no: de ella dependen el control de pausa y el estado que
   * anuncia.
   */
  get carouselActive(): boolean {
    return this.narrowViewport && !this.reducedMotion;
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
