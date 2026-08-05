import { Component, Input } from '@angular/core';
import { CountryPresence } from '../../feature/pages/home/home-content.models';

@Component({
    selector: 'app-team-coverage',
    templateUrl: './team-coverage.component.html',
    styleUrls: ['./team-coverage.component.scss'],
    standalone: false
})
export class TeamCoverageComponent {
  @Input() countries: readonly CountryPresence[] = [];
}
