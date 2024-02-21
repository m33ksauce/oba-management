import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Settings } from 'src/app/models/settings.interface';
import { SettingsService } from 'src/app/services/settings.service';
import { ValidateLanguage } from 'src/app/shared/language.validator';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-translation-form',
  templateUrl: './translation-form.component.html',
  styleUrls: ['./translation-form.component.scss'],
})
export class TranslationFormComponent implements OnInit {
  @Input('settings') isSettings = false;

  error = '';

  form: FormGroup;

  projectControl: FormControl;

  appControl: FormControl;

  languageControl: FormControl;

  formSubmitting = false;

  constructor(private router: Router, private settingsService: SettingsService, private toastCtrl: ToastController) {
    this.projectControl = new FormControl('', Validators.required);
    this.appControl = new FormControl('', Validators.required);
    this.languageControl = new FormControl('', [Validators.required, ValidateLanguage]);

    this.form = new FormGroup({
      projectControl: this.projectControl,
      appControl: this.appControl,
      languageControl: this.languageControl,
    });
  }

  ngOnInit() {
    if (this.isSettings) {
      this.settingsService.getSettings().subscribe({
        next: (response: any) => {
          this.form.setValue({
            projectControl: response.Settings.Settings.ProjectName,
            appControl: response.Settings.Settings.AppName,
            languageControl: response.Settings.Settings.LanguageName,
          });
        },
        error: error => {
          this.formSubmitting = false;
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmitting = true;
    let payload: Settings = {
      ProjectName: this.projectControl.value,
      AppName: this.appControl.value,
      LanguageName: this.languageControl.value,
    };
    if (this.isSettings) {
      this.settingsService.updateSettings(this.languageControl.value, payload).subscribe({
        next: async response => {
          this.formSubmitting = false;
          const toast = await this.toastCtrl.create({
            message: 'Saved successfully.',
            duration: 2000,
          });
          toast.present();
        },
        error: error => {
          this.formSubmitting = false;
        },
      });
    } else {
      this.settingsService.createSettings(payload).subscribe({
        next: response => {
          this.formSubmitting = false;
          this.router.navigate([`/home/${payload.LanguageName}`]);
        },
        error: error => {
          this.formSubmitting = false;
        },
      });
    }
  }
}
