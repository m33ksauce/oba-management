import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private _unsubscribeAll: Subject<any>;

  currentTranslation: any;

  categories: any;

  constructor(private route: ActivatedRoute, private catalogService: CatalogService) {
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
    this.catalogService.getAllCategories(this.currentTranslation).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {

      }
   });
  }
}
