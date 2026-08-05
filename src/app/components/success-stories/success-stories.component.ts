import { Component, Input } from '@angular/core';
import { ApprovedDestination, CaseStudy } from '../../feature/pages/home/home-content.models';

@Component({
    selector: 'app-success-stories',
    templateUrl: './success-stories.component.html',
    styleUrls: ['./success-stories.component.scss'],
    standalone: false
})
export class SuccessStoriesComponent {
  @Input() cases: readonly CaseStudy[] = [];

  destinationHref(destination: ApprovedDestination | undefined): string | null {
    return destination?.publicationStatus === 'approved' ? destination.value : null;
  }
}
