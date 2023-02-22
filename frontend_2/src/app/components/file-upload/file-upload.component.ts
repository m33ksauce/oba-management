import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  files: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  onFileDropped(event: any) {
    this.prepareFilesList(event);
  }

  selectFiles(event: any) {
    if (event.target?.files) {
      this.prepareFilesList(event.target.files);
    }
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
  }

  formatBytes(bytes: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  close() {
    this.modalCtrl.dismiss();
  }

  uploadFiles() {
    this.modalCtrl.dismiss({ Files: this.files });
  }
}
