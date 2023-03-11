import { Client, ClientConfig } from 'pg';
import { AppConfig, GetAppConfig } from '../config';

export class SqlStore {
    private config: AppConfig;
    private clientConfig: ClientConfig;

    constructor() {
        this.config = GetAppConfig();
        this.clientConfig = this.config.sql;
        this.clientConfig.ssl = {rejectUnauthorized: false}
    }

    public GetClient(): Client {
        return new Client(this.clientConfig);
    }
}