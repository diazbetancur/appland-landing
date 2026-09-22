import { page } from 'vitest/browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { BannerComponent } from './banner.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

describe('BannerComponent', () => {
  let fixture: ComponentFixture<BannerComponent>;
  /** Traduce una clave del contenido para comparar contra el texto que se pinta. */
  const t = (key: string): string => TestBed.inject(TranslateService).instant(key);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, BannerComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(BannerComponent);
    fixture.componentRef.setInput('content', HOME_CONTENT.hero);
    fixture.detectChanges();
  });

  it('renders the approved proposition as the only h1', () => {
    const headings = fixture.debugElement.queryAll(By.css('h1'));
    expect(headings.length).toBe(1);
    expect(headings[0].nativeElement.textContent.trim()).toBe(
      (t(HOME_CONTENT.hero.titleLeadKey) + t(HOME_CONTENT.hero.titleHighlightKey)).trim(),
    );
    expect(fixture.nativeElement.textContent).toContain(t(HOME_CONTENT.hero.subtitleKey));
  });

  it('routes meeting to contacto and services to servicios', () => {
    expect(fixture.debugElement.query(By.css('a[href*="#contacto"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('a[href*="#servicios"]'))).not.toBeNull();
  });

  // El resaltado dejo de deducirse buscando una palabra literal dentro del titulo: esa
  // busqueda devolvia cadena vacia en silencio cada vez que la copia dejaba de contenerla.
  // Ahora el fragmento en cian es un campo propio del contenido, y aqui se asegura que
  // nunca quede vacio y que el h1 siga leyendose como una sola frase.
  it('paints the approved trailing fragment of the title and never leaves it empty', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    const highlight = fixture.debugElement.query(By.css('.hero__highlight'));
    expect(highlight.nativeElement.textContent.trim()).toBe('con tecnología inteligente.');
    expect(t(HOME_CONTENT.hero.titleHighlightKey).length).toBeGreaterThan(0);
    expect(h1.nativeElement.textContent.trim()).toBe(
      (t(HOME_CONTENT.hero.titleLeadKey) + t(HOME_CONTENT.hero.titleHighlightKey)).trim(),
    );
  });

  it('keeps every hero visual decorative and out of the accessibility tree', () => {
    const decorativeImages = fixture.debugElement.queryAll(By.css('.hero img'));
    expect(decorativeImages.length).toBeGreaterThan(0);
    decorativeImages.forEach((image) => {
      expect(image.attributes['alt']).toBe('');
      expect(image.attributes['aria-hidden']).toBe('true');
    });
    fixture.debugElement.queryAll(By.css('.hero__ghost')).forEach((ghost) => {
      expect(ghost.attributes['aria-hidden']).toBe('true');
    });
  });

  it('exposes exactly two hero conversion actions', () => {
    expect(fixture.debugElement.queryAll(By.css('.hero__actions a')).length).toBe(2);
    expect(fixture.debugElement.query(By.css('.hero__actions a[href*="wa.me"]'))).toBeNull();
  });

  it('does not render the capabilities list of icons/labels below the actions', () => {
    expect(fixture.debugElement.query(By.css('.hero__capabilities'))).toBeNull();
  });

  it('states the approved business-focus claim on the accent card', () => {
    const accentCard = fixture.debugElement.query(By.css('.hero__card--accent'));

    expect(accentCard).not.toBeNull();

    // Los dos parrafos se apilan como bloques, asi que se asserean por separado en vez de
    // concatenar su texto: entre ellos no hay nodo de texto que los separe.
    const lines = accentCard.queryAll(By.css('p')).map((paragraph) => paragraph.nativeElement.textContent.trim());

    expect(lines).toEqual(['100%', 'enfocadas en tu negocio']);
  });

  /**
   * Los textos de fondo y las tarjetas del hero no pasaban por ningun archivo de contenido y
   * ninguna prueba los cubria. Desde el spec 009 salen de las traducciones.
   */
  it('renders the approved decorative and card copy', () => {
    const text = (selector: string) => fixture.debugElement.query(By.css(selector)).nativeElement.textContent.trim();
    expect(text('.hero__ghost--top')).toBe('TU VISIÓN');
    expect(text('.hero__ghost--bottom')).toBe('NUESTRA TECNOLOGÍA');
    expect(text('.hero__card-metric')).toBe('100%');
    expect(fixture.nativeElement.textContent).toContain('a la medida');
    expect(fixture.nativeElement.textContent).toContain('enfocadas en tu negocio');
  });

  /** El tramo resaltado del texto de fondo se pinta con un span; si se pierde, se pierde el color. */
  it('keeps the highlighted fragment of the bottom decorative text', () => {
    const highlighted = fixture.debugElement.query(By.css('.hero__ghost--bottom span'));
    expect(highlighted).not.toBeNull();
    expect(highlighted.nativeElement.textContent.trim()).toBe('TECNOLOGÍA');
  });

  /**
   * Guardia del arreglo del texto de fondo.
   *
   * Estaba anclado en `left: 45%` con `white-space: nowrap` dentro de un `.hero` con
   * `overflow: hidden`, asi que su ancho dependia del largo de la copia y su origen era fijo:
   * cuanto mas larga la frase, mas se perdia por el filo derecho. En espanol quedaba justo al
   * borde y en ingles, con "YOUR VISION", se perdian 136 px a 1440.
   *
   * Estas pruebas corren en Chromium, asi que se comprueba la geometria y no solo la clase.
   */
  describe('decorative background text', () => {
    /**
     * `getComputedStyle` resuelve `auto` al valor usado, asi que no sirve para distinguir el
     * anclaje. Lo que si lo distingue es la magnitud: anclado por la derecha, el hueco es el
     * `clamp(0.75rem, 2vw, 2.5rem)` de la regla, entre 12 y 40 px. Anclado por la izquierda,
     * ese hueco lo decidia el largo del texto y se iba a negativo al desbordar.
     */
    it('holds the top text at a small fixed inset from the right edge', () => {
      const ghost = fixture.debugElement.query(By.css('.hero__ghost--top')).nativeElement;

      const inset = parseFloat(getComputedStyle(ghost).right);

      expect(inset).toBeGreaterThanOrEqual(12);
      expect(inset).toBeLessThanOrEqual(40);
    });

    it('keeps both decorative texts inside the hero', () => {
      const hero = fixture.debugElement.query(By.css('.hero')).nativeElement.getBoundingClientRect();

      for (const selector of ['.hero__ghost--top', '.hero__ghost--bottom']) {
        const box = fixture.debugElement.query(By.css(selector)).nativeElement.getBoundingClientRect();
        expect(Math.round(box.right), `${selector} se sale por la derecha`).toBeLessThanOrEqual(Math.round(hero.right));
        expect(Math.round(box.left), `${selector} se sale por la izquierda`).toBeGreaterThanOrEqual(
          Math.round(hero.left),
        );
      }
    });

    /**
     * El recorte solo aparecia en pantallas anchas, y ninguna prueba lo miraba.
     *
     * El viewport por defecto de Vitest en modo navegador es 414x896, asi que todo este bloque
     * corria a ancho de telefono, donde la regla de `@media (min-width: 1024px)` que provoca el
     * fallo ni siquiera se aplica. Las pruebas de arriba estaban en verde con el texto
     * decapitado en produccion.
     *
     * El texto se ancla al centro optico de la laptop para que esta le tape el cuarto inferior
     * de las letras, pero nada lo frenaba contra el borde superior del `.hero`, que recorta con
     * `overflow: hidden`. Pasados los ~1600 px la laptop y la tipografia tocan el techo de sus
     * `clamp()` mientras el alto del hero deja de crecer, el desplazamiento calculado lo saca
     * por arriba y se perdian 22 px de las letras: a "TU VISION" le faltaba la cabeza y la
     * tilde de la O desaparecia entera.
     *
     * Se comprueban dos anchos del rango afectado, 1920 y 2560, porque el fallo depende
     * de que los `clamp()` esten saturados y no de un ancho concreto.
     */
    describe('on wide screens', () => {
      /** El viewport del iframe sobrevive a la prueba que lo cambia, asi que se devuelve. */
      const original = { width: window.innerWidth, height: window.innerHeight };
      afterEach(async () => {
        await page.viewport(original.width, original.height);
      });

      for (const width of [1920, 2560]) {
        it(`keeps the top decorative text inside the hero at ${width}px`, async () => {
          await page.viewport(width, 900);

          const hero = fixture.debugElement.query(By.css('.hero')).nativeElement.getBoundingClientRect();
          const ghost = fixture.debugElement.query(By.css('.hero__ghost--top')).nativeElement.getBoundingClientRect();

          expect(Math.round(ghost.top), 'el texto decorativo se sale por arriba').toBeGreaterThanOrEqual(
            Math.round(hero.top),
          );
        });
      }
    });
  });

  /**
   * El resaltado tiene que distinguirse del resto del titular.
   *
   * Comprobar que el `<span>` existe con su palabra no alcanza, y el spec 009 lo demostro: al
   * pasar el titular a `[innerHTML]`, el nodo deja de recibir el atributo de encapsulacion de
   * Angular, los estilos del componente dejan de aplicarle y el resaltado quedaba en el color
   * del titular. El span seguia ahi, con su texto, y las pruebas en verde.
   *
   * Se compara contra el color del propio titular en vez de contra un valor fijo, para que la
   * prueba siga valiendo si cambia la paleta.
   */
  it('paints the highlighted fragment in its own colour', () => {
    const heading = fixture.debugElement.query(By.css('.hero__ghost--bottom')).nativeElement;
    const highlighted = fixture.debugElement.query(By.css('.hero__ghost--bottom span')).nativeElement;

    expect(getComputedStyle(highlighted).color).not.toBe(getComputedStyle(heading).color);
  });
});
