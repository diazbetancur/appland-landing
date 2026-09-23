import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { page } from 'vitest/browser';
import { Client } from '../../feature/pages/home/home-content.models';
import { selectVisibleClients } from '../../feature/pages/home/home-content.config';
import { CLIENTS_MARQUEE_VIEWPORT, OurClientsComponent, REDUCED_MOTION_QUERY } from './our-clients.component';
import { provideTranslateService } from '@ngx-translate/core';
import { useTranslations } from '../../shared/i18n/translations.testing';

const client: Client = {
  id: 'approved-client',
  name: 'Cliente aprobado',
  publicationStatus: 'approved',
  logo: {
    src: 'assets/images/home/clients/approved.png',
    width: 200,
    height: 80,
    altKey: 'Logo de Cliente aprobado',
    decorative: false,
    publicationStatus: 'approved',
  },
};

interface MediaQueryStub {
  readonly query: MediaQueryList;
  emit(matches: boolean): void;
}

function mediaQueryStub(matches: boolean): MediaQueryStub {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  return {
    query: {
      matches,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
    } as unknown as MediaQueryList,
    emit(next: boolean) {
      listeners.forEach((listener) => listener({ matches: next } as MediaQueryListEvent));
    },
  };
}

/**
 * El ancho real de la ventana de pruebas decidiria por si solo si la marquesina corre, asi que
 * cada caso declara el entorno que quiere medir en lugar de heredarlo. Las consultas se comparan
 * contra las constantes que exporta el componente: un cambio de umbral rompe la prueba en vez de
 * dejarla midiendo otra cosa en silencio.
 */
function useMedia({ narrow, reducedMotion }: { narrow: boolean; reducedMotion: boolean }): MediaQueryStub {
  const viewport = mediaQueryStub(narrow);
  const motion = mediaQueryStub(reducedMotion);
  const real = window.matchMedia.bind(window);
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
    if (query === CLIENTS_MARQUEE_VIEWPORT) {
      return viewport.query;
    }
    if (query === REDUCED_MOTION_QUERY) {
      return motion.query;
    }
    return real(query);
  });
  return viewport;
}

