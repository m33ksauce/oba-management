import * as express from "express";
import AudioController from "./audio.controller";
import ReleaseController from "./release.controller";


const apiRouter = express.Router();

apiRouter.use('/release', ReleaseController);
apiRouter.use('/audio', AudioController);

export default apiRouter;