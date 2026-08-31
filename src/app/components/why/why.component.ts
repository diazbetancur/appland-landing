import { Component, Input, OnChanges } from '@angular/core';
import { Benefit, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';

@Component({
  selector: 'app-why',
  templateUrl: './why.component.html',
  styleUrls: ['./why.component.scss'],
  standalone: false,
})
export class WhyComponent implements OnChanges {
  @Input() benefits: readonly Benefit[] = [];
  @Input() contactAction?: ConversionAction;

  resolvedContactAction?: ResolvedAction;

  ngOnChanges(): void {
    this.resolvedContactAction = this.contactAction ? resolveConversionAction(this.contactAction) : undefined;
  }
}
