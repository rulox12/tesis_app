import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TokenHelper} from '../helpers/token.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public url = environment.api;

  constructor(
    private http: HttpClient,
  ) {
  }

  signIn(request?) {
    if (request) {
      return this.http.post<any>(this.url + 'auth/sign-in', request);
    } else {
      return this.http.post<any>(this.url + 'auth/sign-in', environment.user);
    }
  }

  updateUser(request, id?) {
    return this.http.put<any>(this.url + 'user/update-user/' + id, request);
  }

  changePassword(request, id: any) {
    return this.http.put<any>(this.url + 'user/update-user-password/' + id, request);
  }

}
