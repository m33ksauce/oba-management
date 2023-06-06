import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  files: any[] = [];

  constructor(private modalCtrl: ModalController, private fileService: FileService) {}

  onFileDropped(event: any) {
    this.files = event;
  }

  async selectFiles(event: any) {
    this.files = await this.fileService.getDroppedOrSelectedFiles(event);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  uploadFiles() {
    this.modalCtrl.dismiss({ Files: this.files });
  }
}
