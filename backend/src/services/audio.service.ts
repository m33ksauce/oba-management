import S3Store from "../store/s3.store";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { GetAppConfig } from "../config";

class AudioService {
    private s3client: S3Client;
    private bucket: string;

    constructor(store: S3Store) {
        this.s3client = store.getS3Connection();
        this.bucket = GetAppConfig().aws.s3.defaultBucket;
    }

    findOne(fileId: string): Promise<ArrayBuffer> {
        let translation = "yetfa";
        let key = `${translation}/audio/${fileId}`;

        return new Promise(async (resolve, reject) => {
            const getObjectCommand = new GetObjectCommand({
                Bucket: this.bucket,
                Key: key
             });

            try {
                const response = await this.s3client.send(getObjectCommand)
    
                if (!response.Body) return reject("Could not talk to S3")
    
                let body = response.Body as Readable;
    
                const chunks: Uint8Array[] = [];
    
                body.on("data", (chunk) => chunks.push(chunk));
                body.on("error", reject);
                body.on("end", () => resolve(Buffer.concat(chunks)));
            }
            catch {
                reject();
            }

        });
    }

    create(
        fileId: string,
        buff: Buffer
        ): Promise<void> {
        let translation = "yetfa";
        let key = `${translation}/audio/${fileId}`;

        const putObjectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buff
        });
        
        
        return new Promise<void>((resolve, reject) => {
            this.s3client
                .send(putObjectCommand)
                .then(() => resolve())
                .catch(() => reject());
        });
    }
}

export default AudioService;
