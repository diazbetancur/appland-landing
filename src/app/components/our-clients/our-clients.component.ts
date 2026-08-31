import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../feature/pages/home/home-content.models';

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
  standalone: false,
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

  togglePause(): void {
    this.pausedByUser = !this.pausedByUser;
  }

  setInteractionPause(paused: boolean): void {
    this.pausedByInteraction = paused;
  }
}
