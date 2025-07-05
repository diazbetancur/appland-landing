import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  services: any[] = [];

  constructor(private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('ourServiceDescription').subscribe((data: any[]) => {
      this.services = data;
    });
  }
}
