import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  'providedIn': 'root'
})
export class AuthorizationInDevService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any>;
    if (!environment['production']) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + 'eyJraWQiOiI2NTIxMzI5MzM5OTQ5MDYwNTk5NDA3MzQ2MDIyNzAzMDk3MTI4OTY3NDUzMzEwNTgiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJodHRwczovL2lkcC1hY2MuYXNtbC5jb20vbmlkcC9vYXV0aC9uYW0iLCJqdGkiOiJkZGI0YTI5Ny1iZjllLTQ1YzctOTg2Ni05MWJlYWNmOWQwNWYiLCJhdWQiOiJkMjM1NjI2YS04ZjQ2LTQ2ZDgtYmMxYi0yY2Q1OWY5NWI2ZTgiLCJleHAiOjE2MjMzMDk4ODUsImlhdCI6MTYyMjcwNTA4NSwibmJmIjoxNjIyNzA1MDU1LCJzdWIiOiIyZjVhMWIyODg5ZWVmOTQ4OTQ0OTJmNWExYjI4ODllZSIsIl9wdnQiOiI1R2NqNmRJaE50Sksxb2hlK3dhdklMRUo1dldEN3YzK0pydXJmZ0xDT3NPNllaTCtmZngrVkg1SVc5ZElnTlU0WFRLMFpxSlIvc3ZLWUM3QjZPTjFFK2VNcE1OT0MvUzlpR2RSNWY3K3hOOVJLblZPU3dNL3JqbkltVG0rSEVyU1lDT28vY0pFQ296Y0piZ0ZXR3VQWGJZb3prTWQzbFJ3MmpjUCtJU0VMWlV4cjBJSEtUUlcvbHlFSnFCYitWcWZTN3k2YmtaZmVFWHFuYjJiZUQ1OGV0NGl5L1pPMTU3dVJlQU5ocjNmZGF4c0FrZnRxaytGNFVQR0R3ZkVUQ0VMSkZzYkdlS1NEcUg3U01XSFdEVXlVN0ptVk5teFVZc2laUTVxTDdUemxlTkhZNDVpdHQrTkcxL0U4aDcyaFJheGhOUS9TUnluK1VvRVJDV1NrOHdqZ1ZKZnhsRnlvUjJuMUJWYlNER3hLWTVJelhuSVdVZW9lQmNqZjJIT2g0L2pzdVZaRE1wUWF2ajBlVlJOWGcyd0J2c1Y3akhXd3lpWXhQVUcyaFRjdjVJeEliU2lUOVY4UmNFTUYyNUM3UENwd3NXWVN5TDE5UExYalBoWVE3QWYzT3U0NjUwZDU4ZXlEcW5wZDVIblJDNkRicmRtUnNSZFh1cDVOUFpRVUhBSTNnU2tjQUV4WHdNR0gwK1N4MHhkcldhWlNrY2c3MngrSFZnSDB0RFRTN2NSY3dobzEyRGM2TURaYWVaZ01YMVFiblA2SXZTQjVwS1R6MDU3QmpvQ29YMjhIdEpFTWJzNE4rcTM3VEhaaHVCOE81Ny91VXkrME9MSXNrbWZOeUxRYTkrcjFwUXdiS0pzenQ4UWVmREs3dz09LjEiLCJzY29wZSI6WyJtaXJhaV9wcm9maWxlIiwidXJuOmFzbWwuY29tOm5hbTpzY29wZTpvYXV0aDphY2Nlc3NnYXRld2F5Il0sImdyb3VwX21lbWJlcnNoaXAiOlsiY3VnLW15Y2hhbmdlLWNoYW5nZS1zcGVjaWFsaXN0LTEiLCJjdWctbXljaGFuZ2UtYWRtaW5pc3RyYXRvci1kdCIsImN1Zy1teWNoYW5nZS1jcy0xLWR0IiwiY3VnLW15Y2hhbmdlLWNzLTMtZHQiLCJjdWctbXljaGFuZ2UtY3MtMi1kdCIsImN1Zy1teWNoYW5nZS1jaGFuZ2Utc3BlY2lhbGlzdC0yIl0sImZ1bGxfbmFtZSI6WyJBbmlsIEt1bWFyIl0sInVzZXJfaWQiOlsiYW5pa3VtYXIiXSwiZGVwYXJ0bWVudF9uYW1lIjpbIklUIENvcnBvcmF0ZSBTaGFyZWQgU2VydmljZXMiXSwiZW1wbG95ZWVfbnVtYmVyIjpbIjAwNjE5NDI4Il0sImFiYnJldmlhdGlvbiI6IkFLVkQiLCJlbWFpbCI6WyJhbmlsLmt1bWFyLWFrdmRAYXNtbC5xYXMiXSwiZGVwYXJ0bWVudF9udW1iZXIiOlsiMjUyNDMzNTQiXSwiX3RhcmdldCI6Im1pcmFpIn0.baoWSV627n3ilkQJGjwc6kNRNf9QJneVR5VvpnrtIko3LMk6ky7b3w8G4hV6xab5b1cGd6TSLsLIBYupgH7_dKah5wfmfomn-2Powp8q2BFJlOWCr0B8Oaep1CZxT4bc8TjM-5IUuv1wZqwTrcz3LiC8a47LgUQ77G09mCj3t0xYxUb4ed4xY1fLgdsCA64SY28W2mkKWdK1e7Exb389zxNmRxm1fWXqFfinxo1asWpfw3BUE0SibLHKFw9LhAKemivlASo2zuI4G_PCHvovc_8nYOzxXHp076CdEtHdxWSBN-FPhrdAyht7libMlEaBcGraw_xHNr0A5vNU__GXoA')
      });
    } else {
      authReq = req.clone();
    }
    return next.handle(authReq);
  }
}
