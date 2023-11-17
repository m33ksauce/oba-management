import { SqlStore } from "../store/sql.store";
import { CreateTranslationInfoDTO, ReadTranslationInfoDTO, UpdateTranslationInfoDTO } from "../dto/translation.dto";
import { TranslationInfoDTOMappers } from "../mappers/translation.mappers";
import ILogger from "./ilogger.interface";

export class TranslationService {
    private logger: ILogger;
    private sqlStore: SqlStore;

    constructor(logger: ILogger, sqlStore: SqlStore) {
        this.logger = logger;
        this.sqlStore = sqlStore;
    }

    async create(
            translation: string,
            settings: CreateTranslationInfoDTO
        ): Promise<ReadTranslationInfoDTO> {
            let client = await this.sqlStore.GetPool().connect();
            
            let createQuery = `INSERT INTO 
                oba_admin.translations(translation, settings_object)
                VALUES($1, $2)`;

            let params = [translation, settings]

            try {
                await client.query(createQuery, params);
                return this.find(translation);
            } catch (e: any) {
                if (e.code === "23505") {
                    throw 400;
                }
                this.logger.Error("exception", e.message);
                throw 500;
            } finally {
                client.release();
            }
            
    }

    async find(translation: string): Promise<ReadTranslationInfoDTO> {
        let client = await this.sqlStore.GetPool().connect();

        let findQuery = `SELECT tr.id, tr.settings_object, tr.latest_version
            FROM oba_admin.translations as tr
            WHERE tr.translation=$1`;

        let params = [ translation ];
        
        try {
            let result =  await client.query(findQuery, params);
            
            if (result.rowCount <= 0) {
                throw new Error("Not found");
            }
            return TranslationInfoDTOMappers.FromDB(result.rows.shift());
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            throw 500;
        } finally {
            client.release();
        }
    }

    async update(translation: string, settings: UpdateTranslationInfoDTO): Promise<ReadTranslationInfoDTO> {
        let client = await this.sqlStore.GetPool().connect();

        let updateQuery = `UPDATE oba_admin.translations
            SET settings_object=$1
            WHERE translation=$2;`;

        let params = [settings, translation];

        try {
            await client.query(updateQuery, params);
            return this.find(translation);
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            throw 500;
        } finally {
            client.release();
        }
    }
}