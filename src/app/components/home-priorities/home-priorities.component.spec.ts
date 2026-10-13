import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT, SERVICE_QUERY_PARAM } from '../../feature/pages/home/home-content.config';
import { HomePrioritiesComponent } from './home-priorities.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

describe('HomePrioritiesComponent', () => {
  let fixture: ComponentFixture<HomePrioritiesComponent>;
  /** Traduce una clave del contenido para comparar contra el texto que se pinta. */
  const t = (key: string): string => TestBed.inject(TranslateService).instant(key);
  const text = (selector: string): string =>
    fixture.debugElement.query(By.css(selector)).nativeElement.textContent.trim();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomePrioritiesComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(HomePrioritiesComponent);
    fixture.componentRef.setInput('priorities', HOME_CONTENT.priorities);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contactAction);
    fixture.detectChanges();
  });

  it('renders the approved heading, lead and closing', () => {
    expect(text('#desafios-title')).toBe('Prioridades del negocio');
    expect(text('.priorities__highlight')).toBe('negocio');
    expect(text('.priorities__lead')).toBe('Construir · Modernizar · Automatizar · Escalar.');
    expect(text('.priorities__statement')).toBe('Un solo socio, múltiples formas de ejecutar');
    expect(text('.priorities__cta')).toBe('Conversemos sobre tu proyecto');
  });

  it('renders the four approved priorities in order, each with its line', () => {
    const cards = fixture.debugElement.queryAll(By.css('.priority'));
    expect(cards.map((card) => card.query(By.css('h3')).nativeElement.textContent.trim())).toEqual([
      'Construir',
      'Modernizar',
      'Automatizar',
      'Escalar',
    ]);
    expect(cards[0].query(By.css('p')).nativeElement.textContent.trim()).toBe(
      'Desarrollamos software, apps y plataformas a la medida de tu negocio.',
    );
    expect(fixture.debugElement.queryAll(By.css('h2')).length).toBe(1);
  });

  /**
   * Cada enlace abre la pestana de su servicio y se llama como el servicio. Con cuatro "Ver
   * mas" iguales, nadie sabria a donde lleva cada uno sin leer la tarjeta entera.
   */
  it('links each card to its own service tab, named after the service', () => {
    const links = fixture.debugElement.queryAll(By.css('.priority__link'));
    expect(links.length).toBe(4);

    links.forEach((link, index) => {
      const priority = HOME_CONTENT.priorities[index];
      const href = link.nativeElement.getAttribute('href') as string;
      expect(href).toContain(`${SERVICE_QUERY_PARAM}=${priority.serviceId}`);
      expect(href).toContain('#servicios');
      expect(link.nativeElement.textContent.trim()).toBe(t(priority.serviceNameKey));
    });
    expect(HOME_CONTENT.priorities.map((priority) => priority.serviceId)).toEqual([
      'software',
      'technology-consulting',
      'process-automation',
      'staff-augmentation',
    ]);
  });

  it('only links to services that exist as tabs', () => {
    const tabs = HOME_CONTENT.services.map((service) => service.id);
    for (const priority of HOME_CONTENT.priorities) {
      expect(tabs).toContain(priority.serviceId);
    }
  });

  it('opens WhatsApp from the closing button', () => {
    expect(fixture.debugElement.query(By.css('.priorities__cta')).nativeElement.getAttribute('href')).toContain(
      'https://wa.me/',
    );
  });

  it('keeps the card icons out of the accessibility tree', () => {
    const icons = fixture.debugElement.queryAll(By.css('.priority__icon'));
    expect(icons.length).toBe(4);
    icons.forEach((icon) => {
      expect(icon.attributes['aria-hidden']).toBe('true');
      expect(icon.query(By.css('svg'))).not.toBeNull();
    });
  });

  /**
   * El resaltado tiene que distinguirse del resto del titular.
   *
   * Comprobar que el `<span>` existe con su palabra no alcanza, y el spec 009 lo demostro: al
   * pasar el titular a `[innerHTML]`, el nodo deja de recibir el atributo de encapsulacion de
   * Angular, los estilos del componente dejan de aplicarle y el resaltado quedaba en el color
   * del titular. El span seguia ahi, con su texto, y las pruebas en verde.
   */
  it('paints the highlighted fragment in its own colour', () => {
    const heading = fixture.debugElement.query(By.css('#desafios-title')).nativeElement;
    const highlighted = fixture.debugElement.query(By.css('.priorities__highlight')).nativeElement;

    expect(getComputedStyle(highlighted).color).not.toBe(getComputedStyle(heading).color);
  });

  it('renders the English copy', async () => {
    await useTranslations('en');
    fixture.detectChanges();

    expect(text('#desafios-title')).toBe('Business priorities');
    expect(text('.priorities__lead')).toBe('Build · Modernize · Automate · Scale.');
    expect(text('.priorities__statement')).toBe('One partner, many ways to execute');
    expect(fixture.debugElement.query(By.css('.priorities__cta')).nativeElement.getAttribute('href')).toContain(
      encodeURIComponent('Hello, I would like to book a meeting.'),
    );
  });
});
