import { Component, Input, OnChanges } from '@angular/core';
import { AiApplication, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
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

  ngOnChanges(): void {
    this.resolvedContactAction = resolveConversionAction(this.contactAction);
  }
}
