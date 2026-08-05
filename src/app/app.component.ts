import { Component } from '@angular/core';
import { HOME_CONTENT } from './feature/pages/home/home-content.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  readonly navigation = HOME_CONTENT.navigation;
  readonly meetingAction = HOME_CONTENT.hero.primaryAction;
  readonly footerContent = HOME_CONTENT.footer;
}
