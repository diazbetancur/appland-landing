import { Component, HostListener } from '@angular/core';
import { LanguageService } from './components/shared/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'appland';

  constructor( private languageService: LanguageService) {
  }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
  }
}
