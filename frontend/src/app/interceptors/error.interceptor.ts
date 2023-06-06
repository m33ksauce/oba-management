import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isLogin = this.router.url.includes('login');
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401 && !isLogin) {
          // auto logout if 401 response returned from api
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        return throwError(() => {
          new Error(err.error.errors);
        });
      }),
    );
  }
}
