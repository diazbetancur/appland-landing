import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService, TranslationObject } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly defaultLanguage = 'en';

  constructor(
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.setDefaultLanguage();
  }

  setDefaultLanguage() {
    const storedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];

    const lang = storedLang || (['en', 'es'].includes(browserLang) ? browserLang : this.defaultLanguage);

    this.translate.setFallbackLang(lang);
    this.translate.use(lang);

  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  getTranslations(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`assets/i18n/${lang}.json`);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang() ?? 'en';
  }
}
