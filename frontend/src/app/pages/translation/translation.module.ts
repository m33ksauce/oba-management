import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TranslationPage } from './translation.page';

const routes: Routes = [
  {
    path: '',
    component: TranslationPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  declarations: [TranslationPage],
  exports: [TranslationPage],
})
export class TranslationPageModule {}
