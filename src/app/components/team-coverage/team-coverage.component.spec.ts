import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { TeamCoverageComponent } from './team-coverage.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

describe('TeamCoverageComponent', () => {
  let fixture: ComponentFixture<TeamCoverageComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TeamCoverageComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    translate = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(TeamCoverageComponent);
    fixture.componentRef.setInput('countries', HOME_CONTENT.countries);
    fixture.componentRef.setInput('contactAction', HOME_CONTENT.contactAction);
    fixture.detectChanges();
  });

  it('renders every approved country by name, without the role text under each card', () => {
    expect(fixture.debugElement.queryAll(By.css('.country-card')).length).toBe(HOME_CONTENT.countries.length);
    HOME_CONTENT.countries.forEach((country) => {
      expect(fixture.nativeElement.textContent).toContain(translate.instant(country.nameKey));
    });
  });

  it('serves every flag from a local asset, never a remote flag service', () => {
    const flags = fixture.debugElement.queryAll(By.css('.country-card__flag img'));
    expect(flags.length).toBe(HOME_CONTENT.countries.length);
    flags.forEach((flag, index) => {
      const src = flag.attributes['src']!;
      expect(src.startsWith('assets/')).toBe(true);
      expect(src).not.toContain('//');
      // Todas las banderas comparten la clave y la plantilla le pasa el pais ya traducido.
      const country = HOME_CONTENT.countries[index];
      expect(flag.attributes['alt']).toBe(`Bandera de ${translate.instant(country.nameKey)}`);
    });
  });

  it('has no clocks, timers or remote images', () => {
    fixture.debugElement.queryAll(By.css('img')).forEach((image) => {
      expect(image.attributes['src']!.startsWith('assets/')).toBe(true);
    });
    expect(
      (
        fixture.componentInstance as unknown as {
          timeInterval?: unknown;
        }
      ).timeInterval,
    ).toBeUndefined();
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

  it('renders the approved heading, lead and call to action', () => {
    const heading = fixture.debugElement.query(By.css('#equipo-global-title'));
    expect(heading.nativeElement.textContent.trim()).toBe('Equipo distribuido internacionalmente');
    expect(heading.query(By.css('.team__highlight')).nativeElement.textContent.trim()).toBe('internacionalmente');
    expect(fixture.debugElement.query(By.css('.team__lead')).nativeElement.textContent.trim()).toBe(
      'Talento especializado trabajando desde diferentes países para ofrecer cobertura en múltiples zonas horarias.',
    );
    expect(fixture.nativeElement.textContent).toContain('Conoce nuestro equipo');
  });
});
