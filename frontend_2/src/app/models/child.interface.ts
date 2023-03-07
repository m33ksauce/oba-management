import { Category } from './category.interface';

export interface CategoryChild extends Category {
  children?: CategoryChild[] | AudioChild[];
}

export interface AudioChild {
  id: String;
  name: String;
  path: String;
  target: String;
}
