import { Component, Input, OnChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConversionAction, CountryPresence, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { ConversionActionResolver } from '../../shared/services/conversion-action-resolver.service';
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

  private readonly actions = inject(ConversionActionResolver);

  constructor() {
    this.actions.languageChanges.pipe(takeUntilDestroyed()).subscribe(() => this.resolveActions());
  }

  ngOnChanges(): void {
    this.resolveActions();
  }

  private resolveActions(): void {
    this.resolvedContactAction = this.contactAction ? this.actions.resolve(this.contactAction) : undefined;
  }
}
