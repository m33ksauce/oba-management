import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import * as AWS from 'aws-sdk';
import { AppConfig, GetAppConfig } from '../config';
const https = require('http');


class S3Store {
    private s3: S3Client;
    private dynamoDb: DynamoDBClient;
    private config: AppConfig;

    constructor() {
        this.config = GetAppConfig();
        this.setupAws();

        this.s3 = new S3Client({
            apiVersion: this.config.aws.s3.apiVersion,
            region: this.config.aws.region,
            endpoint: this.config.aws.s3.endpoint,
        });

        this.dynamoDb = new DynamoDBClient({
            region: this.config.aws.region,
            endpoint: this.config.aws.dynamo.endpoint,
        })
    }

    private setupAws() {
        AWS.config.update({
            accessKeyId: this.config.aws.accessKeyId,
            secretAccessKey: this.config.aws.secretAccessKey,
            httpOptions: {
                agent: new https.Agent({ rejectUnauthorized: this.config.aws.rejectUnauthorized })
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