import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private BASE_URL = environment.api.url;

  constructor(private http: HttpClient) {}

  getAllCategories(translation: string) {
    return this.http.get(`${this.BASE_URL}/${translation}/catalog`, { observe: 'response' });
  }

  deleteCategory(translation, category) {
    return this.http.delete<Category>(`${this.BASE_URL}/${translation}/category/${category.id}`, category);
  }

  updateCategory(translation, category) {
    return this.http.put<Category>(`${this.BASE_URL}/${translation}/category/${category.id}`, category);
  }
}
