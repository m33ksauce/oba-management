import * as express from "express";
import { GetAppConfig } from "../../../config";
import { CreateCategoryDTO } from "../../../dto/dto";
import CategoryService from "../../../services/category.service";
import { LoggerService } from "../../../services/logger.service";
import { SqlStore } from "../../../store/sql.store";

const CategoryController = express.Router();

const logger = new LoggerService();
const sqlStore = new SqlStore();
const categoryService = new CategoryService(logger, sqlStore);
const config = GetAppConfig();

CategoryController
    .get("/:id", (req: express.Request, res: express.Response) => {
        // const translation = res.locals.translation;

    });

CategoryController
    .post("/", async (req: express.Request, res: express.Response) => {
        if (config.env != "dev") return res.sendStatus(401);
        const translation = res.locals.translation;
        const dto: CreateCategoryDTO = req.body;
        try {
            await categoryService.insert(translation, dto);
            return res.json({status: "success"});
        } catch (e) {
            res.statusCode = 500;
            return res.json({status: "failure", msg: "failed to insert"});
        }
    });

CategoryController
    .put("/:id", async (req: express.Request, res: express.Response) => {
        if (config.env != "dev") return res.sendStatus(401);
        // const translation = res.locals.translation;
        return res.json({status: "success"});
    });

CategoryController
    .delete("/:id", async (req: express.Request, res: express.Response) => {
        if (config.env != "dev") return res.sendStatus(401);
        const translation = res.locals.translation;
        if (req.params.id == undefined) return res.status(404);
        try {
            await categoryService.delete(translation, req.params.id);
            return res.json({status: "success"});
        } catch (e) {
            res.statusCode = 500;
            return res.json({status: "failure"})
        }
    })

export default CategoryController;
