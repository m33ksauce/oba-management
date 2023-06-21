import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUp } from 'src/app/models/signup.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as locale from 'locale-codes';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthenticationService, private router: Router) {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', Validators.required);
    this.nameControl = new FormControl('', Validators.required);
    this.zoneControl = new FormControl('', Validators.required);
    this.localeControl = new FormControl('', Validators.required);
    this.phoneControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      nameControl: this.nameControl,
      zoneControl: this.zoneControl,
      localeControl: this.localeControl,
      phoneControl: this.phoneControl,
    });

    this.localeList = locale.all;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.patchValue({
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language,
    });

    this.formSubmitting = true;
    let payload: SignUp = {
      email: this.emailControl.value,
      password: this.passwordControl.value,
      name: this.nameControl.value,
      zone: this.zoneControl.value,
      locale: this.localeControl.value,
      phone: this.phoneControl.value,
    };
    this.authService.signup(payload).subscribe({
      next: (response: any) => {
        this.formSubmitting = false;
        this.router.navigate([`/confirmation`], { queryParams: {email: payload.email}});
        this.signupReceived = true;
      },
      error: error => {
        this.formSubmitting = false;
      },
    });
  }
}
