import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SERVICE_QUERY_PARAM } from '../../feature/pages/home/home-content.config';
import { Service } from '../../feature/pages/home/home-content.models';

@Component({
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: ['./home-services.component.scss'],
})
export class HomeServicesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() services: readonly Service[] = [];
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  activeServiceId = '';

  private readonly route = inject(ActivatedRoute);
  private readonly subscriptions = new Subscription();

  /**
   * Servicio pedido desde la URL. La seccion es un componente de pestanas con un solo
   * anclaje, asi que un enlace no puede apuntar a un servicio concreto solo con el
   * fragmento: lo identifica este parametro, que escriben los enlaces del pie de pagina.
   */
  private requestedServiceId: string | null = null;

  get activeService(): Service | undefined {
    return this.services.find((service) => service.id === this.activeServiceId);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe((params) => {
        this.requestedServiceId = params.get(SERVICE_QUERY_PARAM);
        this.applySelection();
      }),
    );
  }

  ngOnChanges(): void {
    this.applySelection();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  select(service: Service): void {
    // Una seleccion manual manda sobre lo que pidiera la URL: si no se olvidara, el
    // parametro volveria a imponerse en la siguiente deteccion de cambios.
    this.requestedServiceId = null;
    this.activeServiceId = service.id;
  }

  private applySelection(): void {
    const requested = this.services.find((service) => service.id === this.requestedServiceId);
    if (requested) {
      this.activeServiceId = requested.id;
      return;
    }

    if (!this.services.some((service) => service.id === this.activeServiceId)) {
      this.activeServiceId = this.services[0]?.id ?? '';
    }
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    let nextIndex: number;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % this.services.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + this.services.length) % this.services.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = this.services.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    this.select(this.services[nextIndex]);
    this.tabButtons.get(nextIndex)?.nativeElement.focus();
  }
}
