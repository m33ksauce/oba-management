import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private BASE_URL = '/api';

  private tokenStorage = '$oba$_currentToken';

  private currentTokenSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject(sessionStorage.getItem(this.tokenStorage));
  }

  setCurrentToken(token: string) {
    this.currentTokenSubject.next(token);
  }

  get currentToken() {
    return this.currentTokenSubject.value;
  }

  isSessionStorageEmpty() {
    return sessionStorage.getItem(this.tokenStorage) === null;
  }

  login(email: string, password: string) {
    // TODO: update below with real logic once we have a login endpoint
    // return this.http.post(`${this.BASE_URL}/login`, { email, password }).pipe(
    //   map(token => {
    //     sessionStorage.setItem(this.tokenStorage, token.toString());
    //     this.setCurrentToken(token.toString());
    //     return token;
    //   }),
    // );
  }

  logout() {
    sessionStorage.removeItem(this.tokenStorage);
    this.currentTokenSubject.next(null);
  }
}
