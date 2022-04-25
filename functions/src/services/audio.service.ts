import store from '../store';
import { ReleaseModel } from '../models/models';
import { Bucket } from '@google-cloud/storage';

class AudioService {
    private bucket: Bucket;

    constructor() {
        this.bucket = store.getStorage().bucket("yetfa.audio");
    }

    insert(model: ReleaseModel) {
        //
    }

    findOne(version: string): object {
        return this.bucket;
    }
}

export default AudioService;