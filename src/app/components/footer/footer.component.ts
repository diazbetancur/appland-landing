import { Component, Input } from '@angular/core';
import { FooterContent } from '../../feature/pages/home/home-content.models';
import { destinationHref } from '../../shared/utils/conversion-destination.util';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() content!: FooterContent;
  readonly currentYear = new Date().getFullYear();
  readonly destinationHref = destinationHref;
}
