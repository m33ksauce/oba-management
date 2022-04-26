import store from '../store';
import { ReleaseModel } from '../models/models';
import { Bucket } from '@google-cloud/storage';

class AudioService {
    private bucket: Bucket;

    constructor() {
        this.bucket = store.getStorage().bucket();
    }

    insert(model: ReleaseModel) {
        //
    }

    findOne(fileId: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            var buffer = Buffer.from('');
            console.log(fileId)
            this.bucket.file(fileId).createReadStream()
                .on('data', (chunk) => {
                    buffer = Buffer.concat([buffer, chunk]);
                })
                .on('end', () => {
                    resolve(buffer);
                })
                .on('error', () => reject("Failed to load file"));
        });
    }
}

export default AudioService;