import { Component, HostListener, OnInit } from '@angular/core';
import { LanguageService } from '../shared/language.service';
import { translations, SupportedLanguages } from './menu.component.conf';

type Language = 'en' | 'es';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  currentLanguage: Language = 'en';
  navItems: Array<{ name: string; route: string }> = [];
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

  constructor(private languageService: LanguageService) {
    this.updateNavItems();
  }

  changeLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.languageService.changeLanguage(target.value);
    this.updateNavItems();
  }

  updateNavItems() {
    const lang = localStorage.getItem('language');
    this.currentLanguage = lang === 'en' || lang === 'es' ? lang : 'en';
    const menuItems = translations[this.currentLanguage];
    this.navItems = [
      { name: menuItems.home, route: '' },
      { name: menuItems.expertise, route: '/#expertise' },
      { name: menuItems.portfolio, route: '/#portfolio' },
      { name: menuItems.about, route: '/about' },
      { name: menuItems.blog, route: '/#blog' },
      { name: menuItems.contact, route: '/#contact' },
    ];
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isInfoOpen = false;

  toggleInfo() {
    this.isInfoOpen = !this.isInfoOpen;
  }
  info =
    '¡Bienvenidos a APPLAND! Con una sólida trayectoria de más de 12 años, somos líderes en el desarrollo de software a medida y soluciones digitales en nuestra zona. No solo creamos código; damos vida y empoderamos tus ideas con soluciones tecnológicas.';
}
