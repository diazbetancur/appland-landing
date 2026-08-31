import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { A11yModule } from '@angular/cdk/a11y';
import { HOME_CONTENT } from '../../feature/pages/home/home-content.config';
import { MenuComponent } from './menu.component';

@Component({
  template: '',
  standalone: false,
})
class AccessibilityRouteStubComponent {}

describe('MenuComponent accessibility', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A11yModule, RouterTestingModule.withRoutes([{ path: '', component: AccessibilityRouteStubComponent }])],
      declarations: [MenuComponent, AccessibilityRouteStubComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', HOME_CONTENT.navigation);
    fixture.componentRef.setInput('meetingAction', HOME_CONTENT.hero.primaryAction);
    fixture.detectChanges();
  });

  it('communicates compact-menu state and captures focus', fakeAsync(() => {
    component.openMenu();
    fixture.detectChanges();
    tick();
    const toggle = fixture.debugElement.query(By.css('.menu__toggle'));
    const dialog = fixture.debugElement.query(By.css('#menu-compacto'));
    expect(toggle.attributes['aria-expanded']).toBe('true');
    expect(toggle.attributes['aria-controls']).toBe('menu-compacto');
    expect(dialog.attributes['role']).toBe('dialog');
    expect(dialog.attributes['aria-modal']).toBe('true');
  }));

  it('closes on Escape and restores focus to the toggle', fakeAsync(() => {
    component.openMenu();
    fixture.detectChanges();
    component.onEscape();
    fixture.detectChanges();
    tick();
    expect(component.isMenuOpen).toBeFalse();
    expect(document.activeElement).toBe(fixture.debugElement.query(By.css('.menu__toggle')).nativeElement);
  }));

  it('has one meeting action inside the open compact dialog and no language control', () => {
    component.openMenu();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.compact-menu__cta')).length).toBe(1);
    expect(fixture.nativeElement.textContent).not.toContain('English');
    expect(fixture.debugElement.query(By.css('select'))).toBeNull();
  });

  it('exposes the brand name via aria-label since the logo image is decorative', () => {
    const brandLink = fixture.debugElement.query(By.css('.menu__brand'));
    const brandMark = fixture.debugElement.query(By.css('.menu__brand-mark'));
    expect(brandLink.attributes['aria-label']).toBe('APPLAND, inicio');
    expect(brandMark.attributes['alt']).toBe('');
  });
});
