import { Component, Input, OnChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AiApplication, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { ConversionActionResolver } from '../../shared/services/conversion-action-resolver.service';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-ai-solution',
  templateUrl: './ai-solution.component.html',
  styleUrls: ['./ai-solution.component.scss'],
  imports: [RouterLink, TranslatePipe],
})
export class AiSolutionComponent implements OnChanges {
  @Input() applications: readonly AiApplication[] = [];
  @Input() contactAction!: ConversionAction;
  resolvedContactAction!: ResolvedAction;

  private readonly actions = inject(ConversionActionResolver);

  constructor() {
    this.actions.languageChanges.pipe(takeUntilDestroyed()).subscribe(() => this.resolveActions());
  }

  ngOnChanges(): void {
    this.resolveActions();
  }

  private resolveActions(): void {
    this.resolvedContactAction = this.actions.resolve(this.contactAction);
  }
}
