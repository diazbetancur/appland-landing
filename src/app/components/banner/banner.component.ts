import { Component, Input, OnChanges } from '@angular/core';
import { HeroContent, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [RouterLink],
})
export class BannerComponent implements OnChanges {
  @Input() content!: HeroContent;

  primaryAction!: ResolvedAction;
  servicesAction!: ResolvedAction;
  whatsappAction?: ResolvedAction;

  ngOnChanges(): void {
    this.primaryAction = resolveConversionAction(this.content.primaryAction);
    this.servicesAction = resolveConversionAction(this.content.servicesAction);
    this.whatsappAction = this.content.whatsappAction
      ? resolveConversionAction(this.content.whatsappAction)
      : undefined;
  }
}
