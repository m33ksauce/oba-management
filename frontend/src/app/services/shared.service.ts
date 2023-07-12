import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private categoryIdMapSource = new BehaviorSubject<Map<string, string>>(new Map());
  // categoryIdMap = this.categoryIdMapSource.asObservable();

  changeTranslationData = new Subject();

  setCategoryIdMap(data: any) {
    this.categoryIdMapSource.next(data);
  }

  get currentCategoryIdMap() {
    return this.categoryIdMapSource.value;
  }

  changeTranslation(data: any) {
    this.changeTranslationData.next(data);
  }
}
