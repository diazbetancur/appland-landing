import { Component, Input } from '@angular/core';
import { Product, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss'],
  imports: [HorizontalCarouselDirective, RouterLink],
})
export class HomeProductsComponent {
  @Input() products: readonly Product[] = [];

  inquiryAction(product: Product): ResolvedAction {
    return resolveConversionAction(product.inquiryAction);
  }
}
