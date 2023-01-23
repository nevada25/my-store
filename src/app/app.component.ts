import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-store';
  showImage = true;

  onLoaded(url: string) {
    console.log('log padre' + url)
  }

  toggleImg() {
    this.showImage = !this.showImage;
  }
}
