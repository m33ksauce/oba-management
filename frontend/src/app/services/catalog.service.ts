import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.interface';
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

  findOrCreateParent(translation: string, parentCats: Map<string, string>, path: string): string {
    let parentId = parentCats.get(path);
    if (!parentId) {
      let parentPath = path.split("/").slice(0,-1).join("/")
      let nextParent = this.findOrCreateParent(translation, parentCats, parentPath);
      this.createCategory(translation, nextParent, path.split("/").slice(-1).pop())
    }

    return parentId;
  }

  createCategory(translation, parentId, name) {
    return this.http.post<Category>(`${this.BASE_URL}/${translation}/category`, {
      parent_id: parentId,
      name: name,
    });
  }

  deleteCategory(translation, category) {
    return this.http.delete<Category>(`${this.BASE_URL}/${translation}/category/${category.id}`, category);
  }

  updateCategory(translation, category) {
    return this.http.put<Category>(`${this.BASE_URL}/${translation}/category/${category.id}`, category);
  }
}
