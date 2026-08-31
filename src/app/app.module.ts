import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { A11yModule } from '@angular/cdk/a11y';
import { provideTranslateService, TranslatePipe } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { AiSolutionComponent } from './components/ai-solution/ai-solution.component';
import { BannerComponent } from './components/banner/banner.component';
import { ChooseUsComponent } from './components/choose-us/choose-us.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { OurClientsComponent } from './components/our-clients/our-clients.component';
import { OurTeamComponent } from './components/our-team/our-team.component';
import { CardTemplateComponent } from './components/service/card-template/card-template';
import { ServiceComponent } from './components/service/service.component';
import { SuccessStoriesComponent } from './components/success-stories/success-stories.component';
import { TeamCoverageComponent } from './components/team-coverage/team-coverage.component';
import { WhyComponent } from './components/why/why.component';
import { HomeComponent } from './feature/pages/home/home.component';
import { CountUpDirective } from './shared/directives/count-up.directive';
import { HomeSectionDirective } from './shared/directives/home-section.directive';
import { HomeChallengesComponent } from './components/home-challenges/home-challenges.component';
import { HomeServicesComponent } from './components/home-services/home-services.component';
import { HorizontalCarouselDirective } from './shared/directives/horizontal-carousel.directive';
import { HomeProductsComponent } from './components/home-products/home-products.component';
import { HomeCtaComponent } from './components/home-cta/home-cta.component';
import { RevealOnScrollDirective } from './shared/directives/reveal-on-scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BannerComponent,
    ServiceComponent,
    AboutComponent,
    WhyComponent,
    FooterComponent,
    HomeComponent,
    OurClientsComponent,
    OurTeamComponent,
    AiSolutionComponent,
    SuccessStoriesComponent,
    TeamCoverageComponent,
    CardTemplateComponent,
    ChooseUsComponent,
    CountUpDirective,
    HomeSectionDirective,
    HomeChallengesComponent,
    HomeServicesComponent,
    HorizontalCarouselDirective,
    HomeProductsComponent,
    HomeCtaComponent,
    RevealOnScrollDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, A11yModule, TranslatePipe],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
      fallbackLang: 'es',
      lang: 'es',
      loader: provideTranslateHttpLoader(),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
