import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../shared/language.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit{

  translations: any;

  constructor( private translation: LanguageService) {}

  ngOnInit(): void {


  }
}
