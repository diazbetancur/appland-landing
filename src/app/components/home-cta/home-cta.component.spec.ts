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
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.contact.title);
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.contact.body);
    expect(fixture.debugElement.query(By.css('a[href^="mailto:"]')).attributes['href']).toBe('mailto:hello@applandtech.com');
    expect(fixture.debugElement.query(By.css('a[href^="tel:"]')).attributes['href']).toBe('tel:+50433949211');
  });

  it('uses contacto as meeting fallback and WhatsApp without an invented message', () => {
    expect(fixture.debugElement.query(By.css('a[href*="#contacto"]'))).not.toBeNull();
    const whatsapp = fixture.debugElement.query(By.css('a[href^="https://wa.me/"]'));
    expect(whatsapp.attributes['href']).toBe('https://wa.me/50433949211');
    expect(whatsapp.attributes['rel']).toBe('noopener noreferrer');
  });

  it('omits social navigation while no link is approved', () => {
    expect(fixture.debugElement.query(By.css('.contact__social'))).toBeNull();
  });

});
