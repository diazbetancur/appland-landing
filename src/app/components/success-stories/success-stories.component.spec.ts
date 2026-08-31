import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { selectVisibleCases } from '../../feature/pages/home/home-content.config';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { SuccessStoriesComponent } from './success-stories.component';

describe('SuccessStoriesComponent', () => {
  let fixture: ComponentFixture<SuccessStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessStoriesComponent, HorizontalCarouselDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(SuccessStoriesComponent);
    fixture.componentInstance.cases = selectVisibleCases();
    fixture.detectChanges();
  });

  it('renders only the approved cases in order, each with its approved media and no invented action', () => {
    const visible = selectVisibleCases();
    const cards = fixture.debugElement.queryAll(By.css('.case-card'));
    expect(cards.length).toBe(visible.length);
    expect(cards.map((card) => card.query(By.css('h3')).nativeElement.textContent.trim())).toEqual(
      visible.map((item) => item.name),
    );
    cards.forEach((card, index) => {
      const img = card.query(By.css('img')).nativeElement;
      expect(img.src).toContain(visible[index].media?.src);
      expect(img.alt).toBe(visible[index].media?.alt);
    });
    expect(fixture.debugElement.query(By.css('.case-card a'))).toBeNull();
  });

  it('exposes a labelled, focusable manual carousel without autoplay', () => {
    const track = fixture.debugElement.query(By.css('[aria-roledescription="carrusel"]'));
    expect(track.attributes['aria-labelledby']).toBe('casos-title');
    expect(track.attributes['tabindex']).toBe('0');
    expect(fixture.debugElement.queryAll(By.css('.cases__control')).length).toBe(2);
    expect((fixture.componentInstance as unknown as { interval?: unknown }).interval).toBeUndefined();
  });
});
