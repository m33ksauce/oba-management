import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CurrentUserDropdownComponent } from '../components/current-user-dropdown/current-user-dropdown.component';
import { TranslationDropdownComponent } from '../components/translation-dropdown/translation-dropdown.component';

@NgModule({
  declarations: [CurrentUserDropdownComponent, TranslationDropdownComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [CurrentUserDropdownComponent, TranslationDropdownComponent],
})
export class SharedModule {}
