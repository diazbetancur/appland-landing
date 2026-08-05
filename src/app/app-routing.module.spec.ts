import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AboutComponent } from './components/about/about.component';
import { ServiceComponent } from './components/service/service.component';
import { HomeComponent } from './feature/pages/home/home.component';

describe('Application routing contract', () => {
  it('preserves only the existing Home, About and Service route ownership', () => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule.withRoutes([
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'service', component: ServiceComponent },
    ])] });
    const routes = TestBed.inject(Router).config;
    expect(routes.map((route) => route.path)).toEqual(['', 'about', 'service']);
    expect(routes[0].component).toBe(HomeComponent);
    expect(routes[1].component).toBe(AboutComponent);
    expect(routes[2].component).toBe(ServiceComponent);
  });
});
