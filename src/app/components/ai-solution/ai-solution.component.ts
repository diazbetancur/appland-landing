import { Component, Input, OnChanges } from '@angular/core';
import { AiApplication, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';

@Component({
  selector: 'app-ai-solution',
  templateUrl: './ai-solution.component.html',
  styleUrls: ['./ai-solution.component.scss'],
  standalone: false,
})
export class AiSolutionComponent implements OnChanges {
  @Input() applications: readonly AiApplication[] = [];
  @Input() contactAction!: ConversionAction;
  resolvedContactAction!: ResolvedAction;

  ngOnChanges(): void {
    this.resolvedContactAction = resolveConversionAction(this.contactAction);
  }
}
