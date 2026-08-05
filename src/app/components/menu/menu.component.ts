import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ConversionAction,
  HomeSectionId,
  NavigationItem,
  ResolvedAction,
} from '../../feature/pages/home/home-content.models';
import { HomeSectionObserverService } from '../../shared/services/home-section-observer.service';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  @Input() items: readonly NavigationItem[] = [];
  @Input() meetingAction!: ConversionAction;
  @ViewChild('menuToggle') menuToggle?: ElementRef<HTMLButtonElement>;

  activeFragment: HomeSectionId | null = null;
  isMenuOpen = false;
  isScrolled = false;
  meetingDestination!: ResolvedAction;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly sectionObserver: HomeSectionObserverService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.meetingDestination = resolveConversionAction(this.meetingAction);
    this.subscriptions.add(
      this.sectionObserver.activeNavigationFragment.subscribe((fragment) => {
        this.activeFragment = fragment;
      })
    );
    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.closeMenu(false);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleMenu(): void {
    this.isMenuOpen ? this.closeMenu() : this.openMenu();
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
