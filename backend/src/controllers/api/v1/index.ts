import * as express from "express";
import AudioController from "./audio.controller";
import releaseController from "./release.controller";

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

ApiV1Router.use("/release", releaseController);
ApiV1Router.use("/audio", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    next();
});
ApiV1Router.use("/audio", AudioController);

export default TranslationRouter;
