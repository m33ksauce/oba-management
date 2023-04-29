import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { IonInput, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { Catelog } from 'src/app/models/catelog.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryChild } from 'src/app/models/child.interface';

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

  currentItemName: any;

  activeUser: any;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
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
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.showErrorToast();
      },
    });
  }

  async showErrorToast(message?: string) {
    const toast = await this.toastCtrl.create({
      message: message ? message : 'An error has occurred.',
      duration: 2500,
    });
    toast.present();
  }

  async openFileUpload() {
    const modal = await this.modalCtrl.create({
      component: FileUploadComponent,
      cssClass: 'dnd-modal',
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    // Set up web worker here to handle data containing files
    // Refresh list once finished
  }

  startEdit(event: Event, item: any, input: IonInput) {
    event.stopPropagation();
    this.currentItemName = item.name;
    item.isEditing = true;
    input.setFocus();
  }

  cancelEdit(event: Event, item: any) {
    event.stopPropagation();
    item.name = this.currentItemName;
    delete item.isEditing;
  }

  async saveEdit(event: Event, item: any) {
    event.stopPropagation();
    delete item.isEditing;
    if (this.currentItemName != item.name) {
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
    // Delete item
    const loading = await this.loadingCtrl.create({
      message: 'Deleting...',
    });
    loading.present();
    loading.dismiss();
  }
}
