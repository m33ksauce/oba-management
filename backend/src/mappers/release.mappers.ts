// import { CatalogAudioDTO, CatalogCategoryDTO, ReadCategoryDTO } from "../dto/dto";
// import { AudioChildModel, CategoryChildModel, ModelType, ReleaseModel } from "../models/models";

// export class ReleaseModelMapper {
//     public static FromCatalog(input: ReadCategoryDTO[]): ReleaseModel {
//         let model = {
//             Version: "",
//             Categories: [],
//             Audio: []
//         }

//         model.Categories = input.map()
//     }

//     private static mapChildAudio(input: CatalogAudioDTO): AudioChildModel {
//         return {
//             type: ModelType.Audio,
//             name: input.name,
//             audioTargetId: input.target
//         }
//     }

//     private static mapChildCategory(input: CatalogCategoryDTO): CategoryChildModel {
//         return {
//             type: ModelType.Category,
//             name: input.name,
//             children: input.children.map(child => {
//                 if (child.type == "audio") {
//                     return this.mapChildAudio(child)
//                 }
//                 return this.mapChildCategory(child)
//             })
//         }
//     }

//     private static mapAudioMapModel(input: ReadCategoryDTO)
// }