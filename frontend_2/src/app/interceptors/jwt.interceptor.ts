import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with token if available
    const currentToken = this.authService.currentToken;
    let requestClone = request;
    if (currentToken) {
      requestClone = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
    }

    return next.handle(requestClone);
  }
}
