import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { ServiceComponent } from './components/service/service.component';
import { HomeComponent } from './feature/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    /**
     * Direccion heredada del andamiaje de Angular.
     *
     * Servia `<p>about works!</p>` en produccion y ninguna plantilla enlazaba a ella: solo se
     * llegaba tecleandola. Se conserva por si alguien la compartio alguna vez, y lleva adonde
     * el menu manda su entrada "Nosotros", que es la seccion `por-que-appland` de la Home.
     */
    path: 'about',
    redirectTo: () => inject(Router).parseUrl('/#por-que-appland'),
  },
  {
    path: 'service',
    component: ServiceComponent,
  },
];
