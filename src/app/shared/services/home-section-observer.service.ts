import { Injectable, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HOME_SECTION_IDS, HomeSectionId, ObservedRegionId } from '../../feature/pages/home/home-content.models';

const ACTIVE_NAVIGATION_MAP: Readonly<Record<ObservedRegionId, HomeSectionId>> = {
  inicio: 'inicio',
  clientes: 'inicio',
  desafios: 'servicios',
  servicios: 'servicios',
  casos: 'casos',
  ia: 'servicios',
  productos: 'servicios',
  'por-que-appland': 'por-que-appland',
  'equipo-global': 'por-que-appland',
  contacto: 'contacto',
  footer: 'contacto',
};

@Injectable({ providedIn: 'root' })
export class HomeSectionObserverService implements OnDestroy {
  private readonly router = inject(Router);

  /**
   * Alto visible de cada region, en px, segun el ultimo aviso de su observador.
   *
   * La seccion activa es la que mas pantalla ocupa, que es lo que pide el punto 06 de la
   * auditoria. Antes se activaba cuando su borde superior cruzaba una linea al 25% del alto,
   * y eso la marcaba tarde: con una seccion ya llenando la pantalla, la barra seguia en la
   * anterior hasta que el borde llegaba a la linea. Medido a 1440x900, la barra iba atrasada
   * en 35 de 170 posiciones de un recorrido completo, en todas las transiciones.
   */
  private readonly visibleHeights = new Map<ObservedRegionId, number>();

  private readonly registeredRegionIds = new Set<ObservedRegionId>();
  private readonly activeRegionSubject = new BehaviorSubject<ObservedRegionId | null>(null);
  private readonly activeNavigationSubject = new BehaviorSubject<HomeSectionId | null>(null);
  private readonly routeSubscription: Subscription;
  private homeRouteActive = false;

  readonly activeRegionId = this.activeRegionSubject.asObservable();
  readonly activeNavigationFragment = this.activeNavigationSubject.asObservable();

  constructor() {
    this.syncRoute(this.router.url);
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        this.syncRoute(event.url);
      }
    });
  }

  get currentActiveFragment(): HomeSectionId | null {
    return this.activeNavigationSubject.value;
  }

  get isHomeRouteActive(): boolean {
    return this.homeRouteActive;
  }

  get registeredRegions(): readonly ObservedRegionId[] {
    return Array.from(this.registeredRegionIds);
  }

  registerRegion(regionId: ObservedRegionId): void {
    this.registeredRegionIds.add(regionId);
  }

  unregisterRegion(regionId: ObservedRegionId): void {
    this.registeredRegionIds.delete(regionId);
    this.visibleHeights.delete(regionId);
    if (this.activeRegionSubject.value === regionId) {
      this.setActiveRegion(this.homeRouteActive ? 'inicio' : null);
    }
  }

  /**
   * @param visibleHeight Alto en px de la parte de la region que se ve, sin la barra fija.
   *
   * Con todas las regiones fuera de la pantalla no cambia nada: se queda la ultima activa.
   * Ante un empate gana la primera registrada, que es la que va antes en la pagina.
   */
  notifyRegionVisibility(regionId: ObservedRegionId, visibleHeight: number): void {
    if (!this.registeredRegionIds.has(regionId)) {
      return;
    }
    this.visibleHeights.set(regionId, visibleHeight);
    if (!this.homeRouteActive) {
      return;
    }

    let mostVisible: ObservedRegionId | null = null;
    let largest = 0;
    for (const id of this.registeredRegionIds) {
      const height = this.visibleHeights.get(id) ?? 0;
      if (height > largest) {
        largest = height;
        mostVisible = id;
      }
    }
    if (mostVisible) {
      this.setActiveRegion(mostVisible);
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.activeRegionSubject.complete();
    this.activeNavigationSubject.complete();
  }

  private syncRoute(url: string): void {
    const tree = this.router.parseUrl(url || '/');
    const primarySegments = tree.root.children['primary']?.segments ?? [];
    const nextHomeRouteActive = primarySegments.length === 0;

    this.homeRouteActive = nextHomeRouteActive;
    if (!nextHomeRouteActive) {
      this.setActiveRegion(null);
      return;
    }

    const fragment = tree.fragment;
    const region = HOME_SECTION_IDS.find((id) => id === fragment);
    this.setActiveRegion(region ?? this.activeRegionSubject.value ?? 'inicio');
  }

  private setActiveRegion(regionId: ObservedRegionId | null): void {
    const activeRegion = this.homeRouteActive ? regionId : null;
    const fragment = activeRegion ? ACTIVE_NAVIGATION_MAP[activeRegion] : null;
    this.activeRegionSubject.next(activeRegion);
    this.activeNavigationSubject.next(fragment);
  }
}

export function mapObservedRegionToNavigationFragment(regionId: ObservedRegionId): HomeSectionId {
  return ACTIVE_NAVIGATION_MAP[regionId];
}
