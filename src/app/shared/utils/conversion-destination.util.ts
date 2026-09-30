import { environment } from '../../../environments/environment';
import { ApprovedDestination, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';

/** Enlace al chat de WhatsApp oficial, con el mensaje precargado si viene uno. */
export function whatsappHref(message?: string): string {
  const text = message?.trim();
  const suffix = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${environment.whatsappNumber}${suffix}`;
}

function isApproved(destination: ApprovedDestination | undefined): destination is ApprovedDestination {
  return Boolean(destination?.publicationStatus === 'approved' && destination.value.trim());
}

function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function fragmentAction(fragment: ConversionAction['fallbackFragment']): ResolvedAction {
  return { kind: 'router', fragment: fragment ?? 'contacto' };
}

/**
 * @param approvedMessage Mensaje ya traducido que se precarga en WhatsApp.
 *
 * Se recibe resuelto en vez de leerse aqui porque esta es una funcion pura, sin inyeccion: la
 * clave vive en `action.approvedMessageKey` y la traduce el componente, que si tiene acceso al
 * servicio. Quien abre el chat desde la version inglesa del sitio no deberia encontrarse un
 * mensaje en espanol ya escrito.
 */
export function resolveConversionAction(action: ConversionAction, approvedMessage?: string): ResolvedAction {
  if (action.intent === 'whatsapp') {
    return {
      kind: 'href',
      href: whatsappHref(approvedMessage),
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  if (action.intent === 'services') {
    return fragmentAction('servicios');
  }

  if (isApproved(action.destination)) {
    if (action.destination.kind === 'external' && isSafeExternalUrl(action.destination.value)) {
      return {
        kind: 'href',
        href: action.destination.value,
        target: action.destination.newContext ? '_blank' : undefined,
        rel: action.destination.newContext ? 'noopener noreferrer' : undefined,
      };
    }
    if (action.destination.kind === 'fragment') {
      return fragmentAction(action.destination.value as ConversionAction['fallbackFragment']);
    }
  }

  return fragmentAction(action.fallbackFragment);
}

export function destinationHref(destination: ApprovedDestination): string | null {
  if (!isApproved(destination)) {
    return null;
  }
  if (destination.kind === 'email') {
    return `mailto:${destination.value}`;
  }
  if (destination.kind === 'phone') {
    return `tel:${destination.value}`;
  }
  if (destination.kind === 'external' && isSafeExternalUrl(destination.value)) {
    return destination.value;
  }
  return null;
}
