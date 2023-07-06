import { Component, OnInit } from '@angular/core';
import { IJoke } from 'src/app/models/IJoke';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  constructor (private httpService: HttpService){}
  ngOnInit(): void {
    this.httpService.get<IJoke[]>('http://localhost:3000/api/jokes').subscribe((jokes) =>{
      this.Jokes = jokes;
    })
  }
  public Jokes: IJoke[] = [];

  addYourOwnJoke(){
    event?.preventDefault();
    const inputValue: IJoke = {
      content: (<HTMLInputElement>document.getElementById("inp_joke")).value,
      likes: 0,
      dislikes: 0
    }
    this.Jokes = [...this.Jokes, inputValue]
    this.httpService.post<IJoke>("http://localhost:3000/api/jokes", inputValue).subscribe((newJoke)=>{
      console.log(newJoke);
      newJoke.content = inputValue.content;
    })
    // this.httpService.get<IJoke[]>("http://localhost:3000/api/jokes").subscribe((jokes)=>{
    //   this.Jokes = jokes;
    // })
  }
  randomJoke() {
    let API = "https://api.chucknorris.io/jokes/random";
    this.httpService.get<any>(API).subscribe((joke)=>{
      const readyToSendJoke: IJoke = {
        content: joke.joke as string,
        likes: 0,
        dislikes: 0
      }
      this.httpService.post<IJoke>("http://localhost:3000/api/jokes", readyToSendJoke).subscribe((returnedJoke)=>{
        console.log(readyToSendJoke);
        console.log(returnedJoke);
      })
    })
  }

}
