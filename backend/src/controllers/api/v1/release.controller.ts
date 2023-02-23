import * as express from "express";
import { GetAppConfig } from "../../../config";
import { LoggerService } from "../../../services/logger.service";
import ReleaseService from "../../../services/release.service";
import S3Store from "../../../store/s3.store";


const ReleaseController = express.Router();

const store = new S3Store();
const logger = new LoggerService();
const releaseSvc = new ReleaseService(store, logger);
const config = GetAppConfig();

// releaseController.get("/", (req: express.Request, res: express.Response) => {
//     const translation = res.locals.translation;
    
//     releaseSvc.findAll(translation)
//         .then(data => res.json(data))
//         .catch(() => res.sendStatus(500))
// });

ReleaseController.get("/:id", (req: express.Request, res: express.Response) => {
    const translation = res.locals.translation;
    const version = req.params.id;

    releaseSvc.findOne(translation, version)
    .then((release) => {
        res.json(release);
    })
    .catch(() => res.sendStatus(500));
});

ReleaseController.post("/", (req: express.Request, res: express.Response) => {
    if (config.env != "dev") return res.sendStatus(401);
    const translation = res.locals.translation;
    const dto = req.body;
    releaseSvc.insert(translation, dto);
    releaseSvc.update(translation, "latest", dto);
    return res.json({Status: "success"});
});

ReleaseController.put("/:id", async (req: express.Request, res: express.Response) => {
    if (config.env != "dev") return res.sendStatus(401);
    const translation = res.locals.translation;
    const version = req.params.id;
    const dto = req.body;
    await releaseSvc.update(translation, version, dto);
    return res.json({Status: "success"});
});

ReleaseController.delete("/:id", async (req: express.Request, res: express.Response) => {
    if (config.env != "dev") return res.sendStatus(401);
    const translation = res.locals.translation;
    const version = req.params.id;
    releaseSvc.delete(translation, version);
    return res.status(200);
})

export default ReleaseController;
