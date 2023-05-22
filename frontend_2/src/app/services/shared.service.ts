import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private categoryIdMapSource = new BehaviorSubject<Map<string, string>>(undefined);
  // categoryIdMap = this.categoryIdMapSource.asObservable();

  setCategoryIdMap(data: any) {
    this.categoryIdMapSource.next(data);
  }

  get currentCategoryIdMap() {
    return this.categoryIdMapSource.value;
  }
}
