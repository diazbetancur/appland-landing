import { Component } from '@angular/core';
import { HOME_CONTENT } from './feature/pages/home/home-content.config';
import { MenuComponent } from './components/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { HomeSectionDirective } from './shared/directives/home-section.directive';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuComponent, RouterOutlet, HomeSectionDirective, FooterComponent],
})
export class AppComponent {
  readonly navigation = HOME_CONTENT.navigation;
  readonly meetingAction = HOME_CONTENT.hero.primaryAction;
  readonly footerContent = HOME_CONTENT.footer;
}
