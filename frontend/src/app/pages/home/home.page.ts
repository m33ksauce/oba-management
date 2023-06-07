import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { IonInput, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryChild } from 'src/app/models/child.interface';
import { SharedService } from 'src/app/services/shared.service';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private _unsubscribeAll: Subject<any>;

  currentTranslation: any;

  categories: CategoryChild[];

  loading = true;

  activeUser: any;

  categoryIdMap = new Map();

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private fileService: FileService,
  ) {
    this._unsubscribeAll = new Subject();
    this.activeUser = this.authService.currentUser;
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe((params: ParamMap) => {
      this.currentTranslation = params.get('translation');
      if (this.currentTranslation) {
        this.getCategories();
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  getCategories() {
    this.loading = true;
    this.catalogService.getAllCategories(this.currentTranslation).subscribe({
      next: (response: any) => {
        if (!response || response?.status == 204) {
          this.openFileUpload();
        } else {
          this.categories = response.body.result;
          for (let category of this.categories) {
            category.relativePath = category.name;
            this.categoryIdMap.set(category.relativePath, category.id);
            if (category.hasOwnProperty('children')) {
              this.fillCategoryMap(category);
            }
          }
          this.sharedService.setCategoryIdMap(this.categoryIdMap);
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.showErrorToast();
      },
    });
  }

  fillCategoryMap(category: CategoryChild) {
    for (let child of category.children) {
      child.relativePath = category.relativePath + '/' + child.name;
      this.categoryIdMap.set(child.relativePath, child.id);
      if (child.hasOwnProperty('children')) {
        this.fillCategoryMap(child);
      }
    }
  }

  async showErrorToast(message?: string) {
    const toast = await this.toastCtrl.create({
      message: message ? message : 'An error has occurred.',
      duration: 2500,
    });
    toast.present();
  }

  async openFileUpload(item?) {
    const modal = await this.modalCtrl.create({
      component: FileUploadComponent,
      cssClass: 'dnd-modal',
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    // Set up web worker here to handle data containing files
    // Refresh list once finished
    if (data && data.Files && data.Files.length > 0) {
      for (let file of data.Files) {
        let parentId = this.catalogService.findOrCreateParent(
          this.currentTranslation,
          this.sharedService.currentCategoryIdMap,
          file.relativePath,
        );

        this.fileService.uploadAudioFile(this.currentTranslation, file, parentId);
      }
    }
  }

  startEdit(event: Event, item: any, input: IonInput) {
    event.stopPropagation();
    item.prevName = item.name;
    item.isEditing = true;
    input.setFocus();
  }

  cancelEdit(event: Event, item: any) {
    event.stopPropagation();
    item.name = item.prevName;
    delete item.isEditing;
  }

  uploadItem(event: Event, item: any) {
    event.stopPropagation();
    this.openFileUpload(item);
  }

  async saveEdit(event: Event, item: any) {
    event.stopPropagation();
    delete item.isEditing;
    if (item.prevName != item.name) {
      delete item.prevName;
      // Save item
      const loading = await this.loadingCtrl.create({
        message: 'Saving...',
      });
      loading.present();
      this.catalogService.updateCategory(this.currentTranslation, item).subscribe({
        next: response => {
          loading.dismiss();
        },
        error: err => {
          loading.dismiss();
          this.showErrorToast();
        },
      });
    }
  }

  async deleteItem(event: Event, item: any) {
    event.stopPropagation();
    const loading = await this.loadingCtrl.create({
      message: 'Deleting...',
    });
    loading.present();
    this.catalogService.deleteCategory(this.currentTranslation, item).subscribe({
      next: response => {
        loading.dismiss();
      },
      error: err => {
        loading.dismiss();
        this.showErrorToast();
      },
    });
  }
}
