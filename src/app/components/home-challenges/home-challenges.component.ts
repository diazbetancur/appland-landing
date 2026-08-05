import { Component, Input } from '@angular/core';
import { Challenge } from '../../feature/pages/home/home-content.models';

@Component({
  selector: 'app-home-challenges',
  templateUrl: './home-challenges.component.html',
  styleUrls: ['./home-challenges.component.scss'],
})
export class HomeChallengesComponent {
  @Input() challenges: readonly Challenge[] = [];
}
