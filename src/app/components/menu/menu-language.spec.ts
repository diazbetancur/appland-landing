import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../shared/language.service';
import { useTranslations } from '../../shared/i18n/translations.testing';
import { MenuComponent } from './menu.component';

@Component({
  selector: 'app-language-route-stub',
  template: '',
  imports: [A11yModule],
})
class LanguageRouteStubComponent {}

/**
 * El selector de idioma, pedido por el usuario el 2026-09-21.
 *
 * Sin el, quien cae en el idioma que no entiende no tiene salida: el idioma inicial lo decide
 * el navegador y no habia forma de cambiarlo desde la interfaz.
 */
describe('MenuComponent language selector', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let translate: TranslateService;

  const options = () => fixture.debugElement.queryAll(By.css('.menu__language--desktop [role="radio"]'));

  beforeEach(async () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    await TestBed.configureTestingModule({
      imports: [
        A11yModule,
        RouterTestingModule.withRoutes([{ path: '', component: LanguageRouteStubComponent }]),
        MenuComponent,
        LanguageRouteStubComponent,
      ],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    translate = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(MenuComponent);
    fixture.componentRef.setInput('items', HOME_CONTENT.navigation);
    fixture.componentRef.setInput('meetingAction', HOME_CONTENT.hero.primaryAction);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('offers one option per supported language, in the approved order', () => {
    const labels = options().map((option) => option.nativeElement.textContent.trim());
    expect(labels).toEqual(['ES', 'EN']);
    expect(labels.length).toBe(SUPPORTED_LANGUAGES.length);
  });

  /** Un grupo de radio se anuncia como una sola pregunta con dos respuestas, no como dos botones. */
  it('groups the options as a single labelled radiogroup', () => {
    const group = fixture.debugElement.query(By.css('.menu__language--desktop'));
    expect(group.attributes['role']).toBe('radiogroup');
    expect(group.attributes['aria-label']).toBe('Idioma');
  });

  it('marks the active language and only the active one', () => {
    const checked = options().map((option) => option.attributes['aria-checked']);
    expect(checked).toEqual(['true', 'false']);
  });

  it('switches the language when another option is chosen', () => {
    options()[1].nativeElement.click();
    fixture.detectChanges();

    expect(translate.currentLang()).toBe('en');
    expect(options().map((option) => option.attributes['aria-checked'])).toEqual(['false', 'true']);
  });

  it('remembers the choice for the next visit', () => {
    options()[1].nativeElement.click();

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  /** Son `button`, asi que Enter y Espacio ya los activan; lo que hace falta es que sean tabulables. */
  it('keeps every option reachable by keyboard', () => {
    for (const option of options()) {
      expect(option.nativeElement.tagName).toBe('BUTTON');
      expect(option.nativeElement.type).toBe('button');
      expect(option.attributes['tabindex']).not.toBe('-1');
    }
  });

  /**
   * El nombre completo de cada idioma va en su propio idioma en las dos versiones: es lo que
   * permite que alguien que cayo en el idioma equivocado reconozca el suyo.
   */
  it('names each language in its own language', () => {
    const names = options().map((option) => option.attributes['aria-label']);
    expect(names).toEqual(['Español', 'English']);

    translate.use('en');
    fixture.detectChanges();

    expect(options().map((option) => option.attributes['aria-label'])).toEqual(['Español', 'English']);
  });

  it('offers the selector inside the compact panel as well', () => {
    fixture.componentInstance.openMenu();
    fixture.detectChanges();

    const compact = fixture.debugElement.query(By.css('.compact-menu .menu__language'));
    expect(compact).not.toBeNull();
    expect(compact.queryAll(By.css('[role="radio"]')).length).toBe(SUPPORTED_LANGUAGES.length);
  });
});
