import {MediaModel} from "./media-model";
import MetadataModel from "./metadata-model";

export interface MediaBundle {
    Metadata: MetadataModel;
    Media: Array<MediaModel>;
}