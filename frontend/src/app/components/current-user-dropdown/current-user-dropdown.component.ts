import { Component, Input, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-current-user-dropdown',
  templateUrl: './current-user-dropdown.component.html',
  styleUrls: ['./current-user-dropdown.component.scss'],
})
export class CurrentUserDropdownComponent {
  @ViewChild('popover') popover;
  @Input() translation: string = '';
  @Input() label: string = '';
  isOpen = false;

  constructor(private authService: AuthenticationService, private router: Router) {}

  presentPopover(event) {
    this.popover.event = event;
    this.isOpen = true;
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
