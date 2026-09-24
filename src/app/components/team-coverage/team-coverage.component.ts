import { Component, Input, OnChanges } from '@angular/core';
import { ConversionAction, CountryPresence, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-team-coverage',
  templateUrl: './team-coverage.component.html',
  styleUrls: ['./team-coverage.component.scss'],
  imports: [RouterLink, TranslatePipe],
})
export class TeamCoverageComponent implements OnChanges {
  @Input() countries: readonly CountryPresence[] = [];
  @Input() contactAction?: ConversionAction;

  resolvedContactAction?: ResolvedAction;

  ngOnChanges(): void {
    this.resolvedContactAction = this.contactAction ? resolveConversionAction(this.contactAction) : undefined;
  }
}
