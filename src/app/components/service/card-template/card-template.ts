import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.html',
  styleUrls: ['./card-template.scss'],
  standalone: false,
})
export class CardTemplateComponent {
  @Input() services: ServiceDescription[] = [];

  constructor() {}
}

export interface ServiceDescription {
  key: string;
  image: string;
  title: string;
  description: string;
}
