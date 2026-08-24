import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeCtaComponent } from './home-cta.component';

describe('HomeCtaComponent', () => {
  let fixture: ComponentFixture<HomeCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeCtaComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeCtaComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.contact);
    fixture.detectChanges();
  });

  it('renders official title, body, email and phone', () => {
    expect(fixture.nativeElement.textContent).toContain('¿Listo para transformar tu negocio?');
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.contact.body);
    expect(fixture.debugElement.query(By.css('a[href^="mailto:"]')).attributes['href']).toBe('mailto:mario@applandtech.com');
    expect(fixture.debugElement.query(By.css('a[href^="tel:"]')).attributes['href']).toBe('tel:+50433949211');
  });

  it('uses contacto as meeting fallback and WhatsApp without an invented message', () => {
    expect(fixture.debugElement.query(By.css('a[href*="#contacto"]'))).not.toBeNull();
    const whatsapp = fixture.debugElement.query(By.css('a[href^="https://wa.me/"]'));
    expect(whatsapp.attributes['href']).toBe('https://wa.me/50433949211');
    expect(whatsapp.attributes['rel']).toBe('noopener noreferrer');
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
    fixture.componentRef.setInput('content', { ...HOME_CONTENT.contact, socialLinks: [] });
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.contact__details a[target="_blank"]')).length).toBe(0);
  });

  it('keeps the decorative artwork out of the accessibility tree', () => {
    const decor = fixture.debugElement.query(By.css('.contact__decor'));
    expect(decor.attributes['aria-hidden']).toBe('true');
    expect(decor.nativeElement.textContent.trim()).toBe('');
  });
});
