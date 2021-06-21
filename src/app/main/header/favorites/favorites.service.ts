import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  'providedIn': 'root'
})
export class FavoritesService {
  private readonly favoritesUrl: string;

  constructor(private readonly http: HttpClient) {
    this.favoritesUrl = `${environment.rootURL}user-service/favorites`;
  }

  getFavorites(): Observable<any> {
    return this.http.get(this.favoritesUrl).pipe(
        map(res => {
          return ((res) ? res : {});
        })
      );
  }

  addToFavorites(userId: string, favorites): Observable<any> {
    const payload = {
      'user_id': userId,
      'cases': favorites
    };
    return this.http.post(this.favoritesUrl, payload).pipe(map(res => {
      return (res ? res : {});
    }));
  }

  updateFavorites(userId: string, favorites): Observable<any> {
    const payload = {
      'user_id': userId,
      'cases': favorites
    };
    return this.http.post(this.favoritesUrl, payload).pipe(map(res => {
      return (res ? res : {});
    }));
  }

}
