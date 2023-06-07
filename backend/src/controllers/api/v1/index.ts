import * as express from "express";
import DummyAuthGuard from "../../../guards/dummyauth.guard";
import AudioController from "./audio.controller";
import CatalogController from "./catalog.controller";
import CategoryController from "./category.controller";
import ReleaseController from "./release.controller";
import CognitoAuthGuard from "../../../guards/cognitoauth.guard";

const TranslationRouter = express.Router();
const ApiV1Router = express.Router();

const translationMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const translation = (req.params['translation'] != undefined) 
        ? req.params['translation']
        : "yetfa";
    res.locals.translation = translation;
    next();
}

TranslationRouter.use("/", translationMiddleware, ApiV1Router); // Temporarily trap old version
TranslationRouter.use("/:translation", translationMiddleware, ApiV1Router);

ApiV1Router.use("/release", ReleaseController);
ApiV1Router.use("/audio", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    next();
});
ApiV1Router.use("/audio", AudioController);
ApiV1Router.use("/category", DummyAuthGuard, CategoryController);
ApiV1Router.use("/catalog", CognitoAuthGuard, CatalogController);

export default TranslationRouter;
