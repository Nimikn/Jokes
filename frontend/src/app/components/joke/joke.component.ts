import { Component, Input } from '@angular/core';
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
  jokes: IJoke[] = [];

  constructor (private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get<IJoke[]>('http://localhost:3000/api/jokes').subscribe((response) => {
      this.jokes = response;
    });
  }

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
      this.jokes = this.jokes.filter(joke => joke.id !== jokeId);
    });
  }
}
