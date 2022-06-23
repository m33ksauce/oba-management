import * as express from "express";
import AudioController from "./audio.controller";
import releaseController from "./release.controller";


const apiRouter = express.Router();

apiRouter.use("/release", releaseController);
apiRouter.use("/audio", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    next();
});
apiRouter.use("/audio", AudioController);

export default apiRouter;
