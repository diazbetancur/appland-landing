import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { TeamCoverageComponent } from './team-coverage.component';

describe('TeamCoverageComponent', () => {
  let fixture: ComponentFixture<TeamCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TeamCoverageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TeamCoverageComponent);
    fixture.componentRef.setInput('countries', HOME_CONTENT.countries);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contact.meetingAction);
    fixture.detectChanges();
  });

  it('renders the six official countries, including Guatemala, with their roles', () => {
    expect(fixture.debugElement.queryAll(By.css('.country-card')).length).toBe(6);
    HOME_CONTENT.countries.forEach((country) => {
      expect(fixture.nativeElement.textContent).toContain(country.name);
      expect(fixture.nativeElement.textContent).toContain(country.role);
    });
  });

  it('serves every flag from a local asset, never a remote flag service', () => {
    const flags = fixture.debugElement.queryAll(By.css('.country-card__flag img'));
    expect(flags.length).toBe(6);
    flags.forEach((flag, index) => {
      const src = flag.attributes['src']!;
      expect(src.startsWith('assets/')).toBeTrue();
      expect(src).not.toContain('//');
      expect(flag.attributes['alt']).toBe(HOME_CONTENT.countries[index].flag.alt);
    });
  });

  it('has no clocks, timers or remote images', () => {
    fixture.debugElement.queryAll(By.css('img')).forEach((image) => {
      expect(image.attributes['src']!.startsWith('assets/')).toBeTrue();
    });
    expect((fixture.componentInstance as unknown as { timeInterval?: unknown }).timeInterval).toBeUndefined();
    expect(fixture.nativeElement.textContent).not.toContain('24/7');
  });

  it('keeps the wave and sphere decorations out of the accessibility tree', () => {
    fixture.debugElement.queryAll(By.css('.team__wave, .team__sphere')).forEach((image) => {
      expect(image.attributes['alt']).toBe('');
      expect(image.attributes['aria-hidden']).toBe('true');
    });
  });

  it('resolves the contact action to the approved destination', () => {
    const cta = fixture.debugElement.query(By.css('.team__cta'));
    expect(cta.nativeElement.textContent.trim()).toContain('Conoce nuestro equipo');
    expect(cta.nativeElement.getAttribute('href')).toContain('#contacto');
  });
});
