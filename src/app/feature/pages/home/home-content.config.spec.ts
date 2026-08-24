import {
  HOME_CONTENT,
  selectVisibleCases,
  selectVisibleClients,
  selectVisibleProducts,
} from './home-content.config';
import { HOME_SECTION_IDS } from './home-content.models';

describe('HOME_CONTENT', () => {
  it('preserves the complete stable section id contract', () => {
    expect(HOME_SECTION_IDS).toEqual([
      'inicio', 'clientes', 'desafios', 'servicios', 'casos', 'ia',
      'productos', 'por-que-appland', 'equipo-global', 'contacto',
    ]);
  });

  it('contains exactly the approved business entity counts', () => {
    expect(HOME_CONTENT.challenges.length).toBe(5);
    expect(HOME_CONTENT.services.length).toBe(5);
    expect(HOME_CONTENT.cases.length).toBe(7);
    expect(HOME_CONTENT.aiApplications.length).toBe(9);
    expect(HOME_CONTENT.benefits.length).toBe(7);
    expect(HOME_CONTENT.countries.length).toBe(6);
  });

  it('maps Nosotros only to por-que-appland', () => {
    const about = HOME_CONTENT.navigation.find((item) => item.label === 'Nosotros');
    expect(about?.fragment).toBe('por-que-appland');
  });

  it('denies pending products by default', () => {
    expect(selectVisibleProducts()).toEqual([]);
  });

  it('shows the five approved client logos', () => {
    const visible = selectVisibleClients();
    expect(visible.map((client) => client.name)).toEqual(['Ficohsa', 'Grupo Terra', 'Tigo', 'Toyota', 'Avianca']);
    expect(visible.every((client) => Boolean(client.logo))).toBeTrue();
  });

  it('shows only cases with approved copy and media, in approved order', () => {
    const visible = selectVisibleCases();
    expect(visible.map((item) => item.name)).toEqual(['Toyota', 'Dilo']);
    expect(visible.every((item) => Boolean(item.media))).toBeTrue();
  });

  it('contains no testimonial or provisional public copy', () => {
    const visibleCopy = JSON.stringify({
      hero: HOME_CONTENT.hero,
      challenges: HOME_CONTENT.challenges,
      services: HOME_CONTENT.services,
      cases: selectVisibleCases(),
      ai: HOME_CONTENT.aiApplications,
      benefits: HOME_CONTENT.benefits,
      countries: HOME_CONTENT.countries,
      contact: HOME_CONTENT.contact,
    }).toLowerCase();
    expect(visibleCopy).not.toContain('testimonial');
    expect(visibleCopy).not.toContain('placeholder');
    expect(visibleCopy).not.toContain('coming soon');
  });
});
