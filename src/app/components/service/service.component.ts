import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ServiceComponent implements OnInit, OnDestroy {
  services = [
    { image: 'appmobile.jpg', title: 'ourServiceDescription.mobile.title', description: 'ourServiceDescription.mobile.description' },
    { image: 'web.jpg', title: 'ourServiceDescription.web.title', description: 'ourServiceDescription.web.description' },
    { image: 'consulting.jpg', title: 'ourServiceDescription.consulting.title', description: 'ourServiceDescription.consulting.description' }
  ];

  isMobile = false;
  currentIndex = 0;

  // Drag-related properties
  startX = 0;
  isDragging = false;
  dragThreshold = 50; // Minimum drag distance to trigger slide change

  // Auto slide timer
  private autoSlideInterval: any;

  constructor() {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;

    // Start auto-sliding if in mobile view
    if (this.isMobile) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // Auto slide method
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  // Pause auto-sliding when user interacts
  pauseAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // Resume auto-sliding
  resumeAutoSlide(): void {
    if (this.isMobile) {
      this.startAutoSlide();
    }
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
    this.pauseAutoSlide(); // Pause auto-sliding when user starts touching
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;

    const currentX = event.touches[0].clientX;
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;

    const currentX = event.changedTouches[0].clientX;
    const diffX = this.startX - currentX;

    // Determine slide direction based on drag distance
    if (Math.abs(diffX) > this.dragThreshold) {
      if (diffX > 0) {
        // Swiped left, go to next slide
        this.nextSlide();
      } else {
        // Swiped right, go to previous slide
        this.prevSlide();
      }
    }

    this.isDragging = false;
    this.resumeAutoSlide(); // Resume auto-sliding
  }

  prevSlide(): void {
    // Circular navigation - go to last slide if at first slide
    this.currentIndex = this.currentIndex === 0
      ? this.services.length - 1
      : this.currentIndex - 1;
  }

  nextSlide(): void {
    // Circular navigation - go to first slide if at last slide
    this.currentIndex = this.currentIndex === this.services.length - 1
      ? 0
      : this.currentIndex + 1;
  }
}
