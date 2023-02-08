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
    }
  }
}