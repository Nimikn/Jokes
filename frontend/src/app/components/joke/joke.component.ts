import { Component, Input } from '@angular/core';
import { IJoke } from 'src/app/models/IJoke';

@Component({
  selector: 'app-joke',
  templateUrl: './joke.component.html',
  styleUrls: ['./joke.component.scss']
})
export class JokeComponent {
  @Input()
  joke!: IJoke;
}