import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Client } from '../../feature/pages/home/home-content.models';

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
  imports: [TranslatePipe],
})
export class OurClientsComponent implements OnInit {
  @Input() clients: readonly Client[] = [];

  pausedByUser = false;
  pausedByInteraction = false;
  reducedMotion = false;

  ngOnInit(): void {
    this.reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  get paused(): boolean {
    return this.reducedMotion || this.pausedByUser || this.pausedByInteraction;
  }

  /**
   * Sin animacion no hay nada que gobernar, asi que el control sobra.
   *
   * No se exige un numero minimo de logotipos: la marquesina duplica el grupo y se desplaza
   * igual con uno solo. Es distinto del control de la seccion de servicios, que si lo exige
   * porque rotar entre un unico servicio no comunica nada.
   */
  get pauseControlVisible(): boolean {
    return !this.reducedMotion;
  }

  togglePause(): void {
    this.pausedByUser = !this.pausedByUser;
  }

  setInteractionPause(paused: boolean): void {
    this.pausedByInteraction = paused;
  }
}
