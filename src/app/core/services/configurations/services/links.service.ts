import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Links} from '../../../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class LinksService {
  linksSUrl: string;
  linkData: any;

  constructor(private readonly http: HttpClient) {
    this.linksSUrl = `${environment.rootURL}configuration-service/links`;
  }

  getLinks(): Observable<Links[]> {
    return this.http.get(this.linksSUrl).pipe(map(res => {
        return ((res) ? res : []) as Links[];
      })
    );
  }

  saveLinkData(linkData) {
    this.linkData = linkData;
  }

  getLinksData() {
    return this.linkData;
  }

  getLinksUrl(linkName): string {
    if (this.linkData) {
      let linkUrl = '';
      this.linkData.forEach((link) => {
        if (link.name === linkName) {
          linkUrl = link.url ? link.url : '';
        }
      });
      return linkUrl;
    } else {
      return '';
    }
  }

}
