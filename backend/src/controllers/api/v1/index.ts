import * as express from "express";
import AudioController from "./audio.controller";
import releaseController from "./release.controller";


const ApiV1Router = express.Router();

ApiV1Router.use("/release", releaseController);
ApiV1Router.use("/audio", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    next();
});
ApiV1Router.use("/audio", AudioController);

export default ApiV1Router;
