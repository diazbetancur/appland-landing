import { Component, Input } from '@angular/core';
import { Benefit } from '../../feature/pages/home/home-content.models';

@Component({
    selector: 'app-why',
    templateUrl: './why.component.html',
    styleUrls: ['./why.component.scss'],
    standalone: false
})
export class WhyComponent {
  @Input() benefits: readonly Benefit[] = [];
}
