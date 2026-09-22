import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Client } from '../../feature/pages/home/home-content.models';
import { OurClientsComponent } from './our-clients.component';
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

describe('OurClientsComponent', () => {
  let fixture: ComponentFixture<OurClientsComponent>;
  let component: OurClientsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurClientsComponent],
      providers: [provideTranslateService({ fallbackLang: 'es' })],
    }).compileComponents();
    await useTranslations();
    fixture = TestBed.createComponent(OurClientsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('clients', [client]);
    fixture.detectChanges();
  });

  /**
   * El titular esta escrito en la plantilla y no en `home-content.config.ts`, asi que nada lo
   * ataba a la copia aprobada: el commit 925fa29 corrigio el tiempo verbal en la maqueta de
   * referencia y el componente se quedo con el anterior sin que ninguna prueba lo notara.
   */
  it('renders the approved client trust statement', () => {
    const heading = fixture.debugElement.query(By.css('#clientes-title'));
    expect(heading.nativeElement.textContent.trim()).toBe('Empresas que confían en nosotros');
  });

  it('renders intrinsic logo semantics and an aria-hidden duplicate', () => {
    const images = fixture.debugElement.queryAll(By.css('img'));
    expect(images.length).toBe(2);
    expect(images[0].attributes['alt']).toBe(client.logo.altKey);
    expect(images[0].attributes['width']).toBe('200');
    expect(images[0].attributes['height']).toBe('80');
    expect(images[1].attributes['alt']).toBe('');
    expect(images[1].parent?.attributes['aria-hidden']).toBe('true');
  });

  it('pauses by user, hover or focus and resumes independently', () => {
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
    component.reducedMotion = true;
    fixture.detectChanges();
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
});
