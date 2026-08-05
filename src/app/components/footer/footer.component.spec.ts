import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [FooterComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.footer);
    fixture.detectChanges();
  });

  it('renders approved root fragments and nested contact information', () => {
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.footer.brandSummary);
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
});
