import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { ModalController } from '@ionic/angular';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private _unsubscribeAll: Subject<any>;

  currentTranslation: any;

  categories: any;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private modalCtrl: ModalController,
  ) {
    this._unsubscribeAll = new Subject();
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
      next: categories => {
        this.categories = categories;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  async openFileUpload() {
    const modal = await this.modalCtrl.create({
      component: FileUploadComponent,
      cssClass: 'dnd-modal',
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    // Set up web worker here to handle data containing files
  }
}
