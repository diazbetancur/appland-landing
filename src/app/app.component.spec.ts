import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeSectionDirective } from './shared/directives/home-section.directive';
import {
  ConversionAction,
  FooterContent,
  NavigationItem,
  ObservedRegionId,
} from './feature/pages/home/home-content.models';
import { provideTranslateService } from '@ngx-translate/core';
import { useTranslations } from './shared/i18n/translations.testing';

@Component({
  selector: 'app-menu',
  template: '',
  imports: [RouterTestingModule],
})
class MenuStubComponent {
  @Input() items: readonly NavigationItem[] = [];
  @Input() meetingAction!: ConversionAction;
}

@Component({
  selector: 'app-footer',
  template: '',
  imports: [RouterTestingModule],
})
class FooterStubComponent {
  @Input() content!: FooterContent;
}

@Directive({ selector: '[appHomeSection]' })
class HomeSectionStubDirective {
  @Input('appHomeSection') regionId!: ObservedRegionId;
}

describe('AppComponent shell', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    // Al pasar a standalone, AppComponent declara sus propios imports y renderiza los
    // componentes reales, asi que los dobles dejaron de usarse. En NgModule bastaba
    // declararlos en el TestBed para que ganaran; ahora hay que sustituirlos explicitamente.
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MenuStubComponent, FooterStubComponent, HomeSectionStubDirective, AppComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    });
    TestBed.overrideComponent(AppComponent, {
      remove: { imports: [MenuComponent, FooterComponent, HomeSectionDirective] },
      add: { imports: [MenuStubComponent, FooterStubComponent, HomeSectionStubDirective] },
    });
    await TestBed.compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('binds navigation and meeting inputs to the global Menu', () => {
    const menu = fixture.debugElement.query(By.directive(MenuStubComponent)).componentInstance as MenuStubComponent;
    expect(menu.items.length).toBe(5);
    expect(menu.meetingAction.fallbackFragment).toBe('contacto');
  });

  it('binds one complete FooterContent object including nested contact', () => {
    const footer = fixture.debugElement.query(By.directive(FooterStubComponent))
      .componentInstance as FooterStubComponent;
    expect(footer.content.contact.email.value).toBe('hello@applandtech.com');
    expect(footer.content.navigation.length).toBe(5);
  });

  it('renders skip link and header/main/footer landmarks', () => {
    const skipLink = fixture.debugElement.query(By.css('.skip-link'));
    expect(skipLink.attributes['href']).toBe('#contenido-principal');
    // El texto se comprueba porque es lo unico que lee quien navega con teclado antes de
    // cualquier otra cosa de la pagina: una clave sin traducir aqui pasa desapercibida.
    expect(skipLink.nativeElement.textContent.trim()).toBe('Saltar al contenido principal');
    expect(fixture.debugElement.query(By.css('header'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('main#contenido-principal'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('footer'))).not.toBeNull();
  });
});
