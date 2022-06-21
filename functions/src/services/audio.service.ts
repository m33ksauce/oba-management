import store from "../store";
import { Bucket } from "@google-cloud/storage";
import { Firestore } from "firebase-admin/firestore";

class AudioService {
    private bucket: Bucket;
    private db: Firestore;

    constructor() {
        this.db = store.getFromFirestore();
        this.bucket = store.getStorage().bucket('oralbibleapp');
    }

    findOne(fileId: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let buffer = Buffer.from("");
            this.bucket.file(`audio/${fileId}`).createReadStream()
                .on("data", (chunk) => {
                    buffer = Buffer.concat([buffer, chunk]);
                })
                .on("end", () => {
                    resolve(buffer);
                })
                .on("error", () => reject(new Error("Failed to load file")));
        });
    }

    create(
        fileId: string,
        mimeType: string,
        buff: Buffer,
        metadata?: any) 
    {
        this.db.collection("audioFiles")
            .doc(fileId)
            .set(metadata);
            
        var fileStream = this.bucket.file(`audio/${fileId}`).createWriteStream({
            metadata: {
                contentType: mimeType
            }
        })

        return new Promise<void>((resolve, reject) => {
            fileStream.on('finish', () => {
                resolve();
            });

            fileStream.on('error', (err) => {
                reject("Could not upload file");
            })
            
            fileStream.end(buff);
        });   
    }
}

export default AudioService;
