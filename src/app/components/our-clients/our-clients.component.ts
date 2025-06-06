import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
})
export class OurClientsComponent {
  logos: string[] = [
    'Avianca-logo.png',
    'expreso-americano.png',
    'GrupoTerra.png',
    'logo-tengo.png',
    'logo-Toyota.png',
    'logoDilo.png',
    'Pepsi-Logo.png',
    'tigo.png',
  ];

  @ViewChild('carousel', { static: false })
  carouselRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    const container = this.carouselRef.nativeElement;
    const speed = 100; // píxeles por frame

    const scroll = () => {
      container.scrollLeft += speed;

      // Cuando ha scrolleado el ancho de un grupo, reinicia al inicio
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }

      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }
}
