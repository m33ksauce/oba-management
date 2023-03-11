import * as dotenv from 'dotenv'
dotenv.config();

export interface AppConfig {
    env: string;
    aws: AWSConfig;
    sql: SqlConfig;
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
    audioTableName: string;
    releaseTableName: string;
    endpoint: string;
}

export interface S3Config {
    apiVersion: string;
    defaultBucket: string;
    endpoint: string;
}

export interface SqlConfig {
    user: string;
    password: string;
    database: string;
    host: string;
    port: number;
    ssl: boolean;
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
                audioTableName: process.env.AWS_DYNAMO_AUDIO_TABLE_NAME,
                releaseTableName: process.env.AWS_DYNAMO_RELEASE_TABLE_NAME,
                endpoint: process.env.AWS_DYNAMO_ENDPOINT,
            },
            s3: {
                apiVersion: "2006-03-01",
                defaultBucket: process.env.AWS_S3_BUCKET_NAME,
                endpoint: process.env.AWS_S3_ENDPOINT,
            }
        },
        sql: {
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DB_NAME,
            host: process.env.SQL_HOST,
            port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10): 5432,
            ssl: process.env.SQL_SSL === "true",
        }
    }
}