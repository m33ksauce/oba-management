import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-user-dropdown',
  templateUrl: './current-user-dropdown.component.html',
  styleUrls: ['./current-user-dropdown.component.scss'],
})
export class CurrentUserDropdownComponent {
  @Input() translation: string = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

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
