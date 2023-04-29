import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Catelog } from '../models/catelog.interface';
import { Category } from '../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private BASE_URL = environment.api.url;

  constructor(private http: HttpClient) {}

  getAllCategories(translation: string) {
    return this.http.get(`${this.BASE_URL}/${translation}/catalog`, { observe: 'response' });

    // return of({
    //   categories: [
    //     { id: '1', name: '📕 Perjanjian Lama', children: [] },
    //     {
    //       id: '12',
    //       name: '📕 Perjanjian Baru',
    //       children: [
    //         {
    //           id: '13',
    //           name: '📖 Lukas',
    //           parent_id: '12',
    //           children: [
    //             {
    //               id: '14',
    //               name: 'Lukas 1',
    //               parent_id: '13',
    //               children: [{ id: 2, name: 'Lukas 1:1-4', parent_id: '14' }],
    //             },
    //             {
    //               id: '1',
    //               name: 'Lukas 2',
    //               parent_id: '1',
    //               children: [
    //                 { id: 2, name: 'Lukas 2:41', parent_id: '15' },
    //                 { id: 2, name: 'Lukas 2:42', parent_id: '15' },
    //                 { id: 2, name: 'Lukas 2:43', parent_id: '15' },
    //               ],
    //             },
    //             {
    //               id: '1',
    //               name: 'Lukas 4',
    //               parent_id: '1',
    //               children: [
    //                 { id: 2, name: 'Lukas 4:1', parent_id: '1' },
    //                 { id: 2, name: 'Lukas 4:2', parent_id: '1' },
    //                 { id: 2, name: 'Lukas 4:3', parent_id: '1' },
    //                 { id: 2, name: 'Lukas 4:4', parent_id: '1' },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       id: '3',
    //       name: '💬 Cerita-Cerita Alkitab',
    //       children: [
    //         { id: '2', name: '01 Penciptaaan', parent_id: '3' },
    //         { id: '2', name: '02 Dua Pohon', parent_id: '3' },
    //         { id: '2', name: '03 Penciptaan Perempuan', parent_id: '3' },
    //         { id: '2', name: '04 Dosa Pertama', parent_id: '3' },
    //         { id: '2', name: '05 Hukuman', parent_id: '3' },
    //         { id: '2', name: '06 Menara Babel', parent_id: '3' },
    //         { id: '2', name: '07 Abraham', parent_id: '3' },
    //       ],
    //     },
    //     {
    //       id: '4',
    //       name: '🎸 Lagu-Lagu',
    //       children: [
    //         {
    //           id: '2',
    //           name: 'Yetfa Bapa Mam Pencobaan Akan Dtg - Radio',
    //           parent_id: '4',
    //         },
    //         { id: '2', name: 'Yetfa Betlehem Te', parent_id: '4' },
    //         { id: '2', name: 'Yetfa Bulan Naik', parent_id: '4' },
    //         { id: '2', name: 'Yetfa Injil Masuk', parent_id: '4' },
    //         { id: '2', name: 'Yetfa Molo Rikaso', parent_id: '4' },
    //         { id: '2', name: 'Yetfa Nadi Nel', parent_id: '4' },
    //       ],
    //     },
    //   ],
    // });
  }

  deleteCategory() {}

  updateCategory(translation, category) {
    return this.http.put<Category>(`${this.BASE_URL}/${translation}/category`, category);
  }
}
