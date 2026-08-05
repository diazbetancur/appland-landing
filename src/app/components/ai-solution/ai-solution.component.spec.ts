import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { AiSolutionComponent } from './ai-solution.component';

describe('AiSolutionComponent', () => {
  let fixture: ComponentFixture<AiSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AiSolutionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AiSolutionComponent);
    fixture.componentRef.setInput('applications', HOME_CONTENT.aiApplications);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contact.meetingAction);
    fixture.detectChanges();
  });

  it('renders exactly the eight official AI applications', () => {
    const labels = fixture.debugElement
      .queryAll(By.css('.ai-card h3'))
      .map((item) => item.nativeElement.textContent.trim());
    expect(labels).toEqual(HOME_CONTENT.aiApplications.map((item) => item.label));
  });

  it('uses the approved contact fallback', () => {
    const action = fixture.debugElement.query(By.css('.ai__intro a'));
    expect(action.attributes['href']).toContain('#contacto');
  });
});
