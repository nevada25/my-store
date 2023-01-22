import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  img: string = 'valor init';

  @Input('img')
  set changeImage(newImg: string) {
    this.img = newImg;
    console.log('changeImage');
  }

  imageDefault = './assets/default.png';
  @Output() loaded = new EventEmitter<string>();
  //counter: number = 0;
  counterFn: number | undefined;

  constructor() {
    //before render- antes de render
    console.log('constructor', 'imgValue=>', this.img)
  }

  ngOnDestroy(): void {
    // delete
    console.log('ngOnDestroy');
    //window.clearInterval(this.counterFn);
  }

  ngAfterViewInit(): void {
    // after render
    // handler children
    console.log('ngAfterViewInit')
  }

  ngOnInit(): void {
    // before render
    //async - fetch  -- once time
    console.log('ngOnInit', 'imgValue=>', this.img)
  /*  this.counterFn = window.setInterval(() => {
      this.counter += 1;
      console.log(this.counter);
    }, 1000)*/
  }

  imgError() {
    this.img = this.imageDefault;
  }

  imgLoaded() {
    console.log('log hijo')
    this.loaded.emit(this.img);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // before render
    //changes inputs -- times
    console.log('ngOnChanges-changes', changes)
    console.log('ngOnChanges', 'imgValue=>', this.img)
  }
}
