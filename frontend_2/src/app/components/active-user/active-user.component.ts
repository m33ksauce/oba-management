import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-user',
  templateUrl: './active-user.component.html',
  styleUrls: ['./active-user.component.scss'],
})
export class ActiveUserComponent {
  @Input() translation: string = '';

  activeUser = '';

  constructor(private authService: AuthenticationService, private router: Router) {
    this.activeUser = this.authService.currentUser;
  }

  navigateToUrl(route: string) {
    switch (route) {
      case 'login': {
        this.authService.logout();
        this.router.navigate(['/login']);
        break;
      }
      case 'settings': {
        this.router.navigate([`/settings/${this.translation}`]);
        break;
      }
    }
  }
}
