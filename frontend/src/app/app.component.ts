import { Component } from '@angular/core';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Hello angular!';
  constructor (private httpService: HttpService){
    
  }
}

export class MyComponent {
  name: string = "John";
}
