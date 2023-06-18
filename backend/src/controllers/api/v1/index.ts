import * as express from "express";
import AudioController from "./audio.controller";
import CatalogController from "./catalog.controller";
import CategoryController from "./category.controller";
import ReleaseController from "./release.controller";
import TranslationController from "./translation.controller";
import CreateTranslationHandler from "./createTranslation.handler";
import CognitoGuards from "../../../guards/cognitoauth.guard";

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

// Specific use of translation when creating
TranslationRouter.post("/:translation/createNew", translationMiddleware, CreateTranslationHandler);

TranslationRouter.use("/:translation", translationMiddleware, ApiV1Router);

ApiV1Router.use("/release", ReleaseController);
ApiV1Router.use("/audio", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    next();
});
ApiV1Router.use("/audio", AudioController);
ApiV1Router.use("/category", CognitoGuards.canUseTranslationGuard, CategoryController);
ApiV1Router.use("/catalog", CognitoGuards.canUseTranslationGuard, CatalogController);
ApiV1Router.use("/translation", CognitoGuards.canUseTranslationGuard, TranslationController);

ApiV1Router.get("/authtest", CognitoGuards.canUseTranslationGuard, (req, res) => {
    res.send("Works!")
})

export default TranslationRouter;
