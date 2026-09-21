import { Component, Input, OnChanges, inject } from '@angular/core';
import { ContactContent, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { destinationHref, resolveConversionAction } from '../../shared/utils/conversion-destination.util';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-cta',
  templateUrl: './home-cta.component.html',
  styleUrls: ['./home-cta.component.scss'],
  imports: [RouterLink, TranslatePipe],
})
export class HomeCtaComponent implements OnChanges {
  @Input() content!: ContactContent;

  meetingAction!: ResolvedAction;
  whatsappAction!: ResolvedAction;
  readonly destinationHref = destinationHref;

  private readonly translate = inject(TranslateService);

  ngOnChanges(): void {
    this.meetingAction = resolveConversionAction(this.content.meetingAction, this.approvedMessage());
    this.whatsappAction = resolveConversionAction(this.content.whatsappAction);
  }

  /**
   * El boton de esta seccion abre WhatsApp con un mensaje precargado, y es lo unico que lo
   * distingue del boton de WhatsApp contiguo, que abre el chat vacio a proposito.
   */
  private approvedMessage(): string | undefined {
    const key = this.content.meetingAction.approvedMessageKey;
    return key ? this.translate.instant(key) : undefined;
  }
}
