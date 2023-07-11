import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { IJoke } from 'src/app/models/IJoke';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-joke',
  templateUrl: './joke.component.html',
  styleUrls: ['./joke.component.scss']
})
export class JokeComponent {
  @Input()
  joke!: IJoke;

  @Output() onDeleted = new EventEmitter<any>();

  constructor (private httpService: HttpService) {}

  addLike() {
    this.joke.likes++;
    const updatedJoke: IJoke = { ...this.joke };
    this.httpService.put<IJoke>(`http://localhost:3000/api/like?id=${this.joke.id}`, updatedJoke).subscribe(() => {
    });
  }

  addDislike() {
    this.joke.dislikes++;
    const updatedJoke: IJoke = { ...this.joke };
    this.httpService.put<IJoke>(`http://localhost:3000/api/dislike?id=${this.joke.id}`, updatedJoke).subscribe(() => {
    });
  }

  deleteJoke(jokeId: number) {
    this.httpService.delete<any>(`http://localhost:3000/api/jokes/${jokeId}`).subscribe(() => {
      this.onDeleted.emit(this.joke.id);
    });
  }
}
