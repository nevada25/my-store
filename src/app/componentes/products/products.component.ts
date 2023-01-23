import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product, ProductCreateDTO, UpdateProductDTO} from "../../models/product.model";
import {StoreService} from "../../services/store.service";
import {ProductsService} from "../../services/products.service";
import {switchMap, Unsubscribable, zip} from "rxjs";
import {SwiperOptions} from 'swiper';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  myShoppingCart: Product[]
  total = 0;
  private productsUnsubscribable: Unsubscribable | undefined
  private productUnsubscribable: Unsubscribable | undefined
  date = new Date(2023, 2, 20);
  showProductDetails = false;

  products: Product[] = []
  productChosen: Product = {
    id: '',
    title: '',
    price: 0,
    images: [],
    description: '',
    category: {
      id: 0,
      name: ''
    }
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productService: ProductsService,
  ) {
    this.myShoppingCart = storeService.getMyShoppingCart();
  }

  ngOnDestroy() {
    if (this.productsUnsubscribable != null) {
      this.productsUnsubscribable.unsubscribe();
    }
    if (this.productUnsubscribable != null) {
      this.productUnsubscribable.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.productsUnsubscribable = this.productService.getAllProduct(10, 0).subscribe(
      data => {
        this.products = data;
        this.offset += this.limit
      }
    )
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.onAddToShoppingCart(product);
    this.total = this.storeService.getTotal();
  }


  toggleProductDetail() {
    this.showProductDetails = !this.showProductDetails;
  }

  readAndUpdate(id: string) {
    //PETICION DEPENDIENTE
    this.productService.getProduct(id)
      .pipe(
        switchMap((product) => this.productService.update(product.id, {title: 'change'}))
      ).subscribe(data => {
      console.log(data);
    });
    //PETICION PARALELO
    this.productService.readAndUpdate(id, {title: 'change'}).subscribe(response => {
      const read = response[0];
      const update = response[1];
    });
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.productUnsubscribable = this.productService.getProduct(id).subscribe(product => {
      this.productChosen = product;
      this.toggleProductDetail();

      this.statusDetail = 'success';
    }, response => {
      alert(response)
      this.statusDetail = 'error';
    })
  }


  createNewProduct() {
    const product: ProductCreateDTO = {
      description: 'Producto  2',
      title: 'Titulo de Producto 2',
      price: 1000,
      images: [
        'https://www.w3schools.com/howto/img_avatar.png'
      ],
      categoryId: 1
    }
    this.productService.create(product).subscribe(product => {
      this.products.unshift(product);
    });
  }

  updateProduct() {
    const product: UpdateProductDTO = {
      title: 'Editar title',
    }
    this.productService.update(this.productChosen.id, product).subscribe(product => {
      const productIndex = this.products.findIndex(
        item => item.id == this.productChosen.id
      );
      this.products[productIndex] = product;
      this.productChosen = product;
    });
  }

  onDeletedProduct() {
    const id = this.productChosen.id;
    this.productService.delete(id)
      .subscribe(data => {
        if (data) {
          this.showProductDetails = false
          const productIndex = this.products.findIndex(item => item.id === id)
          this.products.splice(productIndex, 1);
        }
      })

  }

  loadMore() {
    this.productService.getAllProduct(this.limit, this.offset).subscribe(
      data => {
        this.products = this.products.concat(data);
        this.offset += this.limit
      }
    )
  }
}
