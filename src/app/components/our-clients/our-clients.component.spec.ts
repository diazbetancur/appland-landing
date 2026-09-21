import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Client } from '../../feature/pages/home/home-content.models';
import { OurClientsComponent } from './our-clients.component';

const client: Client = {
  id: 'approved-client',
  name: 'Cliente aprobado',
  publicationStatus: 'approved',
  logo: {
    src: 'assets/images/home/clients/approved.png',
    width: 200,
    height: 80,
    alt: 'Logo de Cliente aprobado',
    decorative: false,
    publicationStatus: 'approved',
  },
};

describe('OurClientsComponent', () => {
  let fixture: ComponentFixture<OurClientsComponent>;
  let component: OurClientsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OurClientsComponent] }).compileComponents();
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
    expect(images[0].attributes['alt']).toBe(client.logo.alt);
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
});
