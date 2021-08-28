import {MediaModel} from "./media-model";
import MetadataModel from "./metadata-model";

export class MediaBundle {
    public Metadata: Array<MetadataModel>;
    public Media: Array<MediaModel>;

    constructor() {
        this.Metadata = new Array<MetadataModel>();
        this.Media = new Array<MediaModel>();
    }
}