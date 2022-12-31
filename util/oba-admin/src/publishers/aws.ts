import { getFirestore, getStorage } from "../util/firebase-app";
import * as fs from "fs";
import { lookup } from "mime-types";
import * as AWS from 'aws-sdk';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput} from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Metadata, Publisher } from "../interfaces";
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
        const params: PutItemCommandInput = {
            TableName: "app.oralbible.api.releases",
            Item: {
                VERSION: {S: `${translation}/${md.Version}`},
                METADATA: {S: JSON.stringify(md)}
            }
        }

        const command = new PutItemCommand(params);
        this.dynamoDb.send(command);

        const paramsLatest: PutItemCommandInput = {
            TableName: "app.oralbible.api.releases",
            Item: {
                VERSION: {S: `${translation}/latest`},
                METADATA: {S: JSON.stringify(md)}
            }
        }

        const commandLatest = new PutItemCommand(paramsLatest);
        this.dynamoDb.send(commandLatest);
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
}