export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_S3_ENDPOINT: string;
      AWS_DYNAMO_ENDPOINT: string;
      AWS_DYNAMO_RELEASE_TABLE_NAME: string;
      AWS_DYNAMO_AUDIO_TABLE_NAME: string;
      AWS_S3_BUCKET_NAME: string;
      ENV: 'test' | 'dev' | 'prod';
      SQL_USER: string;
      SQL_PASSWORD: string;
      SQL_DB_NAME: string;
      SQL_HOST: string;
      SQL_PORT: string;
      SQL_SSL: string;
    }
  }
}