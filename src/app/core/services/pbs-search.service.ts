import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {forkJoin, of, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {ProductBreakdownStructure} from '../../shared/models/product-breakdown-structure.model';
import {ErrorResponse} from '../../shared/models/mc-store.model';

@Injectable({providedIn: 'root'})
export class PbsSearchService {
  constructor(private readonly http: HttpClient) {
  }

  findPBSByID$(pbsID: string, ): Observable<ProductBreakdownStructure[]> {
    const qParams = {
      'search': pbsID,
    };
    const url = `${environment.rootURL}change-request-service/change-requests/product-breakdown-structures`;
    return this.http.get(url, {params: qParams}).pipe(
      map(res => (res ? this.formatResponse(res) : []) as ProductBreakdownStructure[]),
      catchError(() => of([] as ProductBreakdownStructure[])));
  }

  formatResponse(data) {
    const arr = JSON.parse(JSON.stringify(data));
    arr.forEach(obj => {
      obj.ID = obj.id;
    });
    return arr;
  }

  searchForProductBreakdownStructure$(productBreakDownStructureId: string): Observable<ProductBreakdownStructure[]> {
    if (productBreakDownStructureId) {
      const qParams = new HttpParams().set('id', `${productBreakDownStructureId}`);
      const url = `${environment.rootURL}cerberus${environment.version}/product-breakdown-structures`;
      return this.http.get(url, {params: qParams}).pipe(
        map(res => (res && res['productBreakdownStructures'] ? res['productBreakdownStructures'] : []) as ProductBreakdownStructure[]),
        catchError(() => of([] as ProductBreakdownStructure[])));
    } else {
      return of([] as ProductBreakdownStructure[]);
    }
  }

  getProductBreakdownStructure$(productBreakDownStructureId: string): Observable<ProductBreakdownStructure> {
    const url = `${environment.rootURL}cerberus${environment.version}/product-breakdown-structures?id=${productBreakDownStructureId}`;
    return this.http.get(url).pipe(
      map(res => (res && res['productBreakdownStructures'] && res['productBreakdownStructures'].length > 0 ? res['productBreakdownStructures'][0] : {'ID': productBreakDownStructureId}) as ProductBreakdownStructure),
      catchError(err => of({'ID': productBreakDownStructureId, 'errorInServiceCall': this.getErrorMessage(err)} as unknown as ProductBreakdownStructure)));
  }

  getProductBreakDownStructureList$(productBreakDownStructureIdList: string[]): Observable<any[]> {
    const httpList = [];
    for (const productBreakDownStructureId of productBreakDownStructureIdList) {
      if (productBreakDownStructureId) {
        httpList.push(this.getProductBreakdownStructure$(productBreakDownStructureId));
      }
    }
    return forkJoin(httpList);
  }

  updateProductBreakdownStructure$(productBreakDownStructureId: string, changeRequestId: string, action: string): Observable<ProductBreakdownStructure> {
    if (productBreakDownStructureId) {
      const url = `${environment.rootURL}cerberus${environment.version}/product-breakdown-structures/${productBreakDownStructureId}`;
      const payLoad = {
        'productBreakdownStructure': {
          'changeRequestID': action === 'add' ? changeRequestId : ''
        }
      };
      return this.http.put(url, payLoad).pipe(
        map(res => (res && res['productBreakdownStructure'] ? res['productBreakdownStructure'] : {}) as ProductBreakdownStructure)
      );
    }

    return {} as Observable<ProductBreakdownStructure>;
  }

  deleteProductBreakdownStructure$(productBreakDownStructureId: string, changeRequestId: string): Observable<ProductBreakdownStructure> {
    if (productBreakDownStructureId) {
      const url = `${environment.rootURL}cerberus${environment.version}/product-breakdown-structures/${productBreakDownStructureId}/change-requests/${changeRequestId}`;
      return this.http.delete(url).pipe(
        map(res => (res && res['productBreakdownStructure'] ? res['productBreakdownStructure'] : {}) as ProductBreakdownStructure),
        catchError(() => of(null as ProductBreakdownStructure))
      );
    }
    return {} as Observable<ProductBreakdownStructure>;
  }

  updateProductBreakdownStructureList$(productBreakDownStructureIdList: string[], changeRequestId: string): Observable<any[]> {
    const httpList = [];
    for (const productBreakDownStructureId of productBreakDownStructureIdList) {
      httpList.push(this.updateProductBreakdownStructure$(productBreakDownStructureId, changeRequestId, 'add'));
    }
    return forkJoin(httpList).pipe(catchError(() => of(null as ProductBreakdownStructure[])));
  }

  private getErrorMessage(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return 'An error occurred:' + error.error.message;
    } else if (error.error && (error.error as ErrorResponse).Detail && (error.error as ErrorResponse).Detail.Message) {
      // The backend returned an unsuccessful response code.
      const txId = (error.error as ErrorResponse).TransactionID ;
      return 'An error occurred:' + (error.error as ErrorResponse).Detail.Message.replace('@TxId@',
        (error.error as ErrorResponse).TransactionID) ;
    } else {
      return 'An unhandled error occurred';
    }
  }
}
