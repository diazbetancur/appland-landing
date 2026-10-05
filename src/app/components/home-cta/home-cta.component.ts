import { Component, DestroyRef, Input, OnChanges, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class HomeCtaComponent implements OnInit, OnChanges {
  @Input() content!: ContactContent;

  meetingAction!: ResolvedAction;
  readonly destinationHref = destinationHref;

  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * El enlace se rehace cuando cambia el idioma, no solo cuando cambia el contenido.
   *
   * El mensaje precargado se resuelve con `instant()`, que devuelve el texto del idioma activo
   * en ese momento, y antes solo se llamaba desde `ngOnChanges`. Ese gancho se dispara cuando
   * cambia `@Input() content`, y elegir otro idioma no lo toca: el `href` quedaba congelado con
   * el idioma del primer render mientras la etiqueta del boton, que la pinta el pipe, si
   * cambiaba. Quien entraba en espanol y pasaba a ingles abria WhatsApp con un mensaje en
   * espanol ya escrito debajo de un boton en ingles.
   */
  ngOnInit(): void {
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.resolveMeetingAction());
  }

  ngOnChanges(): void {
    this.resolveMeetingAction();
  }

  private resolveMeetingAction(): void {
    this.meetingAction = resolveConversionAction(this.content.meetingAction, this.approvedMessage());
  }

  /**
   * El unico boton de la seccion abre WhatsApp con este mensaje ya escrito, que es lo que
   * conserva la intencion de reunion que anuncia su etiqueta.
   */
  private approvedMessage(): string | undefined {
    const key = this.content.meetingAction.approvedMessageKey;
    return key ? this.translate.instant(key) : undefined;
  }
}
