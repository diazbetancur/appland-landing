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

  /**
   * El unico numero de la primera pantalla era "100 % enfocadas en tu negocio". Un porcentaje
   * funciona porque compara, y ese no tenia contra que compararse: ninguna empresa anuncia que
   * esta enfocada a medias. Ocupaba el lugar donde se espera informacion sin informar.
   *
   * La cifra que lo reemplaza no se invento: "mas de 13 anos de experiencia" ya estaba escrita
   * en el contenido, y aparecia recien en la septima pantalla entre otros seis puntos. Punto 07
   * de la auditoria UX/UI.
   */
  it('states a verifiable figure on the accent card', () => {
    const accentCard = fixture.debugElement.query(By.css('.hero__card--accent'));

    expect(accentCard).not.toBeNull();

    // Los dos parrafos se apilan como bloques, asi que se asserean por separado en vez de
    // concatenar su texto: entre ellos no hay nodo de texto que los separe.
    const lines = accentCard.queryAll(By.css('p')).map((paragraph) => paragraph.nativeElement.textContent.trim());

    expect(lines).toEqual(['+13', 'años de experiencia']);
  });

  /**
   * Los textos de fondo y las tarjetas del hero no pasaban por ningun archivo de contenido y
   * ninguna prueba los cubria. Desde el spec 009 salen de las traducciones.
   */
  it('renders the approved decorative and card copy', () => {
    const text = (selector: string) => fixture.debugElement.query(By.css(selector)).nativeElement.textContent.trim();
    expect(text('.hero__ghost--top')).toBe('TU VISIÓN');
    expect(text('.hero__ghost--bottom')).toBe('NUESTRA TECNOLOGÍA');
    expect(text('.hero__card-metric')).toBe('+13');
    expect(fixture.nativeElement.textContent).toContain('a la medida');
    expect(fixture.nativeElement.textContent).toContain('años de experiencia');
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
     * `clamp(1rem, 4vw, 4.5rem)` de la regla, entre 16 y 72 px. Anclado por la izquierda, ese
     * hueco lo decidia el largo del texto y se iba a negativo al desbordar.
     *
     * Solo aplica al de arriba. El de abajo va centrado sobre el equipo, que es la composicion
     * aprobada: anclarlo al mismo borde lo sacaba a un costado de la laptop, y el texto
     * decorativo va por encima y por debajo del equipo, no a su lado.
     */
    it('holds the top text at a fixed inset from the right edge', () => {
      const ghost = fixture.debugElement.query(By.css('.hero__ghost--top')).nativeElement;

      const inset = parseFloat(getComputedStyle(ghost).right);

      expect(inset).toBeGreaterThanOrEqual(16);
      expect(inset).toBeLessThanOrEqual(72);
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

    /**
     * Las dos frases quedan despejadas: "TU VISION" por encima del equipo y de las tarjetas,
     * "NUESTRA TECNOLOGIA" entera por debajo del equipo.
     *
     * El equipo crece hasta 1000 px de ancho, o sea 667 de alto sobre un hero que median 684:
     * ocupaban la misma banda y se comia las dos -- el 78% del ancho de la de abajo a 1440 y el
     * 86% a 1920, y a la de arriba le tapaba 96 px mas las tarjetas otros 46.
     *
     * El sitio lo abre el relleno de `.hero`, no el de `.hero__inner`, y esa distincion es la
     * prueba: el equipo se posiciona respecto al segundo, asi que mover el relleno alli lo empuja
     * con el y no se gana nada. Medido, hacian falta 36rem alli para lo que aqui hacen 13.
     *
     * Se mide el borde visible del equipo y no su caja: sus pixeles arrancan un 3.6% por debajo
     * del borde superior de la caja, y contra la caja esto pasaria con el texto ya montado.
     */
    describe('both decorative texts clear the laptop', () => {
      /** El viewport del iframe sobrevive a la prueba que lo cambia, asi que se devuelve. */
      const original = { width: window.innerWidth, height: window.innerHeight };
      afterEach(async () => {
        await page.viewport(original.width, original.height);
      });

      const rect = (selector: string): DOMRect =>
        fixture.debugElement.query(By.css(selector)).nativeElement.getBoundingClientRect();

      /** Debajo de 1024 px el equipo vuelve al flujo normal y no tapa nada. */
      for (const width of [1100, 1440, 1920]) {
        it(`leaves both phrases clear at ${width}px`, async () => {
          await page.viewport(width, 900);

          const hero = rect('.hero');
          const laptop = rect('.hero__laptop');
          const cards = rect('.hero__cards');
          const top = rect('.hero__ghost--top');
          const bottom = rect('.hero__ghost--bottom');
          const laptopInk = laptop.top + 0.036 * laptop.height;

          expect(
            Math.round(laptopInk - top.bottom),
            '"TU VISION" vuelve a quedar tras el equipo',
          ).toBeGreaterThanOrEqual(0);
          expect(
            Math.round(cards.top - top.bottom),
            '"TU VISION" vuelve a quedar tras las tarjetas',
          ).toBeGreaterThanOrEqual(0);
          expect(Math.round(top.top - hero.top), 'al texto de arriba se le corta la cabeza').toBeGreaterThanOrEqual(0);
          expect(
            Math.round(bottom.top - laptop.bottom),
            '"NUESTRA TECNOLOGIA" vuelve a quedar bajo el equipo',
          ).toBeGreaterThanOrEqual(0);
          expect(
            Math.round(hero.bottom - bottom.bottom),
            'la frase de abajo se apoya en el pie',
          ).toBeGreaterThanOrEqual(8);
        });
      }

      /**
       * El equipo conserva su tamano: es la pieza que da escala al encabezado. Se probo encogerlo
       * para que las dos frases lo esquivaran y se descarto, asi que la prueba fija el suelo.
       */
      it('keeps the laptop at full size', async () => {
        await page.viewport(1920, 900);

        expect(Math.round(rect('.hero__laptop').width)).toBeGreaterThanOrEqual(900);
      });
    });

    /**
     * El equipo es lo que da escala a la composicion, y el texto decorativo la sostiene por
     * encima y por debajo. Si alguien lo achica buscando que "entre completo", deja de cumplir
     * esa funcion: se probo y se descarto. Esta prueba fija el suelo.
     */
    it('keeps the decoration at backdrop scale, well above the headline', () => {
      const bodySize = (selector: string): number =>
        parseFloat(getComputedStyle(fixture.debugElement.query(By.css(selector)).nativeElement).fontSize);

      expect(bodySize('.hero__ghost--top')).toBeGreaterThan(bodySize('h1'));
      expect(bodySize('.hero__ghost--bottom')).toBeGreaterThan(bodySize('.hero__subtitle'));
    });

    /**
     * El tramo resaltado iba en 0.42 mientras su propia linea iba en 0.16: dos veces y media
     * mas presente que el texto que lo contiene, y el elemento de mas tinta del hero por
     * delante del titular. Se compara contra su linea y no contra un valor fijo, que es la
     * relacion que estaba rota.
     */
    it('keeps the decorative text and its highlight at texture level', () => {
      const alphaOf = (color: string): number => {
        const channels = color.match(/rgba?\(([^)]+)\)/);
        const parts = channels ? channels[1].split(',') : [];
        return parts.length === 4 ? parseFloat(parts[3]) : 1;
      };
      const ghost = fixture.debugElement.query(By.css('.hero__ghost--bottom')).nativeElement;
      const highlight = fixture.debugElement.query(By.css('.hero__ghost--bottom span')).nativeElement;

      const line = alphaOf(getComputedStyle(ghost).color);
      const accent = alphaOf(getComputedStyle(highlight).color);

      expect(line).toBeLessThanOrEqual(0.25);
      expect(accent).toBeLessThanOrEqual(line * 1.5);
    });

    /** El de arriba no lleva `color`: se pinta con un degradado recortado al trazo. */
    it('paints the top text as a faint gradient rather than solid ink', () => {
      const ghost = fixture.debugElement.query(By.css('.hero__ghost--top')).nativeElement;

      const alphas = [...getComputedStyle(ghost).backgroundImage.matchAll(/rgba\([^)]*?,\s*([\d.]+)\)/g)].map((match) =>
        parseFloat(match[1]),
      );

      expect(alphas.length).toBeGreaterThan(0);
      expect(Math.max(...alphas)).toBeLessThanOrEqual(0.2);
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
