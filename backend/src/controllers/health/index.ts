import * as express from "express";


const HealthRouter = express.Router();

HealthRouter.get("/", (req: express.Request, res: express.Response) => {
    res.sendStatus(200);
  });

export default HealthRouter;
