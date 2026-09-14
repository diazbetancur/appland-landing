import { Component, Input, OnChanges } from '@angular/core';
import { Benefit, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-why',
  templateUrl: './why.component.html',
  styleUrls: ['./why.component.scss'],
  imports: [RouterLink],
})
export class WhyComponent implements OnChanges {
  @Input() benefits: readonly Benefit[] = [];
  @Input() contactAction?: ConversionAction;

  resolvedContactAction?: ResolvedAction;

  ngOnChanges(): void {
    this.resolvedContactAction = this.contactAction ? resolveConversionAction(this.contactAction) : undefined;
  }
}
