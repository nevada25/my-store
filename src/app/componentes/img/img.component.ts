import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent {
  img = '';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('img')
  set changeImage(newImg: string) {
    this.img = newImg;
  }

  imageDefault = './assets/default.png';
  @Output() loaded = new EventEmitter<string>();


  imgError() {
    this.img = this.imageDefault;
  }

  imgLoaded() {
    this.loaded.emit(this.img);
  }

}
