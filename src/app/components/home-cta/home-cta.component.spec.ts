import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeCtaComponent } from './home-cta.component';

describe('HomeCtaComponent', () => {
  let fixture: ComponentFixture<HomeCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomeCtaComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeCtaComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.contact);
    fixture.detectChanges();
  });

  it('renders official title, body, email and phone', () => {
    expect(fixture.nativeElement.textContent).toContain('¿Listo para transformar tu negocio?');
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.contact.body);
    expect(fixture.debugElement.query(By.css('a[href^="mailto:"]')).attributes['href']).toBe(
      'mailto:hello@applandtech.com',
    );
    expect(fixture.debugElement.query(By.css('a[href^="tel:"]')).attributes['href']).toBe('tel:+50433949211');
  });

  it('sends both conversion actions to the official WhatsApp number', () => {
    const meeting = fixture.debugElement.query(By.css('.contact__meeting'));
    const whatsapp = fixture.debugElement.query(By.css('.contact__whatsapp'));

    // Solo el de agendar lleva texto precargado, y es el aprobado por el usuario: es lo unico
    // que distingue dos botones que de otro modo apuntarian al mismo sitio.
    expect(meeting.attributes['href']).toBe(
      'https://wa.me/50433949211?text=Hola%2C%20quiero%20agendar%20una%20reuni%C3%B3n.',
    );
    expect(whatsapp.attributes['href']).toBe('https://wa.me/50433949211');

    [meeting, whatsapp].forEach((link) => {
      expect(link.attributes['target']).toBe('_blank');
      expect(link.attributes['rel']).toBe('noopener noreferrer');
    });
  });

  /**
   * Regresion del bug reportado en la ronda 2.
   *
   * El boton de agendar caia al `fallbackFragment` de la accion, que es `contacto`, es decir
   * la propia seccion que lo contiene: el enlace existia y era valido, pero no llevaba a
   * ningun sitio. Ninguna prueba podia detectarlo porque todas asumian ese fragmento como
   * el destino correcto.
   */
  it('never points a link of the contact section back at the contacto fragment', () => {
    const hrefs = fixture.debugElement.queryAll(By.css('a')).map((link) => link.attributes['href'] ?? '');

    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => href.includes('#contacto'))).toEqual([]);
  });

  it('publishes only approved social links, each opening safely in a new context', () => {
    const links = fixture.debugElement.queryAll(By.css('.contact__details a[target="_blank"]'));
    expect(links.length).toBe(HOME_CONTENT.contact.socialLinks.length);
    links.forEach((link, index) => {
      const approved = HOME_CONTENT.contact.socialLinks[index];
      expect(approved.publicationStatus).toBe('approved');
      expect(link.attributes['href']).toBe(approved.value);
      expect(link.attributes['rel']).toBe('noopener noreferrer');
      expect(link.nativeElement.textContent.trim()).toContain(approved.label);
    });
  });

  it('omits any social link that is not approved', () => {
    fixture.componentRef.setInput('content', {
      ...HOME_CONTENT.contact,
      socialLinks: [],
    });
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.contact__details a[target="_blank"]')).length).toBe(0);
  });

  it('keeps the decorative artwork out of the accessibility tree', () => {
    const decor = fixture.debugElement.query(By.css('.contact__decor'));
    expect(decor.attributes['aria-hidden']).toBe('true');
    expect(decor.nativeElement.textContent.trim()).toBe('');
  });
});
