import * as express from "express";
import ReleaseController from "./release.controller";


const apiRouter = express.Router();

apiRouter.use('/release', ReleaseController)

export default apiRouter;