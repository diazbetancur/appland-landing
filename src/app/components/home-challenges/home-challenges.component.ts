import { Component, Input, OnChanges } from '@angular/core';
import { Challenge, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-challenges',
  templateUrl: './home-challenges.component.html',
  styleUrls: ['./home-challenges.component.scss'],
  imports: [RouterLink],
})
export class HomeChallengesComponent implements OnChanges {
  @Input() challenges: readonly Challenge[] = [];
  @Input() contactAction!: ConversionAction;

  resolvedContactAction!: ResolvedAction;

  ngOnChanges(): void {
    this.resolvedContactAction = this.contactAction
      ? resolveConversionAction(this.contactAction)
      : (undefined as unknown as ResolvedAction);
  }
}
