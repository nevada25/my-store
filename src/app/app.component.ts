import {Component} from '@angular/core';
import {Product} from "./models/product.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-store';
  imgParent: string = ''
  showImage = true;

  onLoaded(url: string) {
    console.log('log padre' + url)
  }

  toggleImg() {
    this.showImage = !this.showImage;
  }
}
