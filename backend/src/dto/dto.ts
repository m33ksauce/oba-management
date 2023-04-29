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
    target?: string,
}

export interface CatalogCategoryDTO {
    id: string,
    parent_id: string,
    name: string,
    children: (CatalogCategoryDTO|CatalogAudioDTO)[],
}

export interface CatalogAudioDTO {
    id: string,
    parent_id: string,
    name: string,
    target: string,
}

export interface CatalogDTO {
    id: string,
    name: string,
    categories: CatalogCategoryDTO[],
}

export interface UpdateAudioResultDTO {
    id: string,
    name: string,
    parent_id: string,
}

export interface CreateAudioResultDTO {
    id: string,
}

export interface ReadAudioResultDTO {

}