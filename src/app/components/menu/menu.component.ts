import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ConversionAction,
  HomeSectionId,
  NavigationItem,
  ResolvedAction,
} from '../../feature/pages/home/home-content.models';
import { HomeSectionObserverService } from '../../shared/services/home-section-observer.service';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [RouterLink, CdkTrapFocus],
})
export class MenuComponent implements OnInit, OnDestroy {
  private readonly sectionObserver = inject(HomeSectionObserverService);
  private readonly router = inject(Router);

  @Input() items: readonly NavigationItem[] = [];
  @Input() meetingAction!: ConversionAction;
  @ViewChild('menuToggle') menuToggle?: ElementRef<HTMLButtonElement>;

  activeFragment: HomeSectionId | null = null;
  isMenuOpen = false;
  isScrolled = false;
  meetingDestination!: ResolvedAction;
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.meetingDestination = resolveConversionAction(this.meetingAction);
    this.subscriptions.add(
      this.sectionObserver.activeNavigationFragment.subscribe((fragment) => {
        this.activeFragment = fragment;
      }),
    );
    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.closeMenu(false);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleMenu(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu(): void {
    this.isMenuOpen = true;
  }

  closeMenu(restoreFocus = true): void {
    if (!this.isMenuOpen) {
      return;
    }
    this.isMenuOpen = false;
    if (restoreFocus) {
      queueMicrotask(() => this.menuToggle?.nativeElement.focus());
    }
  }

  navigate(): void {
    this.closeMenu(false);
  }

  isActive(fragment: HomeSectionId): boolean {
    return this.activeFragment === fragment;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 16;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth >= 1024) {
      this.closeMenu(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
