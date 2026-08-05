import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeChallengesComponent } from './home-challenges.component';

describe('HomeChallengesComponent', () => {
  let fixture: ComponentFixture<HomeChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [HomeChallengesComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeChallengesComponent);
    fixture.componentRef.setInput('challenges', HOME_CONTENT.challenges);
    fixture.detectChanges();
  });

  it('renders five semantic challenge and response cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('article'));
    expect(cards.length).toBe(5);
    HOME_CONTENT.challenges.forEach((challenge) => {
      expect(fixture.nativeElement.textContent).toContain(challenge.problem);
      expect(fixture.nativeElement.textContent).toContain(challenge.response);
    });
    expect(fixture.debugElement.queryAll(By.css('h2')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('h3')).length).toBe(5);
  });
});
