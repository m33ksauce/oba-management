import * as express from "express";
import ReleaseController from "./controllers/release.controller";


const apiRouter = express.Router();

apiRouter.use('/release', ReleaseController)

export default apiRouter;