import { ConversionAction } from '../../feature/pages/home/home-content.models';
import { resolveConversionAction } from './conversion-destination.util';

describe('resolveConversionAction', () => {
  it('uses an approved meeting URL safely', () => {
    const action: ConversionAction = {
      id: 'meeting',
      labelKey: 'Agendar',
      intent: 'meeting',
      fallbackFragment: 'contacto',
      destination: {
        kind: 'external',
        value: 'https://example.com/calendar',
        publicationStatus: 'approved',
        newContext: true,
      },
    };
    expect(resolveConversionAction(action)).toEqual({
      kind: 'href',
      href: 'https://example.com/calendar',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });

  it('falls back to contacto without an approved meeting URL', () => {
    expect(
      resolveConversionAction({
        id: 'meeting',
        labelKey: 'home.actions.meeting',
        intent: 'meeting',
        fallbackFragment: 'contacto',
      }),
    ).toEqual({ kind: 'router', fragment: 'contacto' });
  });

  it('uses the official WhatsApp number without inventing a message', () => {
    expect(resolveConversionAction({ id: 'wa', labelKey: 'home.actions.whatsapp', intent: 'whatsapp' }).href).toBe(
      'https://wa.me/50433349211',
    );
  });

  it('encodes only an explicitly approved WhatsApp message', () => {
    // El mensaje llega ya traducido: la clave la resuelve el componente, que tiene acceso al
    // servicio, y esta funcion es pura.
    const resolved = resolveConversionAction(
      {
        id: 'wa',
        labelKey: 'home.actions.whatsapp',
        intent: 'whatsapp',
        approvedMessageKey: 'home.actions.whatsappMeetingMessage',
      },
      'Hola APPLAND',
    );
    expect(resolved.href).toBe('https://wa.me/50433349211?text=Hola%20APPLAND');
  });

  it('uses contacto for a product inquiry without an approved destination', () => {
    expect(
      resolveConversionAction({
        id: 'product',
        labelKey: 'Solicitar información',
        intent: 'inquiry',
        fallbackFragment: 'contacto',
      }),
    ).toEqual({ kind: 'router', fragment: 'contacto' });
  });
});
