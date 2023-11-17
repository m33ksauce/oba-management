import { CreateUserDTO, ReadUserDTO } from "../dto/user.dto";
import { ReadUserDTOMappers } from "../mappers/user.mappers";
import { SqlStore } from "../store/sql.store";
import ILogger from "./ilogger.interface";

export class UserService {
    private logger: ILogger;
    private sqlStore: SqlStore

    constructor(logger: ILogger, sqlStore: SqlStore) {
        this.logger = logger;
        this.sqlStore = sqlStore;
    }

    public async create(dto: CreateUserDTO): Promise<boolean> {
        let client = await this.sqlStore.GetPool().connect();
        
        const insertUserQuery = 
            `INSERT INTO oba_admin.users(email)
                VALUES($1)`;

        const params = [dto.email];

        try {
            await client.query(insertUserQuery, params);
            return true;
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            return false;
        } finally {
            client.release();
        }
    }

    public async find(email: string): Promise<ReadUserDTO> {
        let client = await this.sqlStore.GetPool().connect();

        const readUserQuery = `SELECT u.email, t.translation, t.latest_version
            FROM oba_admin.users as u
            LEFT JOIN oba_admin.translations as t 
                ON u.default_translation = t.id
            WHERE email = $1;`;

        const translationsQuery = `SELECT t.translation
            FROM oba_admin.translation_access as ta
            INNER JOIN oba_admin.translations as t
                ON ta.translation_id = t.id
            WHERE ta.user_email = $1;`;

        const params = [email]

        try {
            let userResult = await client.query(readUserQuery, params);
            let translationsResult = await client.query(translationsQuery, params);

            if (userResult.rowCount <= 0) {
                throw new Error("Not found");
            } // We only really care that we got a user!

            let user = userResult.rows.map(ReadUserDTOMappers.FromDB).pop();
            if (user == undefined) {
                throw new Error("Not found");
            }

            translationsResult.rows.map(v => {
                user?.available_translations.push(v.translation)
            });

            return user;
        } catch (e: any) {
            if (e.message == "Not found") {
                throw 404;
            }
            this.logger.Error("exception", e.message);
            throw 500;
        } finally {
            client.release();
        }
    }

    public async grantTranslationAccess(translationId: string, email: string) {
        let client = await this.sqlStore.GetPool().connect();

        const defaultTranslationQuery = `
            UPDATE oba_admin.users
            SET default_translation = $1
            WHERE email = $2
            AND default_translation IS NULL;
        `;
            
        const accessQuery = `
            INSERT INTO oba_admin.translation_access(translation_id, user_email)
            VALUES ($1, $2);
        `;

        const params = [translationId, email];

        try {
            await client.query(defaultTranslationQuery, params);
            await client.query(accessQuery, params);
            return true;
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            return false;
        } finally {
            client.release();
        }
    }
}