import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  email = '';
  form: FormGroup;
  confirmationControl: FormControl;
  formSubmitting = false;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService, private router: Router) {
    this.confirmationControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      confirmationControl: this.confirmationControl,
    });
  }

  ngOnInit() {  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    const code = this.confirmationControl.value;
    this.authService
      .confirmUser(code).subscribe({
      next: (response: any) => {
        this.formSubmitting = false;
        return this.router.navigate(['/login']);
      },
      error: error => {
      },
    });
  }
}
