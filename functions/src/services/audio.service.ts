import store from "../store";
import {Bucket} from "@google-cloud/storage";

class AudioService {
    private bucket: Bucket;

    constructor() {
        this.bucket = store.getStorage().bucket();
    }

    findOne(fileId: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let buffer = Buffer.from("");
            this.bucket.file(fileId).createReadStream()
                .on("data", (chunk) => {
                    buffer = Buffer.concat([buffer, chunk]);
                })
                .on("end", () => {
                    resolve(buffer);
                })
                .on("error", () => reject(new Error("Failed to load file")));
        });
    }
}

export default AudioService;
