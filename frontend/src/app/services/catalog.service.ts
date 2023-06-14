import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.interface';
import { firstValueFrom, tap } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private BASE_URL = environment.api.url;

  constructor(private http: HttpClient, private sharedService: SharedService) {}

  getAllCategories(translation: string) {
    return this.http.get(`${this.BASE_URL}/${translation}/catalog`, { observe: 'response' });
  }

  async findOrCreateParent(translation: string, path: string): Promise<string> {
    if (path == '/') return '00000000-0000-0000-0000-000000000000';
    let parentId = this.sharedService.currentCategoryIdMap.get(path);
    if (!parentId && path != '') {
      let parentPath = path.split('/').slice(0, -1).join('/');
      let nextParent = await this.findOrCreateParent(translation, parentPath);
      let categoryResponse = await firstValueFrom(
        this.createCategory(translation, nextParent, path.split('/').slice(-1).pop(), path),
      );
      if (categoryResponse?.id) {
        return categoryResponse.id;
      }
    }

    return parentId;
  }

  createCategory(translation, parentId, name, path) {
    return this.http
      .post<Category>(`${this.BASE_URL}/${translation}/category`, {
        parent_id: parentId,
        name: name,
      })
      .pipe(
        tap(response => {
          if (response.id) {
            this.sharedService.currentCategoryIdMap.set(path, response.id);
            // this.sharedService.setCategoryIdMap(this.sharedService.currentCategoryIdMap);
          }
        }),
      );
  }

  deleteCategory(translation, category) {
    return this.http.delete<Category>(`${this.BASE_URL}/${translation}/category/${category.id}`, category);
  }

  updateCategory(translation, category) {
    return this.http.put<Category>(`${this.BASE_URL}/${translation}/category/${category.id}`, category);
  }
}
