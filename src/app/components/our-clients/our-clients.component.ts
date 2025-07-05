import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
})
export class OurClientsComponent {
  logos: string[] = [
    'logo-tengo.png',
    'Avianca-logo.png',
    // 'Pepsi-Logo.png',
    'logo-Toyota.png',
    'dominos.png',
    'UE.jpg',
    'banco_ficohsa.png',
    'GrupoTerra.png',
    'darden.png',
    'espresso_americano.webp',
    'atlantida.png',
    'Loto_borde.webp',
    'emsula.webp',
    'lacthosa.png',
    'pronto.png',
    'LogoDilo.png',
    'broadcast.png',
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
