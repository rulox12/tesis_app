import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TokenHelper} from '../helpers/token.helper';

@Injectable({
  providedIn: 'root'
})
export class CommercesService {

  public url = environment.api;

  constructor(
    private http: HttpClient,
    private tokenHelper: TokenHelper
  ) {
  }

  getAllCommerces() {
    return new Promise<any>(resolve => {
      this.tokenHelper.getToken().then(token => {
        if (token && typeof token === 'string') {

          const headers = new HttpHeaders({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: token
          });
          this.http.get(this.url + 'commerce/get-all', {headers}).subscribe(response => {
            if (response) {
              resolve(response);
            } else {
              resolve(false);
            }
          }, error => {
            console.log(headers);
            console.log(error);
          });
        }
      });
    });
  }

  getCommerce(id: string) {
    return new Promise<any>(resolve => {
      this.tokenHelper.getToken().then(token => {
        if (token && typeof token === 'string') {
          const headers = new HttpHeaders({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: token
          });
          this.http.get(this.url + 'commerce/get-commerce/' + id, {headers}).subscribe(response => {
            if (response) {
              resolve(response);
            } else {
              resolve(false);
            }
          }, error => {
            resolve(false);
          });
        }
      });
    });
  }
}
