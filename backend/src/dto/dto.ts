export interface CreateCategoryDTO {
    parent_id: string,
    name: string,
}

export interface UpdateCategoryDTO {
    id: string,
    parent_id: string,
    name: string,
}

export interface ReadCategoryDTO {
    id: string,
    parent_id: string,
    name: string,
}

interface CatalogCategoryDTO {
    id: string,
    parent_id: string,
    name: string,
    children: CatalogCategoryDTO[]|CatalogAudioDTO[],
}

interface CatalogAudioDTO {
    id: string,
    name: string,
    path: string,
    target: string,
}

export interface CatalogDTO {
    id: string,
    name: string,
    categories: CatalogCategoryDTO[],
}