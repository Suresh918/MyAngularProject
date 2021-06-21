import { Injectable } from '@angular/core';
import { LayoutState } from '../../shared/models/mc-store.model';

@Injectable({
  providedIn: 'root'
})
export class McSessionStorageService {

  constructor() {
  }

  setItem(state: LayoutState): void {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem('layoutState', serializedState);
    } catch (err) {
    }
  }

  getState(): LayoutState {
    try {
      const serializedState = sessionStorage.getItem('layoutState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
    }
  }
}
