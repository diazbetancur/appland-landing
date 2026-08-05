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
    await TestBed.configureTestingModule({ declarations: [OurClientsComponent] }).compileComponents();
    fixture = TestBed.createComponent(OurClientsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('clients', [client]);
    fixture.detectChanges();
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
    expect(component.paused).toBeTrue();
    component.togglePause();
    expect(component.paused).toBeFalse();
    component.setInteractionPause(true);
    expect(component.paused).toBeTrue();
    component.setInteractionPause(false);
    expect(component.paused).toBeFalse();
  });

  it('is static when reduced motion is requested', () => {
    component.reducedMotion = true;
    fixture.detectChanges();
    expect(component.paused).toBeTrue();
    expect(fixture.debugElement.query(By.css('.clients__pause'))).toBeNull();
  });
});
