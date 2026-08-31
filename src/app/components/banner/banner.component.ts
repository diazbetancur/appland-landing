import { Component, Input, OnChanges } from '@angular/core';
import { HeroContent, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../../shared/utils/conversion-destination.util';

const TITLE_HIGHLIGHT_FROM = 'soluciones';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: false,
})
export class BannerComponent implements OnChanges {
  @Input() content!: HeroContent;

  primaryAction!: ResolvedAction;
  servicesAction!: ResolvedAction;
  whatsappAction?: ResolvedAction;

  titleBefore = '';
  titleHighlight = '';

  ngOnChanges(): void {
    this.primaryAction = resolveConversionAction(this.content.primaryAction);
    this.servicesAction = resolveConversionAction(this.content.servicesAction);
    this.whatsappAction = this.content.whatsappAction
      ? resolveConversionAction(this.content.whatsappAction)
      : undefined;

    const title = this.content.title;
    const index = title.toLowerCase().indexOf(TITLE_HIGHLIGHT_FROM);
    if (index >= 0) {
      this.titleBefore = title.slice(0, index);
      this.titleHighlight = title.slice(index);
    } else {
      this.titleBefore = title;
      this.titleHighlight = '';
    }
  }
}
