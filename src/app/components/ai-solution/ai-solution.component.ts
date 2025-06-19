import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ai-solution',
  templateUrl: './ai-solution.component.html',
  styleUrls: ['./ai-solution.component.scss'],
})
export class AiSolutionComponent implements OnInit {
  public aiSolutions: any[] = [];

  constructor(private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('IAServices.services').subscribe((data: any[]) => {
      this.aiSolutions = data;
    });
  }

  onCardHover(index: number) {}

  onCardLeave(index: number) {}
}
