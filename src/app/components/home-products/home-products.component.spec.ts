import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../feature/pages/home/home-content.models';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { HomeProductsComponent } from './home-products.component';
import { provideTranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

const approvedProducts: readonly Product[] = [
  {
    id: 'approved-product',
    // Claves reales, no textos: asi la prueba recorre el camino de traduccion completo.
    nameKey: 'home.products.restaurants',
    summaryKey: 'home.products.title',
    publicationStatus: 'approved',
    inquiryAction: {
      id: 'inquiry',
      labelKey: 'Solicitar información',
      intent: 'inquiry',
      fallbackFragment: 'contacto',
    },
  },
];

describe('HomeProductsComponent', () => {
  let fixture: ComponentFixture<HomeProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HomeProductsComponent, HorizontalCarouselDirective],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(HomeProductsComponent);
  });

  it('renders no region content for an empty approved input', () => {
    fixture.componentInstance.products = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#productos-title'))).toBeNull();
  });

  it('renders the approved section heading', () => {
    fixture.componentInstance.products = approvedProducts;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.appland-eyebrow')).nativeElement.textContent.trim()).toBe('Productos');
    expect(fixture.debugElement.query(By.css('#productos-title')).nativeElement.textContent.trim()).toBe(
      'Soluciones listas para acelerar tu operación',
    );
  });

  it('renders an identifiable manual carousel and contact fallback for approved products', () => {
    fixture.componentInstance.products = approvedProducts;
    fixture.detectChanges();
    const track = fixture.debugElement.query(By.css('[aria-roledescription="carrusel"]'));
    expect(track.attributes['aria-labelledby']).toBe('productos-title');
    expect(track.attributes['tabindex']).toBe('0');
    expect(fixture.debugElement.queryAll(By.css('.products__controls button')).length).toBe(2);
    expect(fixture.debugElement.query(By.css('.product-card__action')).attributes['href']).toContain('#contacto');
    expect(fixture.nativeElement.textContent).toContain('1 de 1');
  });
});
