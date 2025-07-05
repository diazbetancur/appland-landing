import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
