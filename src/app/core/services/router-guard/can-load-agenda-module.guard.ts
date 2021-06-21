import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CanLoadAgendaModuleGuard implements CanLoad {
  constructor(private readonly router: Router) {

  }

  canLoad(route: Route): boolean {
    if (!environment.review) {
      this.router.navigate(['/402']);
    }
    return environment.agenda;
  }
}
