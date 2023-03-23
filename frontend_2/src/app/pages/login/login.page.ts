import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  error = '';

  form: FormGroup;

  userNameControl: FormControl;

  passwordControl: FormControl;

  formSubmitting = false;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.userNameControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      userNameControl: this.userNameControl,
      passwordControl: this.passwordControl,
    });
  }

  onSubmit() {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    // this.formSubmitting = true;

    this.router.navigate(['/home/translation']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
