import { Injectable, OnDestroy } from '@angular/core';
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
  readonly activationThresholdPx = 140;

  private readonly registeredRegionIds = new Set<ObservedRegionId>();
  private readonly activeRegionSubject = new BehaviorSubject<ObservedRegionId | null>(null);
  private readonly activeNavigationSubject = new BehaviorSubject<HomeSectionId | null>(null);
  private readonly routeSubscription: Subscription;
  private homeRouteActive = false;

  readonly activeRegionId = this.activeRegionSubject.asObservable();
  readonly activeNavigationFragment = this.activeNavigationSubject.asObservable();

  constructor(private readonly router: Router) {
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
