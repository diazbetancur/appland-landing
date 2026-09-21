import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT, SERVICE_QUERY_PARAM } from '../../feature/pages/home/home-content.config';
import { FooterComponent } from './footer.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  /** Traduce una clave del contenido para comparar contra el texto que se pinta. */
  const t = (key: string): string => TestBed.inject(TranslateService).instant(key);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FooterComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(FooterComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.footer);
    fixture.detectChanges();
  });

  /** Guardia de la copia del pie: los titulares de columna salen de los archivos de traduccion. */
  it('renders the approved column headings and rights notice', () => {
    const headings = fixture.debugElement.queryAll(By.css('h2')).map((h) => h.nativeElement.textContent.trim());
    expect(headings).toEqual(['Navegación', 'Servicios', 'Contacto']);
    expect(fixture.nativeElement.textContent).toContain('Todos los derechos reservados.');
    expect(fixture.nativeElement.textContent).toContain('WhatsApp');
  });

  it('renders approved root fragments and nested contact information', () => {
    expect(fixture.nativeElement.textContent).toContain(t(HOME_CONTENT.footer.brandSummaryKey));
    expect(fixture.debugElement.query(By.css('a[href^="mailto:"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('a[href^="tel:"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('a[href*="#por-que-appland"]'))).not.toBeNull();
  });

  it('omits unapproved social and legal destinations and language UI', () => {
    expect(fixture.debugElement.query(By.css('.footer__social'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.footer__bottom div'))).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('EN');
    expect(fixture.debugElement.query(By.css('[data-en]'))).toBeNull();
  });

  it('exposes the brand name via aria-label since the logo image is decorative', () => {
    const brandLink = fixture.debugElement.query(By.css('.footer__logo'));
    const brandMark = fixture.debugElement.query(By.css('.footer__logo img'));
    expect(brandLink.attributes['aria-label']).toBe('APPLAND, inicio');
    expect(brandMark.attributes['alt']).toBe('');
  });

  it('points every service link at its own service, not just the generic section', () => {
    // Los cinco enlaces caian en la misma seccion porque la de servicios es un componente
    // de pestanas con un solo anclaje. El parametro identifica cual abrir.
    const links = fixture.debugElement.queryAll(By.css('a[href*="servicio="]'));

    expect(links.length).toBe(HOME_CONTENT.footer.services.length);

    const requested = links.map((link) => new URL(link.nativeElement.href).searchParams.get(SERVICE_QUERY_PARAM));
    expect(requested).toEqual(HOME_CONTENT.services.map((service) => service.id));
  });
});
