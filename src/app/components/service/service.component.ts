import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ServiceDescription, CardTemplateComponent } from './card-template/card-template';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  imports: [CardTemplateComponent, TranslatePipe],
})
export class ServiceComponent implements OnInit, OnDestroy {
  private readonly trans = inject(TranslateService);

  services: ServiceDescription[] = [];
  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.trans.stream('ourServiceDescription').subscribe((res) => {
      this.services = Array.isArray(res) ? res : [];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
