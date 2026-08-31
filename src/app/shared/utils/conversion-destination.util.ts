import { ApprovedDestination, ConversionAction, ResolvedAction } from '../../feature/pages/home/home-content.models';

const OFFICIAL_WHATSAPP_NUMBER = '50433949211';

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

export function resolveConversionAction(action: ConversionAction): ResolvedAction {
  if (action.intent === 'whatsapp') {
    const message = action.approvedMessage?.trim();
    const suffix = message ? `?text=${encodeURIComponent(message)}` : '';
    return {
      kind: 'href',
      href: `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}${suffix}`,
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
