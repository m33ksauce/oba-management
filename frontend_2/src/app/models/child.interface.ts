import { Category } from './category.interface';

export interface CategoryChild extends Category {
  children?: CategoryChild[] | AudioChild[];
}

export interface AudioChild {
  id: string;
  name: string;
  path: string;
  target: string;
}
