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

  it('selects by click with a non-color active treatment', () => {
    const tabs = fixture.debugElement.queryAll(By.css('[role="tab"]'));
    tabs[2].triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.activeServiceId).toBe(HOME_CONTENT.services[2].id);
    expect(tabs[2].classes['services__tab--active']).toBeTrue();
    expect(tabs[2].attributes['tabindex']).toBe('0');
  });

  it('supports ArrowLeft, ArrowRight, Home and End roving activation', () => {
    const preventDefault = jasmine.createSpy('preventDefault');
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
