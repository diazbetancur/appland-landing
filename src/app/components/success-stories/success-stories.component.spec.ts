import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HOME_CONTENT, selectVisibleCases } from '../../feature/pages/home/home-content.config';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { SuccessStoriesComponent } from './success-stories.component';

describe('SuccessStoriesComponent', () => {
  let fixture: ComponentFixture<SuccessStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessStoriesComponent, HorizontalCarouselDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(SuccessStoriesComponent);
    fixture.componentInstance.cases = selectVisibleCases();
    fixture.detectChanges();
  });

  it('renders the five official cases in order without invented actions or media', () => {
    const cards = fixture.debugElement.queryAll(By.css('.case-card'));
    expect(cards.length).toBe(5);
    expect(cards.map((card) => card.query(By.css('h3')).nativeElement.textContent.trim())).toEqual(
      HOME_CONTENT.cases.map((item) => item.name)
    );
    expect(fixture.debugElement.query(By.css('.case-card img'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.case-card a'))).toBeNull();
  });

  it('exposes a labelled, focusable manual carousel without autoplay', () => {
    const track = fixture.debugElement.query(By.css('[aria-roledescription="carrusel"]'));
    expect(track.attributes['aria-labelledby']).toBe('casos-title');
    expect(track.attributes['tabindex']).toBe('0');
    expect(fixture.debugElement.queryAll(By.css('.cases__controls button')).length).toBe(2);
    expect((fixture.componentInstance as unknown as { interval?: unknown }).interval).toBeUndefined();
  });
});
