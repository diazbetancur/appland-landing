import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { useTranslations } from '../i18n/translations.testing';
import { ConversionActionResolver } from './conversion-action-resolver.service';

describe('ConversionActionResolver', () => {
  let resolver: ConversionActionResolver;

  const href = (message: string): string =>
    `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(message)}`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    resolver = TestBed.inject(ConversionActionResolver);
  });

  it('preloads the WhatsApp message in the active language', async () => {
    expect(resolver.resolve(HOME_CONTENT.contactAction)).toMatchObject({
      kind: 'href',
      href: href('Hola, quiero agendar una reunión.'),
    });

    // Quien cambia a ingles no deberia abrir el chat con un mensaje en espanol ya escrito.
    await useTranslations('en');
    expect(resolver.resolve(HOME_CONTENT.contactAction)).toMatchObject({
      kind: 'href',
      href: href('Hello, I would like to book a meeting.'),
    });
  });

  it('announces language changes so callers can resolve again', async () => {
    const changes = vi.fn();
    const subscription = resolver.languageChanges.subscribe(changes);
    await useTranslations('en');
    subscription.unsubscribe();

    expect(changes).toHaveBeenCalledTimes(1);
  });
});
