import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeChallengesComponent } from './home-challenges.component';

describe('HomeChallengesComponent', () => {
  let fixture: ComponentFixture<HomeChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomeChallengesComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeChallengesComponent);
    fixture.componentRef.setInput('challenges', HOME_CONTENT.challenges);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contact.meetingAction);
    fixture.detectChanges();
  });

  it('renders five semantic challenge and response cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.challenge'));
    expect(cards.length).toBe(5);
    HOME_CONTENT.challenges.forEach((challenge) => {
      expect(fixture.nativeElement.textContent).toContain(challenge.problem);
      expect(fixture.nativeElement.textContent).toContain(challenge.response);
    });
    expect(fixture.debugElement.queryAll(By.css('h2')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('h3')).length).toBe(5);
  });

  it('renders each approved challenge photo with its own informative alt text', () => {
    const images = fixture.debugElement.queryAll(By.css('.challenge__media img'));
    expect(images.length).toBe(5);
    images.forEach((image, index) => {
      const media = HOME_CONTENT.challenges[index].media!;
      expect(image.attributes['src']).toContain(media.src);
      expect(image.attributes['alt']).toBe(media.alt);
      expect(image.attributes['alt']).not.toBe('');
      expect(image.attributes['loading']).toBe('lazy');
    });
  });

  it('exposes one contact action that resolves to the approved destination', () => {
    const cta = fixture.debugElement.query(By.css('.challenges__cta'));
    expect(cta).not.toBeNull();
    expect(cta.nativeElement.textContent.trim()).toContain('Hablemos de tu proyecto');
    expect(cta.nativeElement.getAttribute('href')).toContain('#contacto');
  });

  it('keeps the decorative graphics out of the accessibility tree', () => {
    fixture.debugElement.queryAll(By.css('.challenges__wave, .challenges__sphere')).forEach((image) => {
      expect(image.attributes['alt']).toBe('');
      expect(image.attributes['aria-hidden']).toBe('true');
    });
  });
});
