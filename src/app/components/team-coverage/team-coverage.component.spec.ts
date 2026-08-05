import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { TeamCoverageComponent } from './team-coverage.component';

describe('TeamCoverageComponent', () => {
  let fixture: ComponentFixture<TeamCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [TeamCoverageComponent] }).compileComponents();
    fixture = TestBed.createComponent(TeamCoverageComponent);
    fixture.componentInstance.countries = HOME_CONTENT.countries;
    fixture.detectChanges();
  });

  it('renders the six official countries, including Guatemala', () => {
    expect(fixture.debugElement.queryAll(By.css('.team__countries li')).length).toBe(6);
    HOME_CONTENT.countries.forEach((country) => expect(fixture.nativeElement.textContent).toContain(country.name));
  });

  it('has no clocks, flags, timers or remote images', () => {
    expect(fixture.debugElement.query(By.css('img'))).toBeNull();
    expect((fixture.componentInstance as unknown as { timeInterval?: unknown }).timeInterval).toBeUndefined();
    expect(fixture.nativeElement.textContent).not.toContain('24/7');
  });
});
