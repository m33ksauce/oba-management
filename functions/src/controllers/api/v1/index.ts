import * as express from "express";
import AudioController from "./audio.controller";
import releaseController from "./release.controller";


const apiRouter = express.Router();

apiRouter.use("/release", releaseController);
apiRouter.use("/audio", AudioController);

export default apiRouter;
