import { CreateCategoryDTO, ReadCategoryDTO, UpdateCategoryDTO } from "../dto/dto";
import { CategoryModel } from "../models/models";
import { SqlStore } from "../store/sql.store";
import ILogger from "./ilogger.interface";
import { v4 as uuidV4 } from 'uuid';
import { ReadCategoryDTOMappers } from "../mappers/category.mappers";

export class CategoryService {
    private logger: ILogger;
    private sqlStore: SqlStore

    constructor(logger: ILogger, sqlStore: SqlStore) {
        this.logger = logger.WithFields({ "service": "CatalogService" });
        this.sqlStore = sqlStore;
    }

    // Create
    //
    public async insert(translation: string, categoryDTO: CreateCategoryDTO): Promise<ReadCategoryDTO> {
        let client = this.sqlStore.GetClient();

        const newId = uuidV4();
        const parent_id = categoryDTO.parent_id;

        const insertQuery = `INSERT INTO oba_admin.categories(id, parent_id, name, translation_id) 
                                VALUES($1, ${parent_id != "" ? "$2" : "NULL"}, $3,
                                    (SELECT id from oba_admin.translations where translation=$4))`;
        const params = [newId, parent_id, categoryDTO.name, translation];

        try {
            await client.connect();
            await client.query(insertQuery, params);
            return this.get(translation, newId);
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            this.logger.Info(insertQuery)
            throw 500;
        } finally {
            client.end();
        }
    }

    // Read

    public async get(translation: string, id: string): Promise<ReadCategoryDTO> {
        let client = this.sqlStore.GetClient();

        const readQuery = `SELECT * from oba_admin.categories 
            WHERE id=$1 and translation_id=(
                SELECT id from oba_admin.translations where translation=$2
            )`;
        const params = [id, translation];

        try {
            await client.connect();
            let results = await client.query(readQuery, params);
            if (results.rowCount <= 0) {
                throw new Error("Not found");
            }
            return ReadCategoryDTOMappers.FromDB(results.rows.pop());
        } catch (e: any) {
            if (e.message == "Not found") {
                throw 404;
            }
            throw 500;
        } finally {
            client.end();
        }
    } 

    // Update

    public update(translation: string, updateDto: UpdateCategoryDTO): Promise<CategoryModel> {
        return Promise.reject();
    }

    // Delete

    public async delete(translation: string, id: string): Promise<void> {
        let client = this.sqlStore.GetClient();

        const deleteRootQuery = `DELETE FROM oba_admin.categories WHERE id=$1`;
        const deleteChildQuery = `DELETE FROM oba_admin.categories WHERE parent_id=$1`;

        const params = [id];

        try {
            await client.connect();
            await client.query(deleteChildQuery, params);
            await client.query(deleteRootQuery, params);
        } catch (e) {
            console.error(e);
            throw 500;   
        } finally {
            client.end();
        }
    }
}

export default CategoryService;
