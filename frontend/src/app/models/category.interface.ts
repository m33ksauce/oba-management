export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  relativePath?: string;
}

export interface CategoryResponse {
  status: string;
  result: Category;
}