import * as express from "express";
import { GetAppConfig } from "../../../config";
import CategoryService from "../../../services/category.service";
import { LoggerService } from "../../../services/logger.service";

const CategoryController = express.Router();

const logger = new LoggerService();
const categoryService = new CategoryService(logger);
const config = GetAppConfig();

CategoryController
    .get("/", async (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;

        let categories = await categoryService.getAll(translation);
        res.send(categories);
})

CategoryController
    .get("/:id", (req: express.Request, res: express.Response) => {
        // const translation = res.locals.translation;

    });

CategoryController
    .post("/", (req: express.Request, res: express.Response) => {
        if (config.env != "dev") return res.sendStatus(401);
        // const translation = res.locals.translation;
        return res.json({Status: "success"});
    });

CategoryController
    .put("/:id", async (req: express.Request, res: express.Response) => {
        if (config.env != "dev") return res.sendStatus(401);
        // const translation = res.locals.translation;
        return res.json({Status: "success"});
    });

CategoryController
    .delete("/:id", async (req: express.Request, res: express.Response) => {
        if (config.env != "dev") return res.sendStatus(401);
        // const translation = res.locals.translation;
        return res.status(200);
    })

export default CategoryController;