describe('OurClientsComponent', () => {
  let fixture: ComponentFixture<OurClientsComponent>;
  let component: OurClientsComponent;

  function render(clients: readonly Client[] = [client]): void {
    fixture = TestBed.createComponent(OurClientsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('clients', clients);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurClientsComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
  });

  /**
   * El titular esta escrito en la plantilla y no en `home-content.config.ts`, asi que nada lo
   * ataba a la copia aprobada: el commit 925fa29 corrigio el tiempo verbal en la maqueta de
   * referencia y el componente se quedo con el anterior sin que ninguna prueba lo notara.
   */
  it('renders the approved client trust statement', () => {
    useMedia({ narrow: true, reducedMotion: false });
    render();

    const heading = fixture.debugElement.query(By.css('#clientes-title'));
    expect(heading.nativeElement.textContent.trim()).toBe('Empresas que confían en nosotros');
  });

  it('renders intrinsic logo semantics and an aria-hidden duplicate', () => {
    useMedia({ narrow: true, reducedMotion: false });
    render();

    const images = fixture.debugElement.queryAll(By.css('img'));
    expect(images.length).toBe(2);
    expect(images[0].attributes['alt']).toBe(client.logo.altKey);
    expect(images[0].attributes['width']).toBe('200');
    expect(images[0].attributes['height']).toBe('80');
    expect(images[1].attributes['alt']).toBe('');
    expect(images[1].parent?.attributes['aria-hidden']).toBe('true');
  });

  it('pauses by user, hover or focus and resumes independently', () => {
    useMedia({ narrow: true, reducedMotion: false });
    render();

    component.togglePause();
    expect(component.paused).toBe(true);
    component.togglePause();
    expect(component.paused).toBe(false);
    component.setInteractionPause(true);
    expect(component.paused).toBe(true);
    component.setInteractionPause(false);
    expect(component.paused).toBe(false);
  });

  it('is static when reduced motion is requested', () => {
    useMedia({ narrow: true, reducedMotion: true });
    render();

    expect(component.carouselActive).toBe(false);
    expect(component.paused).toBe(true);
    expect(fixture.debugElement.query(By.css('.clients__pause'))).toBeNull();
  });

  /**
   * El control de pausa existia en el componente y en los estilos desde el rediseno, con su
   * area tactil de 44 px y su hueco reservado en la cabecera, pero la plantilla nunca lo
   * pinto: `togglePause()` solo lo llamaba esta misma prueba. O sea que el carrusel no se
   * podia detener, y en tactil no hay puntero que lo pause al pasar por encima.
   */
  describe('pause control', () => {
    const control = () => fixture.debugElement.query(By.css('.clients__pause'));

    beforeEach(() => {
      useMedia({ narrow: true, reducedMotion: false });
      render();
    });

    it('offers a control to stop the carousel', () => {
      expect(control()).not.toBeNull();
      expect(control().nativeElement.tagName).toBe('BUTTON');
      expect(control().nativeElement.type).toBe('button');
    });

    it('stops and resumes the carousel, and reports its state', () => {
      expect(component.paused).toBe(false);
      expect(control().attributes['aria-pressed']).toBe('false');

      control().nativeElement.click();
      fixture.detectChanges();

      expect(component.paused).toBe(true);
      expect(control().attributes['aria-pressed']).toBe('true');

      control().nativeElement.click();
      fixture.detectChanges();

      expect(component.paused).toBe(false);
    });

    /** Quien no ve la pantalla necesita saber que hace el boton, y cambia segun el estado. */
    it('names the action it performs in each state', () => {
      expect(control().attributes['aria-label']).toBe('Pausar el desplazamiento de logotipos');

      control().nativeElement.click();
      fixture.detectChanges();

      expect(control().attributes['aria-label']).toBe('Reanudar el desplazamiento de logotipos');
    });

    /** Sin animacion no hay nada que gobernar: el control sobra y ya lo cubria una prueba. */
    it('disappears when there is no motion to control', () => {
      component.reducedMotion = true;
      fixture.detectChanges();

      expect(control()).toBeNull();
    });
  });

  /**
   * Los cinco logotipos entran juntos en una pantalla de escritorio: ahi el desplazamiento no
   * resolvia ningun problema de espacio y si creaba uno de lectura, porque cada logo pasaba de
   * largo y el degradado de los bordes lo cortaba a la entrada y a la salida.
   */
  describe('viewport', () => {
    it('leaves the row still on desktop, with nothing to pause', () => {
      useMedia({ narrow: false, reducedMotion: false });
      render();

      expect(component.carouselActive).toBe(false);
      expect(component.pauseControlVisible).toBe(false);
      expect(fixture.debugElement.query(By.css('.clients__pause'))).toBeNull();
    });

    /** Debajo del umbral los logotipos ya no caben en una fila y el movimiento si gana espacio. */
    it('keeps the marquee where the row no longer fits', () => {
      useMedia({ narrow: true, reducedMotion: false });
      render();

      expect(component.carouselActive).toBe(true);
      expect(component.pauseControlVisible).toBe(true);
    });

    /**
     * Girar la tableta o arrastrar el borde de la ventana cruza el umbral sin recargar. Sin el
     * oyente, el control de pausa se quedaria anunciando una animacion que ya no corre.
     */
    it('follows the viewport across the threshold without a reload', () => {
      const viewport = useMedia({ narrow: true, reducedMotion: false });
      render();
      expect(component.carouselActive).toBe(true);

      viewport.emit(false);
      fixture.detectChanges();

      expect(component.carouselActive).toBe(false);
      expect(fixture.debugElement.query(By.css('.clients__pause'))).toBeNull();

      viewport.emit(true);
      fixture.detectChanges();

      expect(component.carouselActive).toBe(true);
      expect(fixture.debugElement.query(By.css('.clients__pause'))).not.toBeNull();
    });
  });

  /**
   * Se mide con el ancho real de la ventana y los clientes aprobados de verdad, porque lo que
   * fallaba era la geometria: con `clamp(120px, 14vw, 190px)` la fila se quedaba a un par de
   * pixeles de desbordarse a 1024 px y el recorte volvia. Las columnas se reparten ahora el
   * ancho disponible, asi que la comprobacion sigue valiendo si algun dia entra un logo mas.
   */
  describe('layout', () => {
    const approved = selectVisibleClients();

    function group(): HTMLElement {
      return fixture.debugElement.query(By.css('.clients__group')).nativeElement as HTMLElement;
    }

    function logos(): HTMLElement[] {
      return Array.from(group().querySelectorAll('img'));
    }

    afterEach(async () => {
      await page.viewport(1280, 800);
    });

    it('fits every approved logo in a single row at the narrowest desktop width', async () => {
      await page.viewport(1024, 800);
      render(approved);
      await fixture.whenStable();

      expect(logos().length).toBe(approved.length);
      expect(group().scrollWidth).toBeLessThanOrEqual(group().clientWidth + 1);

      const rows = new Set(logos().map((logo) => Math.round(logo.getBoundingClientRect().top)));
      expect(rows.size).toBe(1);
    });

    it('stops the animation and the edge fade that cut the logos', async () => {
      await page.viewport(1024, 800);
      render(approved);
      await fixture.whenStable();

      const track = fixture.debugElement.query(By.css('.clients__track')).nativeElement as HTMLElement;
      const viewport = fixture.debugElement.query(By.css('.clients__viewport')).nativeElement as HTMLElement;

      expect(getComputedStyle(track).animationName).toBe('none');
      expect(getComputedStyle(viewport).maskImage).toBe('none');
      expect(component.carouselActive).toBe(false);
    });

    it('still scrolls the logos below the desktop threshold', async () => {
      await page.viewport(900, 800);
      render(approved);
      await fixture.whenStable();

      const track = fixture.debugElement.query(By.css('.clients__track')).nativeElement as HTMLElement;

      // Angular prefija el nombre del fotograma al encapsular los estilos del componente.
      expect(getComputedStyle(track).animationName).toContain('clients-marquee');
      expect(component.carouselActive).toBe(true);
    });
  });
});
