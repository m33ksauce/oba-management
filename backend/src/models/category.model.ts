export interface ChildItem {
    id: string,
    name: string,
}

export class CategoryModel {
    public name: string;
    private categories: ChildItem[];

    constructor(name: string) {
        this.name = name;
        this.categories = [];
    }

    public addChild(item: ChildItem) {
        this.categories.push(item)
    }

    public removeChild(id: string) {
        this.categories = this.categories.filter(ch => ch.id == id);
    }
}

