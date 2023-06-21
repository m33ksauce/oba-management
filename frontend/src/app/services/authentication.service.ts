import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignUp } from '../models/signup.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private BASE_URL = environment.api.url + environment.api.authEndpoint;

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
    return this.http.post(`${this.BASE_URL}/authenticate`, { email: email, password: password }).pipe(
      tap((result: any) => {
        sessionStorage.setItem(this.userStorage, email);
        this.setCurrentUser(email);
        sessionStorage.setItem(this.tokenStorage, result.result.token.toString());
        this.setCurrentToken(result.result.token.toString());
      }),
    );
  }

  logout() {
    sessionStorage.removeItem(this.tokenStorage);
    sessionStorage.removeItem(this.userStorage);
    this.currentUserSubject.next(null);
    this.currentTokenSubject.next(null);
  }

  signup(form: SignUp) {
    const email = form.email;
    return this.http.post(`${this.BASE_URL}/register`, form).pipe(
      tap((result: any) => {
        sessionStorage.setItem(this.userStorage, email);
        this.setCurrentUser(email);
      }),
    );
  }

  confirmUser(code) {
    const email = this.currentUser;
    return this.http.post(`${this.BASE_URL}/confirmUser`, {
      email: email,
      code: code,
    });
  }
}
