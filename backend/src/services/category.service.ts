import { CreateCategoryDTO, ReadCategoryDTO, UpdateCategoryDTO } from "../dto/dto";
import { SqlStore } from "../store/sql.store";
import ILogger from "./ilogger.interface";
import { v4 as uuidV4, NIL as uuidNIL } from 'uuid';
import { ReadCategoryDTOMappers } from "../mappers/category.mappers";

export class CategoryService {
    private logger: ILogger;
    private sqlStore: SqlStore

    constructor(logger: ILogger, sqlStore: SqlStore) {
        this.logger = logger.WithFields({ "service": "CatalogService" });
        this.sqlStore = sqlStore;
    }

    // Create

    public async insert(translation: string, categoryDTO: CreateCategoryDTO): Promise<ReadCategoryDTO> {
        let client = this.sqlStore.GetClient();

        const newId = uuidV4();
        const parent_id = categoryDTO.parent_id != "" 
            ? categoryDTO.parent_id 
            : uuidNIL;

        const insertQuery = `INSERT INTO oba_admin.categories(id, parent_id, name, translation_id) 
                                VALUES($1, $2, $3,
                                    (SELECT id from oba_admin.translations where translation=$4))`;
        const params = [newId, parent_id, categoryDTO.name, translation];

        try {
            await client.connect();
            await client.query(insertQuery, params);
            return this.findOne(translation, newId);
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            this.logger.Info(insertQuery)
            throw 500;
        } finally {
            client.end();
        }
    }

    // Read

    public async find(translation: string): Promise<ReadCategoryDTO[]> {
        let client = this.sqlStore.GetClient();

        const readQuery = `
            select cat.id, cat.parent_id, cat.name, '' as target
                from oba_admin.categories as cat
                WHERE translation_id=(
                    SELECT id from oba_admin.translations where translation=$1
                )
            union
            select aud.id, aud.category_id as parent_id, aud.name, aud.bucket_path as target
                from oba_admin.audio as aud
                where aud.category_id in (
                    select id from oba_admin.categories
                    WHERE translation_id=(
                        SELECT id from oba_admin.translations where translation=$1
                    ));`
            
        try {
            await client.connect();
            let results = await client.query(readQuery, [translation])
            if (results.rowCount <= 0) {
                throw new Error("Not found");
            }
            return results.rows.map(ReadCategoryDTOMappers.FromDB);
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            if (e.message == "Not found") {
                throw 404;
            }
            throw 500;
        } finally {
            client.end();
        }
    }

    public async findOne(translation: string, id: string): Promise<ReadCategoryDTO> {
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
            return ReadCategoryDTOMappers.FromDB(results.rows.shift());
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            if (e.message == "Not found") {
                throw 404;
            }
            throw 500;
        } finally {
            client.end();
        }
    } 

    // Update

    public async update(translation: string, id: string, updateDto: UpdateCategoryDTO): Promise<ReadCategoryDTO> {
        let client = this.sqlStore.GetClient();

        const updateStub = `UPDATE oba_admin.categories SET `

        let i = 0;

        if (updateDto.parent_id == "") updateDto.parent_id = uuidNIL;
        if (updateDto.parent_id == undefined) updateDto.parent_id = "";

        if (updateDto.name == undefined) updateDto.parent_id = "";


        const nameUpdate = (updateDto.name == "") ? "" : `name = $${++i}`;
        const parentUpdate = (updateDto.parent_id == "") ? "" : `parent_id = $${++i}`

        let sets = "";

        if (nameUpdate != "") sets += nameUpdate;
        if (sets != "" && parentUpdate != "") sets += ", ";
        if (parentUpdate != "") sets += parentUpdate;

        const whereStub = ` WHERE id=$${++i}`;

        const query = updateStub + sets + whereStub;

        console.log(query);
        
        let params = [];
        if (nameUpdate != "") params.push(updateDto.name);
        if (parentUpdate != "") params.push(updateDto.parent_id);
        params.push(id);

        try {
            await client.connect();
            await client.query(query, params);
            return this.findOne(translation, id);
        } catch (e: any) {
            this.logger.Error("exception", e.message);
            this.logger.Info(query);
            throw 500;
        } finally {
            client.end();
        }
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
