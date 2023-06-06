import * as express from "express";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../../../dto/dto";
import CategoryService from "../../../services/category.service";
import { LoggerService } from "../../../services/logger.service";
import { SqlStore } from "../../../store/sql.store";
import { NIL as uuidNIL } from "uuid";

const CategoryController = express.Router();

const logger = new LoggerService();
const sqlStore = new SqlStore();
const categoryService = new CategoryService(logger, sqlStore);

CategoryController
    .get("/:id", async (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;
        if (req.params.id == undefined) return res.status(404).send();
        const id = req.params.id;
        try {
            let result = await categoryService.findOne(translation, id);
            return res.json(result);
        } catch (e) {
            res.statusCode = 500;
            return res.json({status: "failure", msg: "server error"});
        }
    });

CategoryController
    .post("/", async (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;
        const dto: CreateCategoryDTO = req.body;
        try {
            let result = await categoryService.insert(translation, dto);
            return res.json({status: "success", result: result});
        } catch (e) {
            res.statusCode = 500;
            return res.json({status: "failure", msg: "failed to insert"});
        }
    });

CategoryController
    .put("/:id", async (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;
        if (req.params.id == undefined) return res.status(404).send();
        const id = req.params.id;
        const dto: UpdateCategoryDTO = req.body;
        try {
            let result = await categoryService.update(translation, id, dto);
            return res.json({status: "success", result: result});
        } catch (e) {
            res.statusCode = 500;
            return res.json({status: "failure", msg: "failed to update"});
        }
    });

CategoryController
    .delete("/:id", async (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;
        if (req.params.id == undefined) return res.status(404).send();
        if (req.params.id == uuidNIL) return res.status(406).send();
        try {
            await categoryService.delete(translation, req.params.id);
            return res.json({status: "success"});
        } catch (e) {
            res.statusCode = 500;
            return res.json({status: "failure"})
        }
    })

export default CategoryController;
