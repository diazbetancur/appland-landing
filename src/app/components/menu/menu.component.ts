import { Component, HostListener } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  scrolled = '';
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('.fixed-header') as HTMLElement;
    if (window.pageYOffset > 1) {
      this.scrolled = 'scrolled';
    } else {
      this.scrolled = '';
    }
  }

  navItems = [
    {
      name: 'Home',
      submenu: [
        { name: 'App Landing', route: '/app-landing' },
        { name: 'Software Landing', route: '/software-landing' },
        { name: 'Creative Agency', route: '/creative-agency' },
        // Otros submenús
      ]
    },
    { name: 'Expertise', route: '/#expertise' },
    { name: 'Portfolio', route: '/#portfolio' },
    { name: 'About', route: '/#about' },
    { name: 'Blog', route: '/#blog' },
    { name: 'Contact', route: '/#contact' }
  ];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isInfoOpen = false;

  toggleInfo() {
    this.isInfoOpen = !this.isInfoOpen;
  }
  info = 'Arrived compass prepare an on as. Reasonable particular on my it in sympathize. Size now easy eat hand how. Unwilling he departure elsewhere dejection at. Heart large seems may purse means few blind.'
}
