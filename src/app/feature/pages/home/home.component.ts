import { Component } from '@angular/core';
import { HOME_CONTENT, selectVisibleClients, selectVisibleProducts, selectVisibleCases } from './home-content.config';
import { HomeSectionDirective } from '../../../shared/directives/home-section.directive';
import { BannerComponent } from '../../../components/banner/banner.component';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { OurClientsComponent } from '../../../components/our-clients/our-clients.component';
import { HomeChallengesComponent } from '../../../components/home-challenges/home-challenges.component';
import { HomeServicesComponent } from '../../../components/home-services/home-services.component';
import { SuccessStoriesComponent } from '../../../components/success-stories/success-stories.component';
import { AiSolutionComponent } from '../../../components/ai-solution/ai-solution.component';
import { HomeProductsComponent } from '../../../components/home-products/home-products.component';
import { WhyComponent } from '../../../components/why/why.component';
import { TeamCoverageComponent } from '../../../components/team-coverage/team-coverage.component';
import { HomeCtaComponent } from '../../../components/home-cta/home-cta.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    HomeSectionDirective,
    BannerComponent,
    RevealOnScrollDirective,
    OurClientsComponent,
    HomeChallengesComponent,
    HomeServicesComponent,
    SuccessStoriesComponent,
    AiSolutionComponent,
    HomeProductsComponent,
    WhyComponent,
    TeamCoverageComponent,
    HomeCtaComponent,
  ],
})
export class HomeComponent {
  readonly content = HOME_CONTENT;
  readonly visibleClients = selectVisibleClients();
  readonly visibleCases = selectVisibleCases();
  readonly visibleProducts = selectVisibleProducts();
}
