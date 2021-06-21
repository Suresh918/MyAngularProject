import { Injectable } from '@angular/core';

/**
 * @export
 * @class StorageService
 * @description This service helps in storing and retrieving data from sessionStorage or localStorage
 */
@Injectable({
  'providedIn': 'root'
})
export class StorageService {

  constructor() {
  }

  get(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }

  set(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

}
