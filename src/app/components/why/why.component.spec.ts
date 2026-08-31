import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { WhyComponent } from './why.component';

describe('WhyComponent', () => {
  let fixture: ComponentFixture<WhyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, WhyComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(WhyComponent);
    fixture.componentRef.setInput('benefits', HOME_CONTENT.benefits);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contact.meetingAction);
    fixture.detectChanges();
  });

  it('renders the seven official attributes with descriptions at the Nosotros destination', () => {
    expect(fixture.debugElement.query(By.css('#por-que-appland-title'))).not.toBeNull();
    expect(fixture.debugElement.queryAll(By.css('.why__grid li')).length).toBe(7);
    HOME_CONTENT.benefits.forEach((benefit) => {
      expect(fixture.nativeElement.textContent).toContain(benefit.statement);
      expect(fixture.nativeElement.textContent).toContain(benefit.description);
    });
  });

  it('resolves the contact action to the approved destination', () => {
    const cta = fixture.debugElement.query(By.css('.why__cta'));
    expect(cta.nativeElement.textContent.trim()).toContain('Conversemos sobre tu proyecto');
    expect(cta.nativeElement.getAttribute('href')).toContain('#contacto');
  });

  it('gives every attribute a decorative icon that adds no accessible text', () => {
    const icons = fixture.debugElement.queryAll(By.css('.why__icon'));
    expect(icons.length).toBe(HOME_CONTENT.benefits.length);
    icons.forEach((icon) => {
      expect(icon.attributes['aria-hidden']).toBe('true');
      expect(icon.query(By.css('svg'))).not.toBeNull();
    });
  });

  it('contains no testimonial content', () => {
    expect(fixture.nativeElement.textContent.toLowerCase()).not.toContain('testimonio');
    expect(fixture.debugElement.query(By.css('[class*="testimonial"]'))).toBeNull();
  });
});
