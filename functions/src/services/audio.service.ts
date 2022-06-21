import store from "../store";
import {Bucket} from "@google-cloud/storage";

class AudioService {
    private bucket: Bucket;

    constructor() {
        this.bucket = store.getStorage().bucket('oralbibleapp');
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

    create(fileId: string, mimeType: string,  buff: Buffer) {
        console.log(fileId);
        console.log(buff);
        return this.bucket.file(fileId).createWriteStream({
            metadata: {
                contentType: mimeType
        }}).end(buff);
    }
}

export default AudioService;
