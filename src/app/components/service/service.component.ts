import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit, OnDestroy {
  services: any[] = [];
  private sub!: Subscription;

  constructor(private readonly trans: TranslateService) {}

  ngOnInit(): void {
    this.sub = this.trans.stream('ourServiceDescription').subscribe((res) => {
      this.services = res;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
