import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-solution',
  templateUrl: './ai-solution.component.html',
  styleUrls: ['./ai-solution.component.scss'],
})
export class AiSolutionComponent implements OnInit, OnDestroy {
  public aiSolutions: any[] = [];
  private sub!: Subscription;

  constructor(private readonly translate: TranslateService) {}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.translate
      .get('IAServices.services')
      .subscribe((data: any[]) => {
        this.aiSolutions = data;
      });
  }

  onCardHover(index: number) {}

  onCardLeave(index: number) {}
}
