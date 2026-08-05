import { Component, ElementRef, Input, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { Service } from '../../feature/pages/home/home-content.models';

@Component({
    selector: 'app-home-services',
    templateUrl: './home-services.component.html',
    styleUrls: ['./home-services.component.scss'],
    standalone: false
})
export class HomeServicesComponent implements OnChanges {
  @Input() services: readonly Service[] = [];
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  activeServiceId = '';

  get activeService(): Service | undefined {
    return this.services.find((service) => service.id === this.activeServiceId);
  }

  ngOnChanges(): void {
    if (!this.services.some((service) => service.id === this.activeServiceId)) {
      this.activeServiceId = this.services[0]?.id ?? '';
    }
  }

  select(service: Service): void {
    this.activeServiceId = service.id;
  }

  onTabKeydown(event: KeyboardEvent, index: number): void {
    let nextIndex = index;
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
