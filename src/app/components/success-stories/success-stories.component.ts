import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApprovedDestination, CaseStudy } from '../../feature/pages/home/home-content.models';
import { HorizontalCarouselDirective } from '../../shared/directives/horizontal-carousel.directive';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ancho por debajo del cual las fichas no caben juntas y el carrusel gana su sitio, identico al
 * que declara `success-stories.component.scss`. Se declara aqui para que la plantilla y los
 * estilos no puedan discrepar: si se cambia uno hay que cambiar el otro, y la constante lo deja
 * a la vista.
 */
export const CASES_CAROUSEL_VIEWPORT = '(max-width: 1023px)';

@Component({
  selector: 'app-success-stories',
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.scss'],
  imports: [HorizontalCarouselDirective, TranslatePipe],
})
export class SuccessStoriesComponent implements OnInit, OnDestroy {
  @Input() cases: readonly CaseStudy[] = [];

  carouselActive = false;

  private viewportQuery: MediaQueryList | undefined;

  private readonly onViewportChange = (event: MediaQueryListEvent): void => {
    this.carouselActive = event.matches;
  };

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.viewportQuery = window.matchMedia(CASES_CAROUSEL_VIEWPORT);
    this.carouselActive = this.viewportQuery.matches;
    this.viewportQuery.addEventListener('change', this.onViewportChange);
  }

  ngOnDestroy(): void {
    this.viewportQuery?.removeEventListener('change', this.onViewportChange);
  }

  destinationHref(destination: ApprovedDestination | undefined): string | null {
    return destination?.publicationStatus === 'approved' ? destination.value : null;
  }
}
