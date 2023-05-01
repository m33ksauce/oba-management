import { Pool, ClientConfig } from 'pg';
import { AppConfig, GetAppConfig } from '../config';

export class SqlStore {
    private config: AppConfig;
    private clientConfig: ClientConfig;
    private pool: Pool

    constructor() {
        this.config = GetAppConfig();
        this.clientConfig = this.config.sql;
        this.clientConfig.ssl = {rejectUnauthorized: false}

        this.pool = new Pool(this.clientConfig);
    }

    public GetPool(): Pool {
        return this.pool;
    }
}