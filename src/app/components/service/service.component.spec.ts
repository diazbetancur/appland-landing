import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideTranslateService, TranslatePipe } from '@ngx-translate/core';
import { ServiceComponent } from './service.component';

describe('ServiceComponent regression smoke', () => {
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [ServiceComponent],
      providers: [provideTranslateService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ServiceComponent);
    fixture.detectChanges();
  });

  it('still instantiates its existing internal page', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.services).toEqual([]);
  });
});
