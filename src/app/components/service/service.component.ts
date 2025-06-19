import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  services: any[] = [];
  allServices: any[] = []; // Servicios duplicados para scroll infinito

  isMobile = false;
  currentTranslateX = 0;
  cardWidth = 350; // Ancho de cada tarjeta + gap

  // Drag-related properties
  startX = 0;
  isDragging = false;
  dragThreshold = 50;

  // Auto slide timer
  private autoSlideInterval: any;
  private autoSlideDelay = 3000; // 3 segundos
  private isPaused = false;
  private autoResumeTimer: any;

  constructor(private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('ourServiceDescription').subscribe((data: any[]) => {
      this.services = data;
      this.setupInfiniteScroll();
    });

    this.isMobile = window.innerWidth < 768;

    // Ajustar ancho de tarjeta según el dispositivo
    this.cardWidth = this.isMobile ? 320 : 350;

    setTimeout(() => {
      this.startAutoSlide();
    }, 500);
  }

  setupInfiniteScroll(): void {
    // Duplicar servicios para crear efecto infinito
    this.allServices = [...this.services, ...this.services, ...this.services];

    // Comenzar desde el segundo conjunto para permitir scroll hacia atrás
    this.currentTranslateX = -this.services.length * this.cardWidth;
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  updateDisplayedServices(): void {
    // No necesario para el scroll horizontal
  }

  startAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }

    this.autoSlideInterval = setInterval(() => {
      if (!this.isPaused) {
        this.smoothScrollNext();
      }
    }, this.autoSlideDelay);
  }

  smoothScrollNext(): void {
    this.currentTranslateX -= this.cardWidth;

    // Verificar si necesitamos resetear para el efecto infinito
    if (
      Math.abs(this.currentTranslateX) >=
      this.services.length * 2 * this.cardWidth
    ) {
      setTimeout(() => {
        this.currentTranslateX = -this.services.length * this.cardWidth;
      }, 500); // Tiempo de la transición CSS
    }
  }

  smoothScrollPrev(): void {
    this.currentTranslateX += this.cardWidth;

    // Verificar si necesitamos resetear hacia adelante
    if (this.currentTranslateX > 0) {
      setTimeout(() => {
        this.currentTranslateX = -this.services.length * this.cardWidth;
      }, 500);
    }
  }

  getTransformStyle(): string {
    return `translateX(${this.currentTranslateX}px)`;
  }

  pauseAutoSlide(): void {
    this.isPaused = true;
    clearTimeout(this.autoResumeTimer);
  }

  resumeAutoSlide(delay = 300): void {
    clearTimeout(this.autoResumeTimer);

    this.autoResumeTimer = setTimeout(() => {
      this.isPaused = false;
    }, delay);
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
    this.pauseAutoSlide();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;

    const currentX = event.changedTouches[0].clientX;
    const diffX = this.startX - currentX;

    if (Math.abs(diffX) > this.dragThreshold) {
      if (diffX > 0) {
        this.smoothScrollNext();
      } else {
        this.smoothScrollPrev();
      }
    }

    this.isDragging = false;
    this.resumeAutoSlide();
  }

  prevSlide(): void {
    this.smoothScrollPrev();
  }

  nextSlide(): void {
    this.smoothScrollNext();
  }

  onCardMouseEnter(): void {
    this.pauseAutoSlide();
  }

  onCardMouseLeave(): void {
    this.resumeAutoSlide();
  }

  trackByService(index: number, service: any): any {
    return service.id || service.title || index;
  }

  jumpToSlide(index: number): void {
    this.currentTranslateX = -(this.services.length + index) * this.cardWidth;
    this.pauseAutoSlide();
    setTimeout(() => this.resumeAutoSlide(), 200);
  }

  getCurrentSlideIndex(): number {
    return (
      Math.abs(Math.floor(this.currentTranslateX / this.cardWidth)) %
      this.services.length
    );
  }

  onMouseDragStart(): void {
    this.pauseAutoSlide();
  }

  onMouseDragEnd(): void {
    this.resumeAutoSlide();
  }
}
