import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { IonInput, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryChild } from 'src/app/models/child.interface';
import { SharedService } from 'src/app/services/shared.service';
import { FileService } from 'src/app/services/file.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ReleaseService } from 'src/app/services/release.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private _unsubscribeAll: Subject<any>;

  currentTranslation: any;

  currentVersion: any;

  categories: CategoryChild[];

  loading = true;

  activeEmail: any;

  translationList: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    private sharedService: SharedService,
    private fileService: FileService,
    private settingsService: SettingsService,
    private releaseService: ReleaseService,
  ) {
    this._unsubscribeAll = new Subject();
    this.activeEmail = this.authService.currentUser.email;
    this.translationList = this.authService.currentUser.available_translations;

    this.sharedService.changeTranslationData.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (newTranslation: any) => {
        if (newTranslation) {
          this.router.navigate([`/home/${newTranslation}`]);
        }
      },
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe((params: ParamMap) => {
      this.currentTranslation = params.get('translation');
      if (this.currentTranslation) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  async loadData() {
    this.loading = true;
    await this.getCurrentVersion();
    await this.getCategories();
    this.loading = false;
  }

  async getCurrentVersion() {
    try {
      let response = await lastValueFrom(this.settingsService.getSettings(this.currentTranslation));
      this.currentVersion = (response as any).LatestVersion;
    } catch (error) {}
  }

  async getCategories() {
    try {
      let response = await lastValueFrom(this.catalogService.getAllCategories(this.currentTranslation));
      if (!response || response?.status == 204) {
        this.openFileUpload();
      } else {
        this.categories = (response.body as any).result;

        // Reset map
        this.sharedService.setCategoryIdMap(new Map());

        for (let category of this.categories) {
          category.relativePath = category.name;
          this.sharedService.currentCategoryIdMap.set(category.relativePath, category.id);
          if (category.hasOwnProperty('children')) {
            this.fillCategoryMap(category);
          }
        }
        this.sharedService.setCategoryIdMap(this.sharedService.currentCategoryIdMap);
      }
    } catch (error) {
      this.showToast();
    }
  }

  fillCategoryMap(category: CategoryChild) {
    for (let child of category.children) {
      child.relativePath = category.relativePath + '/' + child.name;
      this.sharedService.currentCategoryIdMap.set(child.relativePath, child.id);
      if (child.hasOwnProperty('children')) {
        this.fillCategoryMap(child);
      }
    }
  }

  async showToast(message?: string) {
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
    if (data && data.Files && data.Files.length > 0) {
      if (item) {
        // Upload files under parent item
      } else {
        for (let file of data.Files) {
          // Trim leading and trailing slashes
          let trimmedPath = file.relativePath.replace(/^\//, '').replace(/\/$/, '');
          let parentId = await this.catalogService.findOrCreateParent(this.currentTranslation, trimmedPath);

          await lastValueFrom(this.fileService.uploadAudioFile(this.currentTranslation, file, parentId));
        }
      }

      // Refresh list once finished
      this.getCategories();
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
      if (item.target) {
        // Update audio file
        this.fileService.updateAudioFile(this.currentTranslation, item.id, item.name, item.parent_id).subscribe({
          next: response => {
            loading.dismiss();
            this.showToast('Saved Successfully');
          },
          error: err => {
            loading.dismiss();
            this.showToast();
          },
        });
      } else {
        // Update category
        this.catalogService.updateCategory(this.currentTranslation, item).subscribe({
          next: response => {
            loading.dismiss();
            this.showToast('Saved Successfully');
          },
          error: err => {
            loading.dismiss();
            this.showToast();
          },
        });
      }
    }
  }

  async deleteItem(event: Event, item: any) {
    event.stopPropagation();
    const loading = await this.loadingCtrl.create({
      message: 'Deleting...',
    });
    loading.present();
    if (item.target) {
      // Delete audio file
      this.fileService.deleteAudioFile(this.currentTranslation, item.id).subscribe({
        next: async response => {
          await this.getCategories();
          loading.dismiss();
          this.showToast('Deleted Successfully');
        },
        error: err => {
          loading.dismiss();
          this.showToast();
        },
      });
    } else {
      // Delete category
      this.catalogService.deleteCategory(this.currentTranslation, item).subscribe({
        next: async response => {
          await this.getCategories();
          loading.dismiss();
          this.showToast('Deleted Successfully');
        },
        error: err => {
          loading.dismiss();
          this.showToast();
        },
      });
    }
  }

  async publish() {
    const loading = await this.loadingCtrl.create({
      message: 'Publishing...',
    });
    loading.present();
    this.releaseService.publishRelease(this.currentTranslation).subscribe({
      next: async response => {
        loading.dismiss();
        this.showToast('Published Successfully');
      },
      error: err => {
        loading.dismiss();
        this.showToast();
      },
    });
  }
}
