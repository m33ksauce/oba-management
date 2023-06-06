import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentToken = this.authService.currentToken;

    if (currentToken && !this.authService.isSessionStorageEmpty()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    if (currentToken && this.authService.isSessionStorageEmpty()) {
      this.authService.logout();
    }

    this.router.navigate(['/login']);
    return false;
  }
  
}
