import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Settings } from 'src/app/models/settings.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.page.html',
  styleUrls: ['./translation.page.scss'],
})
export class TranslationPage {
  error = '';

  form: FormGroup;

  translationControl: FormControl;

  formSubmitting = false;

  constructor(private router: Router, private settingsService: SettingsService) {
    this.translationControl = new FormControl('', Validators.required);

    this.form = new FormGroup({
      translationControl: this.translationControl,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    this.settingsService.createSettings(this.form.value as Settings).subscribe({
      next: response => {
        this.formSubmitting = false;
        // this.router.navigate([`/home/${response.translation}`]);
      },
      error: error => {
        this.error = error.message;
        console.error(this.error);
        this.formSubmitting = false;
      },
    });
  }
}
