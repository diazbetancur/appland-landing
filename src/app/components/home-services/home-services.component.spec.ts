import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { HomeServicesComponent } from './home-services.component';

describe('HomeServicesComponent', () => {
  let fixture: ComponentFixture<HomeServicesComponent>;
  let component: HomeServicesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [HomeServicesComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeServicesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('services', HOME_CONTENT.services);
    fixture.detectChanges();
  });

  it('renders five related tabs and one selected panel', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    expect(tabs.length).toBe(5);
    expect(tabs.filter((tab) => tab.attributes['aria-selected'] === 'true').length).toBe(1);
    const panel = fixture.debugElement.query(By.css('[role="tabpanel"]'));
    expect(panel.attributes['aria-labelledby']).toBe(tabs[0].attributes['id']);
    expect(tabs[0].attributes['aria-controls']).toBe(panel.attributes['id']);
  });

  it('keeps the panel visual decorative and hidden from assistive tech', () => {
    expect(fixture.debugElement.query(By.css('.services__visual')).attributes['aria-hidden']).toBe('true');
    const img = fixture.debugElement.query(By.css('.services__visual img'));
    expect(img.attributes['src']).toContain(HOME_CONTENT.services[0].media!.src);
    expect(img.attributes['alt']).toBe('');
  });

  it('swaps the panel visual and highlights when another service is selected', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    tabs[1].triggerEventHandler('click');
    fixture.detectChanges();
    const service = HOME_CONTENT.services[1];
    expect(fixture.debugElement.query(By.css('.services__visual img')).attributes['src']).toContain(service.media!.src);
    const labels = fixture.debugElement
      .queryAll(By.css('.services__highlight-label'))
      .map((node) => node.nativeElement.textContent.trim());
    expect(labels).toEqual(service.highlights!.map((highlight) => highlight.label));
  });

  it('derives every highlight label from the approved service summary', () => {
    HOME_CONTENT.services.forEach((service) => {
      const summary = service.summary.toLowerCase();
      service.highlights!.forEach((highlight) => {
        const head = highlight.label.toLowerCase().split(' ')[0].replace(/s$/, '');
        expect(summary).toContain(head);
      });
    });
  });

  it('selects by click with a non-color active treatment', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    tabs[2].triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[2].id);
    expect(tabs[2].classes['services__tab--active']).toBe(true);
    expect(tabs[2].attributes['tabindex']).toBe('0');
  });

  it('supports ArrowLeft, ArrowRight, Home and End roving activation', () => {
    const preventDefault = vi.fn();
    component.onTabKeydown({ key: 'End', preventDefault } as unknown as KeyboardEvent, 0);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[4].id);
    component.onTabKeydown({ key: 'Home', preventDefault } as unknown as KeyboardEvent, 4);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[0].id);
    component.onTabKeydown({ key: 'ArrowLeft', preventDefault } as unknown as KeyboardEvent, 0);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[4].id);
    component.onTabKeydown({ key: 'ArrowRight', preventDefault } as unknown as KeyboardEvent, 4);
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[0].id);
    expect(preventDefault).toHaveBeenCalledTimes(4);
  });
});
