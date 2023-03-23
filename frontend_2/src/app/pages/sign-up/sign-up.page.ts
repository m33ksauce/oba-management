import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  error = '';

  form: FormGroup;

  userNameControl: FormControl;

  passwordControl: FormControl;

  nameControl: FormControl;

  translationControl: FormControl;

  formSubmitting = false;

  signupReceived = false;

  constructor(private authService: AuthenticationService) {
    this.userNameControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', Validators.required);
    this.nameControl = new FormControl('', Validators.required);
    this.translationControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      userNameControl: this.userNameControl,
      passwordControl: this.passwordControl,
      nameControl: this.nameControl,
      translationControl: this.translationControl,
    });
  }

  onSubmit() {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    // this.formSubmitting = true;

    this.signupReceived = true;
  }
}
