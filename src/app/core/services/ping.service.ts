import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PingService {

  constructor(private readonly httpClient: HttpClient) {
  }

  ping() {
    return this.httpClient.get('./assets/info.json');
  }

}
