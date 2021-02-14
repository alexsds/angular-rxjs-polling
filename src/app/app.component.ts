import {Component} from '@angular/core';
import {PollingService} from './services/polling.service';
import {environment} from '../environments/environment';
import {CatApiResponse} from './models/cat-api-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'angular-rxjs-polling';
  response!: CatApiResponse;

  constructor(private pollingService: PollingService) {
    this.pollingService.poll<CatApiResponse[]>(environment.api_url).subscribe(response => {
      console.log(response[0]);
      this.response = response[0];
    });
  }
}
