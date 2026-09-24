import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeCtaComponent } from './home-cta.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

describe('HomeCtaComponent', () => {
  let fixture: ComponentFixture<HomeCtaComponent>;
  /** Traduce una clave del contenido para comparar contra el texto que se pinta. */
  const t = (key: string): string => TestBed.inject(TranslateService).instant(key);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomeCtaComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(HomeCtaComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.contact);
    fixture.detectChanges();
  });

  it('renders official title, body, email and phone', () => {
    expect(fixture.nativeElement.textContent).toContain('¿Listo para transformar tu negocio?');
    expect(fixture.nativeElement.textContent).toContain(t(HOME_CONTENT.contact.bodyKey));
    expect(fixture.debugElement.query(By.css('a[href^="mailto:"]')).attributes['href']).toBe(
      'mailto:hello@applandtech.com',
    );
    expect(fixture.debugElement.query(By.css('a[href^="tel:"]')).attributes['href']).toBe('tel:+50433349211');
  });

  /**
   * La seccion de cierre ofrece un solo siguiente paso.
   *
   * Tenia dos botones, "Agendar reunion" y "Escribir por WhatsApp", y los dos abrian el mismo
   * chat del mismo numero: lo unico que los diferenciaba era que uno precargaba un texto y el
   * otro no. Dos botones que hacen lo mismo no son dos opciones, son una decision de mas
   * puesta encima de quien ya decidio escribir. Punto 06 de la ronda 4.
   *
   * Sobrevive el que lleva el mensaje aprobado, porque conserva la intencion de reunion que
   * anuncia la etiqueta.
   */
  it('offers a single conversion action, with the approved message preloaded', () => {
    const actions = fixture.debugElement.queryAll(By.css('.contact__actions a'));

    expect(actions.length).toBe(1);
    expect(actions[0].attributes['href']).toBe(
      'https://wa.me/50433349211?text=Hola%2C%20quiero%20agendar%20una%20reuni%C3%B3n.',
    );
    expect(actions[0].attributes['target']).toBe('_blank');
    expect(actions[0].attributes['rel']).toBe('noopener noreferrer');
  });

  /**
   * El mensaje precargado sigue al idioma que el visitante elige.
   *
   * La etiqueta del boton la pinta el pipe `| translate`, que si esta suscrito a los cambios de
   * idioma, pero el mensaje del `href` se resolvia con `instant()` desde `ngOnChanges`, que solo
   * se dispara cuando cambia `@Input() content`. Cambiar de idioma no lo toca, asi que el enlace
   * quedaba congelado con el idioma del primer render: quien entraba en espanol y pasaba a
   * ingles abria WhatsApp con un mensaje en espanol ya escrito, debajo de un boton en ingles.
   *
   * La prueba anterior leia el `href` una sola vez, asi que no podia verlo.
   */
  it('rewrites the preloaded message when the visitor changes language', async () => {
    const mensaje = () =>
      decodeURIComponent(fixture.debugElement.query(By.css('.contact__actions a')).attributes['href'] ?? '');

    expect(mensaje()).toContain('Hola, quiero agendar una reunión.');

    await useTranslations('en');
    fixture.detectChanges();

    expect(mensaje()).toContain('Hello, I would like to book a meeting.');
    expect(mensaje()).not.toContain('agendar');
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
      expect(link.nativeElement.textContent.trim()).toContain(t(approved.labelKey));
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

  it('keeps the highlighted word of the contact heading', () => {
    const heading = fixture.debugElement.query(By.css('#contacto-title'));
    expect(heading.nativeElement.textContent.trim()).toBe('¿Listo para transformar tu negocio?');
    expect(heading.query(By.css('.contact__highlight')).nativeElement.textContent.trim()).toBe('transformar');
  });

  /**
   * El resaltado tiene que distinguirse del resto del titular.
   *
   * Comprobar que el `<span>` existe con su palabra no alcanza, y el spec 009 lo demostro: al
   * pasar el titular a `[innerHTML]`, el nodo deja de recibir el atributo de encapsulacion de
   * Angular, los estilos del componente dejan de aplicarle y el resaltado quedaba en el color
   * del titular. El span seguia ahi, con su texto, y las pruebas en verde.
   *
   * Se compara contra el color del propio titular en vez de contra un valor fijo, para que la
   * prueba siga valiendo si cambia la paleta.
   */
  it('paints the highlighted fragment in its own colour', () => {
    const heading = fixture.debugElement.query(By.css('#contacto-title')).nativeElement;
    const highlighted = fixture.debugElement.query(By.css('.contact__highlight')).nativeElement;

    expect(getComputedStyle(highlighted).color).not.toBe(getComputedStyle(heading).color);
  });
});
