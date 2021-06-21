import { HostListener } from '@angular/core';

export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;
}
