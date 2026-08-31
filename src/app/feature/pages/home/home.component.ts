import { Component } from '@angular/core';
import { HOME_CONTENT, selectVisibleClients, selectVisibleProducts, selectVisibleCases } from './home-content.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  readonly content = HOME_CONTENT;
  readonly visibleClients = selectVisibleClients();
  readonly visibleCases = selectVisibleCases();
  readonly visibleProducts = selectVisibleProducts();
}
