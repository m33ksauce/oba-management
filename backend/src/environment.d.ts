export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      AWS_KEY_ID: string;
      AWS_KEY_SECRET: string;
      AWS_ENDPOINT_HOST: string;
      AWS_ENDPOINT_PORT: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}