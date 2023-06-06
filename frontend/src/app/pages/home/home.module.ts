import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { DndDirective } from 'src/app/components/file-upload/dnd/dnd.directive';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [HomePage, FileUploadComponent, DndDirective],
})
export class HomePageModule {}
