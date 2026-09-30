import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.html',
  styleUrls: ['./card-template.scss'],
  imports: [TranslatePipe],
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
