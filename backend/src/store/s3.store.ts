import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import * as AWS from 'aws-sdk';
import config from '../config';
const https = require('http');


class S3Store {
    private s3: S3Client;
    private dynamoDb: DynamoDBClient;

    constructor() {
        this.setupAws();

        this.s3 = new S3Client({
            apiVersion: config.s3.apiVersion,
            region: config.s3.region,
            endpoint: 'https://localhost:4566/',
        });

        this.dynamoDb = new DynamoDBClient({
            region: config.s3.region,
            endpoint: 'https://localhost:4566/',
        })
    }

    private setupAws() {
        AWS.config.update({
            region: config.s3.region,
            httpOptions: {
                agent: new https.Agent({ rejectUnauthorized: false })
            }
        });
    }

    getS3Connection(): S3Client {
        return this.s3;
    }

    getDynamoDbConnection(): DynamoDBClient {
        return this.dynamoDb;
    }
}

export default S3Store;