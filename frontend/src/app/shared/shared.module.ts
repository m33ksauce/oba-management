import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrentUserDropdownComponent } from '../components/current-user-dropdown/current-user-dropdown.component';
import { TranslationDropdownComponent } from '../components/translation-dropdown/translation-dropdown.component';
import { TranslationFormComponent } from '../components/translation-form/translation-form.component';

@NgModule({
  declarations: [CurrentUserDropdownComponent, TranslationDropdownComponent, TranslationFormComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [CurrentUserDropdownComponent, TranslationDropdownComponent, TranslationFormComponent],
})
export class SharedModule {}
