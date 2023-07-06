import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  // const form = document.getElementById("form") as HTMLInputElement;

  // form.addEventListener('submit', (event)=>{
  //   event.preventDefault();
  // });