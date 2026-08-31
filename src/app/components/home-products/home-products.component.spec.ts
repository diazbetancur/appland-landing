import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../feature/pages/home/home-content.models';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { HomeProductsComponent } from './home-products.component';

const approvedProducts: readonly Product[] = [
  {
    id: 'approved-product',
    name: 'Producto aprobado',
    summary: 'Contenido aprobado',
    publicationStatus: 'approved',
    inquiryAction: {
      id: 'inquiry',
      label: 'Solicitar información',
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
    }).compileComponents();
    fixture = TestBed.createComponent(HomeProductsComponent);
  });

  it('renders no region content for an empty approved input', () => {
    fixture.componentInstance.products = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#productos-title'))).toBeNull();
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
