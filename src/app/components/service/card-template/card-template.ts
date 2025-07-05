import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.html',
  styleUrls: ['./card-template.scss'],
})
export class CardTemplateComponent {
  @Input() services: ServiceDescription[] = [];

  constructor() {}
}

interface ServiceDescription {
  key: string;
  image: string;
  title: string;
  description: string;
}
