import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { AiSolutionComponent } from './ai-solution.component';

describe('AiSolutionComponent', () => {
  let fixture: ComponentFixture<AiSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AiSolutionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AiSolutionComponent);
    fixture.componentRef.setInput('applications', HOME_CONTENT.aiApplications);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contact.meetingAction);
    fixture.detectChanges();
  });

  it('renders exactly the nine approved AI applications with their descriptions', () => {
    const labels = fixture.debugElement
      .queryAll(By.css('.ai-card h3'))
      .map((item) => item.nativeElement.textContent.trim());
    expect(labels).toEqual(HOME_CONTENT.aiApplications.map((item) => item.label));

    const descriptions = fixture.debugElement
      .queryAll(By.css('.ai-card p'))
      .map((item) => item.nativeElement.textContent.trim());
    expect(descriptions).toEqual(HOME_CONTENT.aiApplications.map((item) => item.description));
  });

  it('uses the approved contact fallback', () => {
    const action = fixture.debugElement.query(By.css('.ai__intro a'));
    expect(action.attributes['href']).toContain('#contacto');
  });

  it('keeps the wave and sphere decorations out of the accessibility tree', () => {
    fixture.debugElement.queryAll(By.css('.ai__wave, .ai__sphere')).forEach((image) => {
      expect(image.attributes['alt']).toBe('');
      expect(image.attributes['aria-hidden']).toBe('true');
    });
  });

  it('gives every application a decorative icon that adds no accessible text', () => {
    const icons = fixture.debugElement.queryAll(By.css('.ai-card__icon'));
    expect(icons.length).toBe(HOME_CONTENT.aiApplications.length);
    icons.forEach((icon) => {
      expect(icon.attributes['aria-hidden']).toBe('true');
      expect(icon.query(By.css('svg'))).not.toBeNull();
    });
  });

  it('exposes the applications as one semantic list', () => {
    expect(fixture.debugElement.queryAll(By.css('.ai__grid > li')).length).toBe(HOME_CONTENT.aiApplications.length);
  });
});
