import { Component, Input, OnChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeroContent, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { ConversionActionResolver } from '../../shared/services/conversion-action-resolver.service';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [RouterLink, TranslatePipe],
})
export class BannerComponent implements OnChanges {
  @Input() content!: HeroContent;

  primaryAction!: ResolvedAction;
  servicesAction!: ResolvedAction;
  whatsappAction?: ResolvedAction;

  private readonly actions = inject(ConversionActionResolver);

  constructor() {
    this.actions.languageChanges.pipe(takeUntilDestroyed()).subscribe(() => this.resolveActions());
  }

  ngOnChanges(): void {
    this.resolveActions();
  }

  private resolveActions(): void {
    this.primaryAction = this.actions.resolve(this.content.primaryAction);
    this.servicesAction = this.actions.resolve(this.content.servicesAction);
    this.whatsappAction = this.content.whatsappAction ? this.actions.resolve(this.content.whatsappAction) : undefined;
  }
}
