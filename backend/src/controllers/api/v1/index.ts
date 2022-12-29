import * as express from "express";
import AudioController from "./audio.controller";
import releaseController from "./release.controller";

const TranslationRouter = express.Router();
const ApiV1Router = express.Router();

TranslationRouter.use("/", ApiV1Router); // Temporarily trap old version
TranslationRouter.use("/:translation", ApiV1Router);

ApiV1Router.use("/release", releaseController);
ApiV1Router.use("/audio", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    next();
});
ApiV1Router.use("/audio", AudioController);

export default TranslationRouter;
