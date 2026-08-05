import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AboutComponent } from './about.component';

describe('AboutComponent regression smoke', () => {
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AboutComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
  });

  it('still instantiates its existing internal page', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
