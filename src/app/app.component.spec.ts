import { Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  ConversionAction,
  FooterContent,
  NavigationItem,
  ObservedRegionId,
} from './feature/pages/home/home-content.models';

@Component({
  selector: 'app-menu',
  template: '',
  standalone: false,
})
class MenuStubComponent {
  @Input() items: readonly NavigationItem[] = [];
  @Input() meetingAction!: ConversionAction;
}

@Component({
  selector: 'app-footer',
  template: '',
  standalone: false,
})
class FooterStubComponent {
  @Input() content!: FooterContent;
}

@Directive({
  selector: '[appHomeSection]',
  standalone: false,
})
class HomeSectionStubDirective {
  @Input('appHomeSection') regionId!: ObservedRegionId;
}

describe('AppComponent shell', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        MenuStubComponent,
        FooterStubComponent,
        HomeSectionStubDirective,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('binds navigation and meeting inputs to the global Menu', () => {
    const menu = fixture.debugElement.query(By.directive(MenuStubComponent))
      .componentInstance as MenuStubComponent;
    expect(menu.items.length).toBe(5);
    expect(menu.meetingAction.fallbackFragment).toBe('contacto');
  });

  it('binds one complete FooterContent object including nested contact', () => {
    const footer = fixture.debugElement.query(By.directive(FooterStubComponent))
      .componentInstance as FooterStubComponent;
    expect(footer.content.contact.email.value).toBe('hello@applandtech.com');
    expect(footer.content.navigation.length).toBe(5);
  });

  it('renders skip link and header/main/footer landmarks', () => {
    expect(
      fixture.debugElement.query(By.css('.skip-link')).attributes['href'],
    ).toBe('#contenido-principal');
    expect(fixture.debugElement.query(By.css('header'))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('main#contenido-principal')),
    ).not.toBeNull();
    expect(fixture.debugElement.query(By.css('footer'))).not.toBeNull();
  });
});
