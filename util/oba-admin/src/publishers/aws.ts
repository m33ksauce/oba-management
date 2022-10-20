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

    constructor(endpoint: string,
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
            endpoint: endpoint,
        }

        this.dynamoDb = new DynamoDBClient({ ...sharedConfig });

        this.s3 = new S3Client({
            apiVersion: "2006-03-01",
            ...sharedConfig
        });
    }

    public PublishMetadata(md: Metadata) {
        const params: PutItemCommandInput = {
            TableName: "releases",
            Item: {
                VERSION: {S: md.Version},
                METADATA: {S: JSON.stringify(md)}
            }
        }

        const command = new PutItemCommand(params);
        this.dynamoDb.send(command);

        const paramsLatest: PutItemCommandInput = {
            TableName: "releases",
            Item: {
                VERSION: {S: "latest"},
                METADATA: {S: JSON.stringify(md)}
            }
        }

        const commandLatest = new PutItemCommand(paramsLatest);
        this.dynamoDb.send(commandLatest);
    }

    public async PublishMedia(id: string, mime: string, file: Buffer) {
        let bucket = "app.oralbible.api";
        let translation = "yetfa";
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
                .catch(() => reject());
        })
    }
}