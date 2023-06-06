import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CurrentUserDropdownComponent } from '../components/current-user-dropdown/current-user-dropdown.component';

@NgModule({
  declarations: [CurrentUserDropdownComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [CurrentUserDropdownComponent],
})
export class SharedModule {}
