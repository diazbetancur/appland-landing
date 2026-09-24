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
   * Donde cae la linea que decide que seccion esta activa, como porcentaje del alto de la
   * ventana contado desde arriba.
   *
   * Antes eran 140 px fijos y la banda observada iba de ahi al 30% del alto, unos 130 px. Con
   * `threshold: 0` el observador solo avisa al entrar y al salir de la banda, y todas las
   * secciones de la Home miden entre 308 y 1080 px: ninguna cabia dentro, asi que ninguna
   * producia el aviso que la habria activado. Medido en Chromium: 26 avisos en un recorrido
   * completo y uno solo cumplia la condicion, el inicial del hero. Por eso el indicador se
   * quedaba en "Inicio" toda la pagina.
   *
   * Ahora la banda es una linea fina, asi que intersectarla significa cruzarla y ya no hace
   * falta comparar coordenadas. Es porcentual a proposito: no depende del alto de la ventana
   * y no hay que rehacer el observador al redimensionar.
   */
  readonly activationLinePercent = 25;

  /** Grosor de la banda. Lo minimo para que sea una linea y no un punto sin area. */
  readonly activationBandPercent = 1;

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
    if (this.activeRegionSubject.value === regionId) {
      this.setActiveRegion(this.homeRouteActive ? 'inicio' : null);
    }
  }

  notifyRegionVisibility(regionId: ObservedRegionId, crossesActivationLine: boolean): void {
    if (!this.homeRouteActive || !crossesActivationLine || !this.registeredRegionIds.has(regionId)) {
      return;
    }
    this.setActiveRegion(regionId);
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
