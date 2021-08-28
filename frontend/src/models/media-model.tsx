export interface MediaModel {
    target: string;
    data: ArrayBuffer;
}

export class AudioMediaModel implements MediaModel {
    target: string;
    data: ArrayBuffer;

    constructor(target: string, data: ArrayBuffer) {
        this.target = target;
        this.data = data;
    }
}