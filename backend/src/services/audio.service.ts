import S3Store from "../store/s3.store";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import config from "../config";

class AudioService {
    private s3client: S3Client;
    private bucket: string;

    constructor(store: S3Store) {
        this.s3client = store.getConnection();
        this.bucket = config.Buckets.DEFAULT_BUCKET;
    }

    findOne(fileId: string): Promise<ArrayBuffer> {
        let translation = "yetfa";
        let key = `${translation}/audio/${fileId}`;

        return new Promise(async (resolve, reject) => {
            const getObjectCommand = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
             });

            const response = await this.s3client.send(getObjectCommand)

            if (!response.Body) return reject("Could not talk to S3")

            let body = response.Body as Blob;

            body.arrayBuffer().then(data => {
                resolve(data)
            }).catch(reject);
        });
    }

    // create(
    //     fileId: string,
    //     mimeType: string,
    //     buff: Buffer,
    //     metadata?: any) {
    //     this.db.collection("audioFiles")
    //         .doc(fileId)
    //         .set(metadata);

    //     const fileStream =
    //         this.bucket.file(`audio/${fileId}`).createWriteStream({
    //             metadata: {
    //                 contentType: mimeType,
    //             },
    //         });

    //     return new Promise<void>((resolve, reject) => {
    //         fileStream.on("finish", () => {
    //             resolve();
    //         });

    //         fileStream.on("error", (err) => {
    //             reject(err);
    //         });

    //         fileStream.end(buff);
    //     });
    // }
}

export default AudioService;
