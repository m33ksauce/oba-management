import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  code = '';

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code');
  }

  confirmUser() {
    // this.authService.confirmUser(email, this.code).subscribe({
    //   next: (response: any) => {
    //   },
    //   error: error => {
    //   },
    // });
  }
}
