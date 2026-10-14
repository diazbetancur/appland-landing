import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from '../utils/conversion-destination.util';

/**
 * Resuelve un boton de conversion con su mensaje de WhatsApp ya traducido.
 *
 * `resolveConversionAction` es pura y recibe el mensaje resuelto; aqui se traduce la clave
 * `approvedMessageKey` con el idioma activo. Desde la ronda 5 todos los botones de contacto
 * abren WhatsApp, no solo el de la seccion de contacto, y cada componente necesitaba esa misma
 * traduccion.
 *
 * `instant()` devuelve el texto del idioma de ese momento, asi que quien la usa debe volver a
 * resolver en `languageChanges`: si no, el `href` se queda con el mensaje del primer render
 * mientras la etiqueta del boton, que pinta el pipe, si cambia de idioma.
 */
@Injectable({ providedIn: 'root' })
export class ConversionActionResolver {
  private readonly translate = inject(TranslateService);

  readonly languageChanges = this.translate.onLangChange;

  resolve(action: ConversionAction): ResolvedAction {
    const key = action.approvedMessageKey;
    return resolveConversionAction(action, key ? this.translate.instant(key) : undefined);
  }
}
