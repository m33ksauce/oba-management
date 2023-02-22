import { getFirestore, getStorage } from "../util/firebase-app";
import * as fs from "fs";
import { lookup } from "mime-types";
import * as AWS from 'aws-sdk';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput} from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Metadata, Publisher } from "../interfaces";
import { gzipSync } from "zlib";
const https = require('http');

export class AwsPublisher implements Publisher {
    private dynamoDb: DynamoDBClient;
    private s3: S3Client;

    constructor(s3Endpoint: string,
        dynamoEndpoint: string,
        keyId: string, 
        key: string,
        region: string = "us-east-1") 
    {
        AWS.config.update({
            region: region,
            httpOptions: {
                agent: new https.Agent({ rejectUnauthorized: false })
            }
        });

        const sharedConfig = {
            region: region,
            credentials: {
                accessKeyId: keyId,
                secretAccessKey: key,
            },
        }

        this.dynamoDb = new DynamoDBClient({ 
            endpoint: dynamoEndpoint,
            ...sharedConfig
        });

        this.s3 = new S3Client({
            apiVersion: "2006-03-01",
            endpoint: s3Endpoint,
            ...sharedConfig
        });
    }

    public PublishMetadata(translation: string, md: Metadata) {
        // Strip audio
        let strippedMd = this.stripAudioFromMd(md);
        const releaseCommand: PutItemCommand = new PutItemCommand({
            TableName: "app.oralbible.api.releases",
            Item: {
                VERSION: {S: `${translation}/${md.Version}`},
                METADATA: {S: this.compressString(JSON.stringify(strippedMd))}
            }
        })

        const audioCommand: PutItemCommand = new PutItemCommand({
            TableName: "app.oralbible.api.audio",
            Item: {
                VERSION: {S: `${translation}/${md.Version}`},
                AUDIO: {S: this.compressString(JSON.stringify(md.Audio))}
            }
        })

        this.dynamoDb.send(releaseCommand);
        this.dynamoDb.send(audioCommand)

        const releaseCommandLatest = new PutItemCommand({
            TableName: "app.oralbible.api.releases",
            Item: {
                VERSION: {S: `${translation}/latest`},
                METADATA: {S: this.compressString(JSON.stringify(strippedMd))}
            }
        });

        const audioCommandLatest: PutItemCommand = new PutItemCommand({
            TableName: "app.oralbible.api.audio",
            Item: {
                VERSION: {S: `${translation}/latest`},
                AUDIO: {S: this.compressString(JSON.stringify(md.Audio))}
            }
        })

        this.dynamoDb.send(releaseCommandLatest);
        this.dynamoDb.send(audioCommandLatest);        
    }

    private stripAudioFromMd(md: Metadata): any {
        return {
            "Version": md.Version,
            "Categories": md.Categories
        }
    }

    public async PublishMedia(translation: string, id: string, mime: string, file: Buffer) {
        let bucket = "app.oralbible.api";
        let key = `${translation}/audio/${id}`;

        const putObjectCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file
        })

        return new Promise<void>((resolve, reject) => {
            this.s3
                .send(putObjectCommand)
                .then(() => resolve())
                .catch((err) => reject(err));
        })
    }

    private compressString(raw: string): string {
        return gzipSync(raw).toString('base64')
    }
}