import { Component, Input } from '@angular/core';
import { Product, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';

@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss'],
  standalone: false,
})
export class HomeProductsComponent {
  @Input() products: readonly Product[] = [];

  inquiryAction(product: Product): ResolvedAction {
    return resolveConversionAction(product.inquiryAction);
  }
}
