import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsPage } from './settings.page';
import { TranslationPageModule } from '../translation/translation.module';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslationPageModule,
  ],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
