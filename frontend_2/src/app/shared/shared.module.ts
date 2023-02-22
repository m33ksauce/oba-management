import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActiveUserComponent } from '../components/active-user/active-user.component';

@NgModule({
  declarations: [ActiveUserComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [ActiveUserComponent],
})
export class SharedModule {}
