import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { IonInput, ModalController } from '@ionic/angular';
import { FileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { Catelog } from 'src/app/models/catelog.interface';

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

  currentItemName: any;

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
        this.categories = categories as Catelog;
        this.loading = false;
        if (!this.categories) {
          this.openFileUpload();
        }
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

  saveEdit(event: Event, item: any) {
    event.stopPropagation();
    delete item.isEditing;
    if (this.currentItemName != item.name) {
      // Save item
    }
  }
}
