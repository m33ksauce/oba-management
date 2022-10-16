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
            apiVersion: config.aws.apiVersion,
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.credentials.accessKeyId,
                secretAccessKey: config.aws.credentials.secretAccessKey,
            },
            endpoint: `https://${config.aws.endpoint.host}:${config.aws.endpoint.port}`,
        });

        this.dynamoDb = new DynamoDBClient({
            region: config.aws.region,
            credentials: config.aws.credentials,
            endpoint: `https://${config.aws.endpoint.host}:${config.aws.endpoint.port}`,
        })
    }

    private setupAws() {
        AWS.config.update({
            region: config.aws.region,
            httpOptions: {
                agent: new https.Agent({ rejectUnauthorized: config.aws.rejectUnauthorized })
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