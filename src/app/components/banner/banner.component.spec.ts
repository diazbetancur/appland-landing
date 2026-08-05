import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BannerComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.hero);
    fixture.detectChanges();
  });

  it('renders the approved proposition as the only h1', () => {
    const headings = fixture.debugElement.queryAll(By.css('h1'));
    expect(headings.length).toBe(1);
    expect(headings[0].nativeElement.textContent.trim()).toBe(HOME_CONTENT.hero.title);
    expect(fixture.nativeElement.textContent).toContain(HOME_CONTENT.hero.subtitle);
  });

  it('routes meeting to contacto and services to servicios', () => {
    expect(fixture.debugElement.query(By.css('a[href*="#contacto"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('a[href*="#servicios"]'))).not.toBeNull();
  });

  it('keeps the CSS-only visual decorative', () => {
    expect(fixture.debugElement.query(By.css('.hero__visual')).attributes['aria-hidden']).toBe('true');
    expect(fixture.debugElement.query(By.css('.hero__visual img'))).toBeNull();
  });
});
