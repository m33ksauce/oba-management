import * as dotenv from 'dotenv'
dotenv.config();

export interface AppConfig {
    env: string;
    aws: AWSConfig;
}

export interface AWSConfig {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    rejectUnauthorized: boolean;
    s3: S3Config;
    dynamo: DynamoDbConfig;
}

export interface DynamoDbConfig {
    tableName: string;
    endpoint: string;
}

export interface S3Config {
    apiVersion: string;
    defaultBucket: string;
    endpoint: string;
}

export function GetAppConfig(): AppConfig {
    return {
        env: process.env.ENV,
        aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            rejectUnauthorized: (process.env.ENV == 'prod'),
            dynamo: {
                tableName: process.env.AWS_DYNAMO_TABLE_NAME,
                endpoint: process.env.AWS_DYNAMO_ENDPOINT,
            },
            s3: {
                apiVersion: "2006-03-01",
                defaultBucket: process.env.AWS_S3_BUCKET_NAME,
                endpoint: process.env.AWS_DYNAMO_ENDPOINT,
            }
        }
    }
}