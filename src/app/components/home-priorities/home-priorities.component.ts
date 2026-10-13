import { Component, Input, OnChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusinessPriority, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { SERVICE_QUERY_PARAM } from '../../feature/pages/home/home-content.config';
import { ConversionActionResolver } from '../../shared/services/conversion-action-resolver.service';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * "Prioridades del negocio": cuatro formas de trabajar, cada una enlazada a su servicio.
 *
 * Reemplaza a la seccion de desafios desde la ronda 5, con el mismo mensaje de las
 * presentaciones US & International. Conserva el ancla `desafios` para no romper enlaces ni el
 * indicador de la barra.
 */
@Component({
  selector: 'app-home-priorities',
  templateUrl: './home-priorities.component.html',
  styleUrls: ['./home-priorities.component.scss'],
  imports: [RouterLink, TranslatePipe],
})
export class HomePrioritiesComponent implements OnChanges {
  @Input() priorities: readonly BusinessPriority[] = [];
  @Input() contactAction?: ConversionAction;

  resolvedContactAction?: ResolvedAction;

  private readonly actions = inject(ConversionActionResolver);

  constructor() {
    this.actions.languageChanges.pipe(takeUntilDestroyed()).subscribe(() => this.resolveActions());
  }

  ngOnChanges(): void {
    this.resolveActions();
  }

  /** Abre la pestana del servicio en la seccion de servicios, como los enlaces del pie. */
  serviceParams(priority: BusinessPriority): Record<string, string> {
    return { [SERVICE_QUERY_PARAM]: priority.serviceId };
  }

  private resolveActions(): void {
    this.resolvedContactAction = this.contactAction ? this.actions.resolve(this.contactAction) : undefined;
  }
}
