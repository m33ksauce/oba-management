import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUp } from 'src/app/models/signup.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as locale from 'locale-codes';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  error = '';

  form: FormGroup;

  emailControl: FormControl;

  passwordControl: FormControl;

  nameControl: FormControl;

  zoneControl: FormControl;

  localeControl: FormControl;

  phoneControl: FormControl;

  formSubmitting = false;

  signupReceived = false;

  localeList: any[];

  constructor(private authService: AuthenticationService) {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', Validators.required);
    this.nameControl = new FormControl('', Validators.required);
    this.zoneControl = new FormControl('', Validators.required);
    this.localeControl = new FormControl('', Validators.required);
    this.phoneControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      email: this.emailControl,
      password: this.passwordControl,
      name: this.nameControl,
      zone: this.zoneControl,
      locale: this.localeControl,
      phone: this.phoneControl,
    });

    this.localeList = locale.all;
    this.zoneControl.setValue(Intl.DateTimeFormat().resolvedOptions().timeZone);
    this.localeControl.setValue(navigator.language);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    this.authService.signup(this.form.value as SignUp).subscribe({
      next: response => {
        this.formSubmitting = false;
        this.signupReceived = true;
      },
      error: error => {
        this.error = error.message;
        console.error(this.error);
        this.formSubmitting = false;
      },
    });
  }
}
