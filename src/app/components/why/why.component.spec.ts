import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { WhyComponent } from './why.component';

describe('WhyComponent', () => {
  let fixture: ComponentFixture<WhyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [WhyComponent] }).compileComponents();
    fixture = TestBed.createComponent(WhyComponent);
    fixture.componentInstance.benefits = HOME_CONTENT.benefits;
    fixture.detectChanges();
  });

  it('renders the seven official attributes at the Nosotros destination', () => {
    expect(fixture.debugElement.query(By.css('#por-que-appland-title'))).not.toBeNull();
    expect(fixture.debugElement.queryAll(By.css('.why__grid li')).length).toBe(7);
    HOME_CONTENT.benefits.forEach((benefit) => expect(fixture.nativeElement.textContent).toContain(benefit.statement));
  });

  it('contains no testimonial content', () => {
    expect(fixture.nativeElement.textContent.toLowerCase()).not.toContain('testimonio');
    expect(fixture.debugElement.query(By.css('[class*="testimonial"]'))).toBeNull();
  });
});
