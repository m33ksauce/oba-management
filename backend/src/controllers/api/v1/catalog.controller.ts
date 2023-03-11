import * as express from "express";

const CatalogController = express.Router();

CatalogController
    .get("/", (req: express.Request, res: express.Response) => {
        // const translation = res.locals.translation;

    });

export default CatalogController;
