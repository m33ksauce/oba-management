import { S3Client } from "@aws-sdk/client-s3";
import * as AWS from 'aws-sdk';
import config from '../config';

class S3Store {
    private s3: S3Client;

    constructor() {
        this.setupAws();

        this.s3 = new S3Client({
            apiVersion: config.s3.apiVersion,
            region: config.s3.region,
            endpoint: 'https://127.0.0.1:9000',
        });
    }

    private setupAws() {
        AWS.config.update({
            region: config.s3.region,
            credentials: {
                accessKeyId: config.s3.credentials.accessKeyId,
                secretAccessKey: config.s3.credentials.secretAccessKey,
            },
        });
    }

    getConnection(): S3Client {
        return this.s3;
    }

}

export default S3Store;