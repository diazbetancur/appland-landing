import { Component, Input } from '@angular/core';
import { ApprovedDestination, CaseStudy } from '../../feature/pages/home/home-content.models';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-success-stories',
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.scss'],
  imports: [HorizontalCarouselDirective, TranslatePipe],
})
export class SuccessStoriesComponent {
  @Input() cases: readonly CaseStudy[] = [];

  destinationHref(destination: ApprovedDestination | undefined): string | null {
    return destination?.publicationStatus === 'approved' ? destination.value : null;
  }
}
