import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUp } from 'src/app/models/signup.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
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

  formSubmitting = false;

  signupReceived = false;

  constructor(private authService: AuthenticationService, private router: Router) {
    this.emailControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordControl = new FormControl('', Validators.required);
    this.nameControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      emailControl: this.emailControl,
      passwordControl: this.passwordControl,
      nameControl: this.nameControl,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    this.error = '';
    let payload: SignUp = {
      email: this.emailControl.value,
      password: this.passwordControl.value,
      name: this.nameControl.value,
    };
    this.authService.signup(payload).subscribe({
      next: response => {
        this.formSubmitting = false;
        this.signupReceived = true;
        return this.router.navigate(['/confirmation']);
      },
      error: error => {
        console.log(error);
        this.error = error.message;
        this.formSubmitting = false;
      },
    });
  }
}
