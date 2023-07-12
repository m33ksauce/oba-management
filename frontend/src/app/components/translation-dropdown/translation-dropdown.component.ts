import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
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
  filteredItems: any;
  selectedItems: any;
  searchControl: FormControl;
  searching = true;
  private _unsubscribeAll: Subject<any>;

  constructor(private popoverCtrl: PopoverController, private sharedService: SharedService) {
    this.itemSection = [];
    this.filteredItems = [];
    this.selectedItems = [];
    this.searchControl = new FormControl();
    this.searchControl.setValue('');
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.setFilteredItems();
    this.searchControl.valueChanges.pipe(takeUntil(this._unsubscribeAll), debounceTime(700)).subscribe(search => {
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

  doInfinite(event: any) {
    setTimeout(() => {
      let count = 0;
      for (let i = this.itemSection.length; i < this.filteredItems.length; i++) {
        count++;
        this.itemSection.push(this.filteredItems[i]);

        //Push a max of 20 items onto the array at a time
        if (count == 20) {
          break;
        }
      }

      this.searching = false;
      //If called from html, .complete needs to be called
      if (event) {
        event.target.complete();
      }
    }, 300);
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
    this.filteredItems = this.filterItems();
    this.itemSection = [];
    this.doInfinite(null);
  }

  selectValue(item) {
    if (item != this.currentTranslation) {
      this.sharedService.changeTranslation(item);
      this.popoverCtrl.dismiss();
    }
  }
}
