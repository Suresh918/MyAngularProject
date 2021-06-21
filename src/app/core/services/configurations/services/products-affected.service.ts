import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProductsAffectedSet} from '../../../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class ManageProductsAffectedService {
  private readonly productsAffectedUrl: string;

  constructor(private readonly http: HttpClient) {
    this.productsAffectedUrl = `${environment.rootURL}configuration-service/product-categories`;
  }

  getProductCategories(): Observable<ProductsAffectedSet[]> {
    return this.http.get(this.productsAffectedUrl)
      .pipe(
        map(res => {
          return ((res) ? res : []) as ProductsAffectedSet[];
        })
      );
  }

  addProduct(productCategoryPayload, productCategoryName): Observable<ProductsAffectedSet> {
    return this.http.put(`${this.productsAffectedUrl}/${productCategoryName}`, productCategoryPayload).pipe(map(res => {
      return (res ? res : {}) as ProductsAffectedSet;
    }));
  }

  addProductCategory(productCategoryLabel: string): Observable<ProductsAffectedSet> {
    const productCategoryPayload = {
      'label': productCategoryLabel,
      'products': []
    };
    return this.http.post(`${this.productsAffectedUrl}`, productCategoryPayload).pipe(map(res => {
      return (res ? res : {}) as ProductsAffectedSet;
    }));
  }

  updateProductCategory(editedProductPayload, productCategoryName) {
    return this.http.put(`${this.productsAffectedUrl}/${productCategoryName}`, editedProductPayload).pipe(map(res => {
      return (res ? res : {}) as ProductsAffectedSet;
    }));
  }

  updateProduct(editedProductPayload, productCategoryName) {
    return this.http.put(`${this.productsAffectedUrl}/${productCategoryName}`, editedProductPayload).pipe(map(res => {
      return (res ? res : {}) as ProductsAffectedSet;
    }));
  }

  deleteProductCategory(productCategoryName): Observable<any> {
    return this.http.delete(`${this.productsAffectedUrl}/${productCategoryName}`);
  }

  deleteProduct(productCategory): Observable<any> {
    return this.http.put(`${this.productsAffectedUrl}/${productCategory.name}`, productCategory).pipe(map(res => {
      return (res ? res : {}) as ProductsAffectedSet;
    }));
  }

}
