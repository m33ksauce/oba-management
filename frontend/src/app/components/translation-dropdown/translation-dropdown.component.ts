import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-translation-dropdown',
  templateUrl: './translation-dropdown.component.html',
  styleUrls: ['./translation-dropdown.component.scss'],
})
export class TranslationDropdownComponent implements OnInit {
  @ViewChild('searchBar') searchBar;
  @Input() currentTranslation: any;
  @Input() translationList: any;
  itemSection: any;
  selectedItems: any;
  searchControl: FormControl;
  searching = true;
  private _unsubscribeAll: Subject<any>;

  constructor(private popoverCtrl: PopoverController, private sharedService: SharedService) {
    this.itemSection = [];
    this.selectedItems = [];
    this.searchControl = new FormControl();
    this.searchControl.setValue('');
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.setFilteredItems();
    this.searchControl.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(search => {
      this.setFilteredItems();
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 200);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  clearSearch() {
    this.searching = true;
    this.searchControl.setValue('');
  }

  filterItems() {
    return this.translationList.filter(item => {
      return item.toLowerCase().includes(this.searchControl.value.toLowerCase());
    });
  }

  setFilteredItems() {
    this.itemSection = this.filterItems();
  }

  selectValue(item) {
    if (item != this.currentTranslation) {
      this.sharedService.changeTranslation(item);
      this.popoverCtrl.dismiss();
    }
  }
}
