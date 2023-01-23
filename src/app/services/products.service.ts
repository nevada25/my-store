import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode} from "@angular/common/http";
import {Product, ProductCreateDTO, UpdateProductDTO} from "../models/product.model";
import {catchError, map, Observable, retry, throwError, zip} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url = `${environment.url}/api/products`;

  constructor(private http: HttpClient) {
  }

  getAllProduct(limit?: number, offset?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (limit != undefined && offset != undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.url, {params})
      .pipe(
        retry(3),
        map(products => products.map(item => {
          return {
            ...item,
            taxes: .18 * item.price
          }
        }))
      );
  }

  readAndUpdate(id: string, update: UpdateProductDTO) {
   return  zip(
      this.getProduct(id),
      this.update(id, update)
    ).pipe();
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError(() => new Error(`Algo esta fallando en el server`));
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError(() => new Error(`El  producto no existe`).message);
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError(() => new Error(`No estas permitido `));
        }
        return throwError(() => new Error(`Ups algo salio mal`));
      })
    );
  }

  create(product: ProductCreateDTO): Observable<Product> {
    return this.http.post<Product>(`${this.url}`, product).pipe();
  }

  update(id: string, product: UpdateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product).pipe();
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`).pipe();
  }
}
