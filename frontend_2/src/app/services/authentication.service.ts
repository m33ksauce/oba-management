import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private BASE_URL = '/api';

  private tokenStorage = '$oba$_currentToken';
  private userStorage = '$oba$_currentUser';

  private currentTokenSubject: BehaviorSubject<any>;
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentTokenSubject = new BehaviorSubject(sessionStorage.getItem(this.tokenStorage));
    this.currentUserSubject = new BehaviorSubject(sessionStorage.getItem(this.userStorage));
  }

  setCurrentToken(token: string) {
    this.currentTokenSubject.next(token);
  }

  get currentToken() {
    return this.currentTokenSubject.value;
  }

  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  isSessionStorageEmpty() {
    return sessionStorage.getItem(this.tokenStorage) === null;
  }

  login(email: string, password: string) {
    // TODO: update below with real logic once we have a login endpoint
    // return this.http.post(`${this.BASE_URL}/login`, { email, password }).pipe(
    //   map(token => {
    //     sessionStorage.setItem(this.userStorage, email);
    //     this.setCurrentUser(email);
    //     sessionStorage.setItem(this.tokenStorage, token.toString());
    //     this.setCurrentToken(token.toString());
    //     return token;
    //   }),
    // );
  }

  logout() {
    sessionStorage.removeItem(this.tokenStorage);
    sessionStorage.removeItem(this.userStorage);
    this.currentUserSubject.next(null);
    this.currentTokenSubject.next(null);
  }
}
