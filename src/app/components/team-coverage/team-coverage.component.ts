import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-coverage',
  templateUrl: './team-coverage.component.html',
  styleUrls: ['./team-coverage.component.scss'],
})
export class TeamCoverageComponent implements OnInit, OnDestroy {
  countries: Country[] = [
    {
      name: 'Honduras',
      flag: 'hn',
      timezone: 'America/Tegucigalpa',
    },
    {
      name: 'Colombia',
      flag: 'co',
      timezone: 'America/Bogota',
    },
    {
      name: 'Estados Unidos',
      flag: 'us',
      timezone: 'America/New_York',
    },
    {
      name: 'Panamá',
      flag: 'pa',
      timezone: 'America/Panama',
    },
    {
      name: 'Bangladesh',
      flag: 'bd',
      timezone: 'Asia/Dhaka',
    },
  ];

  selectedCountry: Country | null = null;
  connectionLines: { path: string }[] = [];
  globeRotation = 0;
  private timeInterval: any;
  private globeInterval: any;

  ngOnInit() {
    this.updateTimes();

    // Update times every minute
    this.timeInterval = setInterval(() => {
      this.updateTimes();
    }, 60000);

    // Rotate globe
    this.globeInterval = setInterval(() => {
      this.globeRotation = (this.globeRotation + 1) % 360;
    }, 100);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.globeInterval) {
      clearInterval(this.globeInterval);
    }
  }

  updateTimes() {
    this.countries.forEach((country) => {
      const now = new Date();
      country.currentTime = now.toLocaleTimeString('es-ES', {
        timeZone: country.timezone,
        hour: '2-digit',
        minute: '2-digit',
      });
    });
  }

  selectCountry(country: Country) {
    this.selectedCountry =
      this.selectedCountry?.name === country.name ? null : country;
  }
}
interface Country {
  name: string;
  flag: string;
  timezone: string;
  currentTime?: string;
}
