import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CardTemplateComponent, ServiceDescription } from './card-template';

describe('CardTemplateComponent', () => {
  let fixture: ComponentFixture<CardTemplateComponent>;

  const entries: ServiceDescription[] = [
    { key: 'develop', image: 'develop.png', title: 'services.develop.title', description: 'services.develop.body' },
    { key: 'cloud', image: 'cloud.png', title: 'services.cloud.title', description: 'services.cloud.body' },
  ];

  const render = (services: ServiceDescription[]): void => {
    fixture.componentInstance.services = services;
    fixture.detectChanges();
  };

  // fixture.nativeElement esta tipado como any, y una llamada generica sobre any no acepta
  // argumentos de tipo. Este accesor le da un tipo concreto una sola vez.
  const host = (): HTMLElement => fixture.nativeElement;

  const cards = (): HTMLElement[] => Array.from(host().querySelectorAll<HTMLElement>('.service-card'));

  const iconAttribute = (attribute: string): (string | null)[] =>
    Array.from(host().querySelectorAll<HTMLImageElement>('.service-icon img')).map((img) =>
      img.getAttribute(attribute),
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [CardTemplateComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    fixture = TestBed.createComponent(CardTemplateComponent);
  });

  it('renders nothing when it receives no services', () => {
    render([]);

    expect(cards()).toHaveLength(0);
    expect(host().querySelector('.services-grid')).toBeTruthy();
  });

  it('renders one card per entry and tags each with its key', () => {
    render(entries);

    expect(cards()).toHaveLength(2);
    expect(cards().map((card) => card.getAttribute('data-key'))).toEqual(['develop', 'cloud']);
  });

  it('builds the icon source from the services asset folder and the entry image', () => {
    render(entries);

    expect(iconAttribute('src')).toEqual(['assets/images/services/develop.png', 'assets/images/services/cloud.png']);
  });

  it('keeps the icons decorative with an empty alt so they are skipped by assistive technology', () => {
    render(entries);

    expect(iconAttribute('alt')).toEqual(['', '']);
  });

  it('passes the title and description through translation instead of printing them raw', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {
      services: {
        develop: { title: 'Desarrollo', body: 'Soluciones a medida' },
        cloud: { title: 'Nube', body: 'Infraestructura elastica' },
      },
    });
    translate.use('es');

    render(entries);

    const titles = cards().map((card) => card.querySelector('.service-title')?.textContent?.trim());
    const descriptions = cards().map((card) => card.querySelector('.service-description')?.textContent?.trim());

    expect(titles).toEqual(['Desarrollo', 'Nube']);
    expect(descriptions).toEqual(['Soluciones a medida', 'Infraestructura elastica']);
  });

  it('re-renders when the input changes', () => {
    render(entries);
    expect(cards()).toHaveLength(2);

    render([entries[0]]);

    expect(cards()).toHaveLength(1);
    expect(cards()[0].getAttribute('data-key')).toBe('develop');
  });
});
